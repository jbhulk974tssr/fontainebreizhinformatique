#!/usr/bin/env python3
"""
Met à jour la section "Actualités Informatiques" de index.html à partir
d'un flux RSS, et rafraîchit la date affichée en bas de section.

Ne dépend que de la bibliothèque standard Python (pas d'installation
nécessaire). Prévu pour tourner via GitHub Actions (voir
.github/workflows/update-news.yml), mais fonctionne aussi en local :

    python3 update_news.py
"""
import re
import html
import datetime
from urllib.request import urlopen, Request
import xml.etree.ElementTree as ET

# Choisis le flux qui correspond le mieux à ton public :
# - actu tech grand public : "https://www.numerama.com/feed/"
# - actu plus sécurité/pro : "https://www.it-connect.fr/feed/"
RSS_URL = "https://www.numerama.com/feed/"

INDEX_FILE = "index.html"
MAX_ITEMS = 3
DESC_MAX_LEN = 220


def fetch_feed(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; FontaineBreizhBot/1.0)"})
    with urlopen(req, timeout=20) as resp:
        return resp.read()


def strip_html(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text or "")
    return html.unescape(text).strip()


def parse_items(xml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    items = []
    for item in root.findall(".//item")[:MAX_ITEMS]:
        title = strip_html(item.findtext("title", ""))
        link = (item.findtext("link", "") or "").strip()
        desc = strip_html(item.findtext("description", ""))
        if len(desc) > DESC_MAX_LEN:
            desc = desc[:DESC_MAX_LEN].rsplit(" ", 1)[0] + "…"

        pub_date_raw = item.findtext("pubDate", "") or ""
        try:
            dt = datetime.datetime.strptime(pub_date_raw[:25].strip(), "%a, %d %b %Y %H:%M:%S")
            date_label = dt.strftime("%d %B %Y")
        except ValueError:
            date_label = pub_date_raw[:16] or "Récemment"

        if title and link:
            items.append({"title": title, "link": link, "desc": desc, "date": date_label})
    return items


def build_cards_html(items: list[dict]) -> str:
    cards = []
    for it in items:
        cards.append(
            '            <div class="news-card">\n'
            f'                <span class="news-date">{html.escape(it["date"])}</span>\n'
            f'                <h3>{html.escape(it["title"])}</h3>\n'
            f'                <p>{html.escape(it["desc"])}</p>\n'
            f'                <a href="{html.escape(it["link"])}" target="_blank" rel="noopener">'
            "Lire l'article source →</a>\n"
            "            </div>"
        )
    return "\n\n".join(cards)


def main() -> None:
    with open(INDEX_FILE, encoding="utf-8") as f:
        content = f.read()

    try:
        xml_bytes = fetch_feed(RSS_URL)
        items = parse_items(xml_bytes)
    except Exception as exc:  # noqa: BLE001 - on ne veut jamais casser le site
        print(f"Récupération du flux impossible ({exc}), le fichier n'est pas modifié.")
        return

    if not items:
        print("Aucun article récupéré, le fichier n'est pas modifié.")
        return

    new_block = build_cards_html(items)
    pattern = re.compile(r"(<!-- NEWS:START.*?-->)(.*?)(<!-- NEWS:END -->)", re.DOTALL)
    if not pattern.search(content):
        print("Marqueurs NEWS:START / NEWS:END introuvables dans index.html — abandon.")
        return

    content = pattern.sub(lambda m: f"{m.group(1)}\n{new_block}\n            {m.group(3)}", content)

    today = datetime.date.today().strftime("%d/%m/%Y")
    content = re.sub(r'(<span id="news-updated">)[^<]*(</span>)', rf"\g<1>{today}\g<2>", content)

    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"{len(items)} actualité(s) mise(s) à jour ({today}).")


if __name__ == "__main__":
    main()
