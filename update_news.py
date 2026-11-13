#!/usr/bin/env python3
"""
Met à jour les 3 sections d'actualités de index.html (Informatique &
Sécurité / Mobile Android & iOS / Jeux vidéo) à partir de flux RSS, et
rafraîchit la date affichée en bas de la section.

Ne dépend que de la bibliothèque standard Python (aucune installation
nécessaire). Prévu pour tourner via GitHub Actions (voir
.github/workflows/update-news.yml), mais fonctionne aussi en local :

    python3 update_news.py

Si un flux est injoignable ou change de format, le script l'ignore et
laisse le contenu existant de cette catégorie intact : il ne casse
jamais le site.
"""
import re
import html
import datetime
from urllib.request import urlopen, Request
import xml.etree.ElementTree as ET

MAX_ITEMS = 3
DESC_MAX_LEN = 220
INDEX_FILE = "index.html"

# Une catégorie = un bloc de la page, délimité par des marqueurs
# <!-- XXX:START --> / <!-- XXX:END --> dans index.html, alimenté par
# un ou plusieurs flux RSS (utile pour combiner Android + iOS).
CATEGORIES = [
    {
        "marker": "NEWS",
        "css_class": "",  # carte "Informatique & Sécurité" = style par défaut
        "feeds": [
            "https://www.tomsguide.fr/category/web/securite/feed",
        ],
    },
    {
        "marker": "MOBILE",
        "css_class": "mobile",
        "feeds": [
            "https://www.tomsguide.fr/category/logiciels/android/feed",
            "https://www.tomsguide.fr/category/logiciels/ios/feed",
        ],
    },
    {
        "marker": "GAMING",
        "css_class": "gaming",
        "feeds": [
            "https://www.tomsguide.fr/category/gaming/feed",
        ],
    },
]


def fetch_feed(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; FontaineBreizhBot/1.0)"})
    with urlopen(req, timeout=20) as resp:
        return resp.read()


def strip_html(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text or "")
    return html.unescape(text).strip()


MOIS_FR = [
    "", "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
]


def format_date_fr(dt: datetime.datetime) -> str:
    return f"{dt.day} {MOIS_FR[dt.month]} {dt.year}"


def parse_pub_date(raw: str) -> datetime.datetime:
    try:
        return datetime.datetime.strptime(raw[:25].strip(), "%a, %d %b %Y %H:%M:%S")
    except ValueError:
        return datetime.datetime.min


def parse_items(xml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    items = []
    for item in root.findall(".//item"):
        title = strip_html(item.findtext("title", ""))
        link = (item.findtext("link", "") or "").strip()
        desc = strip_html(item.findtext("description", ""))
        if len(desc) > DESC_MAX_LEN:
            desc = desc[:DESC_MAX_LEN].rsplit(" ", 1)[0] + "…"

        pub_date_raw = item.findtext("pubDate", "") or ""
        dt = parse_pub_date(pub_date_raw)
        date_label = format_date_fr(dt) if dt != datetime.datetime.min else (pub_date_raw[:16] or "Récemment")

        if title and link:
            items.append({"title": title, "link": link, "desc": desc, "date": date_label, "_dt": dt})
    return items


def collect_category_items(feed_urls: list[str]) -> list[dict]:
    all_items = []
    for url in feed_urls:
        try:
            all_items.extend(parse_items(fetch_feed(url)))
        except Exception as exc:  # noqa: BLE001 - un flux en panne ne doit pas bloquer les autres
            print(f"  flux ignoré ({url}) : {exc}")
    all_items.sort(key=lambda it: it["_dt"], reverse=True)
    return all_items[:MAX_ITEMS]


def build_cards_html(items: list[dict], css_class: str) -> str:
    class_attr = f' {css_class}' if css_class else ""
    cards = []
    for it in items:
        cards.append(
            f'            <div class="news-card{class_attr}">\n'
            f'                <span class="news-date">{html.escape(it["date"])}</span>\n'
            f'                <h3>{html.escape(it["title"])}</h3>\n'
            f'                <p>{html.escape(it["desc"])}</p>\n'
            f'                <a href="{html.escape(it["link"])}" target="_blank" rel="noopener">'
            "Lire l'article source →</a>\n"
            "            </div>"
        )
    return "\n\n".join(cards)


def replace_block(content: str, marker: str, new_block: str) -> tuple[str, bool]:
    pattern = re.compile(
        rf"(<!-- {marker}:START.*?-->)(.*?)(<!-- {marker}:END -->)", re.DOTALL
    )
    if not pattern.search(content):
        print(f"  marqueurs {marker}:START / {marker}:END introuvables — bloc ignoré.")
        return content, False
    content = pattern.sub(lambda m: f"{m.group(1)}\n{new_block}\n            {m.group(3)}", content)
    return content, True


def main() -> None:
    with open(INDEX_FILE, encoding="utf-8") as f:
        content = f.read()

    any_update = False
    for cat in CATEGORIES:
        print(f"Catégorie {cat['marker']} :")
        items = collect_category_items(cat["feeds"])
        if not items:
            print("  aucun article récupéré, bloc laissé tel quel.")
            continue
        new_block = build_cards_html(items, cat["css_class"])
        content, updated = replace_block(content, cat["marker"], new_block)
        any_update = any_update or updated
        if updated:
            print(f"  {len(items)} article(s) mis à jour.")

    if not any_update:
        print("Rien à mettre à jour.")
        return

    today = datetime.date.today().strftime("%d/%m/%Y")
    content = re.sub(r'(<span id="news-updated">)[^<]*(</span>)', rf"\g<1>{today}\g<2>", content)

    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"index.html mis à jour ({today}).")


if __name__ == "__main__":
    main()
