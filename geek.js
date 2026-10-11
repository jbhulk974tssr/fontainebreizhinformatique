/* geek.js — à charger avec <script src="geek.js" defer></script> */
(() => {
/* ===== À PERSONNALISER ===== */
const WA = 'https://wa.me/33651854152';
const AVIS_URL = 'https://g.page/r/CSgDCZu_QT99EBM/review';
const FICHE_URL = 'https://share.google/q0WLynfvsGCFjCLWZ';
// Colle ici tes vrais avis Google : {nom:'Prénom N.', date:'septembre 2026', note:5, texte:'...'}
const AVIS = [];
const PC_SAUVES = 0; // mets ton vrai chiffre, masqué si 0
const HORAIRES = {1:[9,19],2:[9,19],3:[9,19],4:[9,19],5:[9,19],6:[9,12]}; // 0 = dimanche
/* =========================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const setTheme = (c, g) => { root.style.setProperty('--vert-celte', c); root.style.setProperty('--vert-celte-glow', g); };
const THEMES = {jedi:['#38bdf8','rgba(56,189,248,.6)'], vador:['#dc2626','rgba(220,38,38,.6)'], reset:['#009B4D','rgba(0,155,77,.4)']};
const go = id => document.getElementById(id)?.scrollIntoView({behavior: reduced ? 'auto' : 'smooth'});
const openUrl = u => window.open(u, '_blank', 'noopener');

/* --- Correctif XSS : remplace renderArticles du site (flux RSS échappés) --- */
window.renderArticles = function (map) {
  for (const [id, list] of Object.entries(map)) {
    const box = document.getElementById(id); if (!box) continue;
    box.innerHTML = '';
    list.forEach(a => {
      const cls = a.theme === 'mobile' ? 'mobile' : a.theme === 'linux' ? 'gaming' : '';
      const link = /^https?:\/\//.test(a.link) ? a.link : '#';
      const d = new Date(a.pubDate).toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'});
      box.insertAdjacentHTML('beforeend', `<div class="news-card ${cls}"><span class="news-date">${esc(d)}</span><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p><a href="${esc(link)}" target="_blank" rel="noopener">Lire l'article source →</a></div>`);
    });
  }
};

/* --- Boot : clic ou Échap pour passer, désactivé si mouvement réduit --- */
const boot = $('#boot-screen');
if (boot) {
  const skip = () => { boot.style.display = 'none'; sessionStorage.setItem('bootSeen', 'true'); };
  if (reduced) skip();
  boot.addEventListener('click', skip);
  addEventListener('keydown', e => { if (e.key === 'Escape' && boot.style.display !== 'none') skip(); });
}

/* --- Matrix --- */
const hero = $('.hero');
let mxOn = !reduced;
if (hero) {
  const c = document.createElement('canvas'); c.id = 'mx'; hero.prepend(c);
  const x = c.getContext('2d'); let drops = [];
  const fit = () => { c.width = hero.clientWidth; c.height = hero.clientHeight; drops = Array.from({length: Math.floor(c.width / 16)}, () => -Math.random() * 50); };
  fit(); addEventListener('resize', fit);
  const chars = '01アイウエオカキクケコ<>/{}$#';
  (function draw() {
    if (mxOn) {
      x.fillStyle = 'rgba(15,23,42,.12)'; x.fillRect(0, 0, c.width, c.height);
      x.fillStyle = getComputedStyle(root).getPropertyValue('--vert-celte'); x.font = '14px "Fira Code",monospace';
      drops.forEach((d, i) => { x.fillText(chars[Math.random() * chars.length | 0], i * 16, d * 16); drops[i] = d * 16 > c.height && Math.random() > .975 ? 0 : d + 1; });
    } else x.clearRect(0, 0, c.width, c.height);
    requestAnimationFrame(draw);
  })();
  const b = document.createElement('button'); b.className = 'mx-toggle'; b.textContent = 'matrix: ' + (mxOn ? 'on' : 'off');
  b.onclick = () => { mxOn = !mxOn; b.textContent = 'matrix: ' + (mxOn ? 'on' : 'off'); };
  hero.append(b);
  window.toggleMatrix = () => b.click();

  /* Badge disponibilité */
  const p = new Date(new Date().toLocaleString('en-US', {timeZone: 'Europe/Paris'}));
  const h = HORAIRES[p.getDay()], t = p.getHours() + p.getMinutes() / 60;
  const open = h && t >= h[0] && t < h[1];
  const badge = document.createElement('div'); badge.className = 'avail';
  badge.textContent = open ? '🟢 En ligne · réponse rapide sur WhatsApp' : '🔴 Hors ligne · je réponds dès la reprise';
  hero.querySelector('h1').before(badge);

  /* Machine à écrire */
  const sp = $('h1 span', hero);
  if (sp && !reduced) {
    const mots = ['réussite', 'sérénité', 'autonomie', 'performance']; let i = 0, j = mots[0].length, del = true;
    (function tick() {
      sp.textContent = mots[i].slice(0, j);
      if (del) { j--; if (j < 0) { del = false; i = (i + 1) % mots.length; j = 0; } }
      else { j++; if (j > mots[i].length) { del = true; j = mots[i].length; setTimeout(tick, 1800); return; } }
      setTimeout(tick, del ? 45 : 90);
    })();
  }
  if (PC_SAUVES > 0) {
    const s = document.createElement('p'); s.className = 'stat-line';
    s.innerHTML = '<b id="cnt">0</b> PC sauvés de la poubelle'; hero.append(s);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const el = $('#cnt'), t0 = performance.now();
      (function f(n) { const k = Math.min(1, (n - t0) / 1500); el.textContent = Math.round(PC_SAUVES * k); if (k < 1) requestAnimationFrame(f); })(t0);
    }); io.observe(s);
  }
}

/* --- Quiz : vrai verdict selon les réponses --- */
const ans = [];
document.addEventListener('click', e => { const b = e.target.closest('.quiz-btn'); if (b) ans.push($$('.quiz-btn', b.parentNode).indexOf(b)); }, true);
const origNext = window.nextQuestion;
window.nextQuestion = function (step) {
  origNext(step);
  if (step !== 2) return;
  const a = ans.slice(-2);
  const V = [
    ['PC lent : un diagnostic est inclus, puis optimisation ou passage à Linux Mint (réinstallation OS à 79 €).', 'PC lent'],
    ['Visibilité : le community management (sur devis) est fait pour ça.', 'visibilité réseaux sociaux'],
    ['Renouvellement : je conseille sans vendre de matériel, pour garder l\'existant tant que c\'est pertinent.', 'conseil matériel']];
  const [txt, sujet] = V[a[0]] || V[0];
  $('#quiz-verdict').textContent = txt;
  $('#quiz-result a').href = `${WA}?text=${encodeURIComponent('Bonjour, j\'ai fait le test sur votre site (' + sujet + '). J\'aimerais prendre rendez-vous.')}`;
};

/* --- Avis Google --- */
const nav = $('.nav-links');
const rv = document.createElement('section'); rv.className = 'reviews-section'; rv.id = 'avis';
const cards = AVIS.map(a => `<div class="review-card"><span class="stars">${'★'.repeat(a.note || 5)}</span><p>« ${esc(a.texte)} »</p><div class="review-author"><i class="fab fa-google" style="color:#4285F4"></i> ${esc(a.nom)} · ${esc(a.date)}</div></div>`).join('');
rv.innerHTML = `<h2>Ils m'ont fait confiance</h2>
<div class="reviews-score"><i class="fab fa-google"></i><span class="stars">★★★★★</span><span>Avis publiés sur Google</span></div>
${cards ? `<div class="cards-container">${cards}</div>` : `<p class="review-empty">Un dépannage ou un accompagnement qui s'est bien passé ? Votre avis aide d'autres habitants du bassin rennais à me trouver.</p>`}
<div class="review-actions">
${cards ? `<a class="btn" href="${FICHE_URL}" target="_blank" rel="noopener"><i class="fab fa-google"></i> Voir tous les avis</a>` : ''}
<a class="btn" href="${AVIS_URL}" target="_blank" rel="noopener"><i class="fas fa-pen"></i> Laisser un avis</a></div>`;
$('#actualites')?.before(rv);

/* --- Labo --- */
const lab = document.createElement('section'); lab.className = 'lab'; lab.id = 'lab';
lab.innerHTML = `<h2>🧪 Le labo geek</h2><p class="lab-intro">Trois outils pour jouer. Tout tourne dans votre navigateur, rien n'est envoyé.</p>
<div class="lab-grid">
 <div class="lab-box"><h3>Terminal</h3><small>Tapez help</small>
  <div class="term" id="term"><div id="tout"></div><div class="term-row"><span>$</span><input id="tin" autocomplete="off" spellcheck="false" aria-label="Terminal"></div></div></div>
 <div class="lab-box"><h3>Ma machine vue par un tech</h3><small>Scan local de votre navigateur</small>
  <button class="lab-btn" id="scan-go">Lancer le scan</button><div id="scan-out"></div></div>
 <div class="lab-box"><h3>Testeur de mot de passe</h3><small>Rien n'est envoyé ni enregistré</small>
  <input type="password" id="pwd" placeholder="Saisissez un mot de passe" autocomplete="off" aria-label="Mot de passe à tester">
  <div class="bar"><i id="pbar"></i></div><div id="ptxt" class="verdict">En attente…</div></div>
</div>`;
$('.interactive-section')?.after(lab);

/* Terminal */
const tout = $('#tout'), tin = $('#tin'), hist = []; let hi = 0;
const say = (t, cls) => { const p = document.createElement('pre'); p.textContent = t; if (cls) p.style.opacity = .7; tout.append(p); $('#term').scrollTop = 1e6; };
const CMD = {
  help: () => 'help, whoami, ls, cat tarifs.txt, neofetch, ping, contact, avis, matrix, theme jedi|vador|reset, clear',
  whoami: () => 'jean-baptiste · titre pro TSSR · Pleumeleuc (35)',
  ls: () => 'prestations/  linux/  avis/  tarifs.txt  contact.sh',
  'cat tarifs.txt': () => 'Diagnostic ......... inclus\nWi-Fi .............. 49 €\nDésinfection ....... 65 €\nRéinstall OS ....... 79 €\nDéplacement ........ offert (15 km)',
  neofetch: () => 'OS: Fontaine-Breizh 26.10 (rolling)\nHost: Pleumeleuc, Bretagne\nShell: bzh-sh\nMascotte: belette + Tux\nCoffee: 3 / 3 ☕',
  ping: () => 'PING fontainebreizhinformatique.fr\n64 bytes: time=0.4 ms (service de proximité)',
  contact: () => { openUrl(WA); return 'Ouverture de WhatsApp…'; },
  avis: () => { openUrl(AVIS_URL); return 'Merci d\'avance !'; },
  matrix: () => (window.toggleMatrix?.(), 'matrix basculée'),
  clear: () => { tout.innerHTML = ''; return null; },
  'sudo rm -rf /': () => 'Permission refusée. Ce site est gardé par une belette.'
};
say('Bienvenue. Tapez help pour commencer.');
tin.addEventListener('keydown', e => {
  e.stopPropagation();
  if (e.key === 'ArrowUp') { hi = Math.max(0, hi - 1); tin.value = hist[hi] || ''; e.preventDefault(); }
  if (e.key !== 'Enter') return;
  const v = tin.value.trim(); tin.value = ''; if (!v) return;
  hist.push(v); hi = hist.length; say('$ ' + v, 1);
  const m = v.match(/^theme (jedi|vador|reset)$/);
  const out = m ? (setTheme(...THEMES[m[1]]), 'thème : ' + m[1]) : (CMD[v.toLowerCase()] ? CMD[v.toLowerCase()]() : 'commande inconnue : ' + v + ' (essayez help)');
  if (out) say(out);
});
$('#term').addEventListener('click', () => tin.focus());

/* Scan machine */
$('#scan-go').onclick = () => {
  const ua = navigator.userAgent, n = navigator;
  const nav_ = /Firefox\//.test(ua) ? 'Firefox' : /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Autre';
  const cores = n.hardwareConcurrency || 0, mem = n.deviceMemory || 0;
  const rows = [['Système', n.userAgentData?.platform || n.platform || 'n/a'], ['Navigateur', nav_], ['Cœurs CPU', cores || 'n/a'],
    ['Mémoire (indicatif)', mem ? '≥ ' + mem + ' Go' : 'non communiquée'], ['Écran', `${screen.width}×${screen.height} @${devicePixelRatio}x`],
    ['Réseau', n.connection?.effectiveType || 'n/a'], ['Langue', n.language]];
  const modest = (cores && cores <= 2) || (mem && mem <= 4);
  $('#scan-out').innerHTML = `<table class="scan-table">${rows.map(r => `<tr><td>${r[0]}</td><td>${esc(r[1])}</td></tr>`).join('')}</table>
  <p class="verdict">${modest ? '💡 Machine modeste : Linux Mint ou Zorin OS lui offrirait une seconde vie.' : '✅ Machine correcte : optimisation ou passage à Linux, au choix.'}</p>`;
};

/* Mot de passe */
const COMMUNS = ['123456', 'password', 'azerty', 'qwerty', 'motdepasse', 'admin', '123456789', '000000', 'azerty123', 'iloveyou'];
$('#pwd').addEventListener('input', e => {
  e.stopPropagation(); const v = e.target.value;
  if (!v) { $('#pbar').style.width = 0; $('#ptxt').textContent = 'En attente…'; return; }
  const pool = (/[a-z]/.test(v) ? 26 : 0) + (/[A-Z]/.test(v) ? 26 : 0) + (/\d/.test(v) ? 10 : 0) + (/[^A-Za-z0-9]/.test(v) ? 32 : 0);
  let bits = v.length * Math.log2(pool || 1); if (COMMUNS.includes(v.toLowerCase())) bits = 8;
  const s = Math.pow(2, bits) / 2e10;
  const dur = s < 1 ? 'instantané' : s < 3600 ? Math.round(s / 60 + .5) + ' min' : s < 86400 * 365 ? Math.round(s / 86400) + ' jours' : s < 86400 * 365e3 ? Math.round(s / 31536000) + ' ans' : 'des siècles';
  const lvl = bits < 40 ? ['Faible', '#dc2626'] : bits < 60 ? ['Moyen', '#f59e0b'] : bits < 80 ? ['Bon', '#38bdf8'] : ['Excellent', '#00c853'];
  $('#pbar').style.width = Math.min(100, bits) + '%'; $('#pbar').style.background = lvl[1];
  $('#ptxt').textContent = `${lvl[0]} · ~${Math.round(bits)} bits · craquage estimé : ${dur}. Astuce : une phrase de passe longue.`;
});

/* --- Palette Ctrl+K --- */
const ACTIONS = [
  ['Prestations', () => go('prestations')], ['Avis clients', () => go('avis')], ['Labo geek', () => go('lab')], ['Actualités IT', () => go('actualites')],
  ['Écrire sur WhatsApp', () => openUrl(WA)], ['Envoyer un e-mail', () => location.href = 'mailto:contact@fontainebreizhinformatique.fr'],
  ['Laisser un avis Google', () => openUrl(AVIS_URL)], ['Basculer la pluie Matrix', () => window.toggleMatrix?.()],
  ['Thème Jedi', () => setTheme(...THEMES.jedi)], ['Thème Vador', () => setTheme(...THEMES.vador)], ['Thème d\'origine', () => { setTheme(...THEMES.reset); document.body.classList.remove('hacker'); }]];
const pal = document.createElement('div'); pal.id = 'pal'; pal.setAttribute('role', 'dialog'); pal.setAttribute('aria-label', 'Palette de commandes');
pal.innerHTML = '<div class="pal-box"><input id="pin" placeholder="Que voulez-vous faire ?" autocomplete="off"><ul id="pul"></ul></div>';
document.body.append(pal);
let sel = 0, shown = [];
const draw = () => {
  const q = $('#pin').value.toLowerCase(); shown = ACTIONS.filter(a => a[0].toLowerCase().includes(q)); sel = Math.min(sel, Math.max(0, shown.length - 1));
  $('#pul').innerHTML = shown.map((a, i) => `<li class="${i === sel ? 'sel' : ''}" data-i="${i}">${esc(a[0])}</li>`).join('');
};
const run = i => { const a = shown[i]; closePal(); if (a) a[1](); };
const openPal = () => { pal.classList.add('open'); $('#pin').value = ''; sel = 0; draw(); $('#pin').focus(); };
const closePal = () => pal.classList.remove('open');
$('#pul').onclick = e => { const li = e.target.closest('li'); if (li) run(+li.dataset.i); };
pal.onclick = e => { if (e.target === pal) closePal(); };
$('#pin').addEventListener('input', e => { e.stopPropagation(); draw(); });
$('#pin').addEventListener('keydown', e => {
  e.stopPropagation();
  if (e.key === 'Escape') closePal();
  if (e.key === 'ArrowDown') { sel = Math.min(shown.length - 1, sel + 1); draw(); e.preventDefault(); }
  if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
  if (e.key === 'Enter') run(sel);
});
addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.classList.contains('open') ? closePal() : openPal(); } });
if (nav) {
  const li = document.createElement('li'); li.innerHTML = '<a href="#avis">Avis</a>'; nav.insertBefore(li, nav.lastElementChild);
  const li2 = document.createElement('li'); li2.innerHTML = '<a href="#" id="pal-open" title="Palette de commandes">Ctrl K</a>'; nav.insertBefore(li2, nav.lastElementChild);
  $('#pal-open').onclick = e => { e.preventDefault(); openPal(); };
}

/* --- Konami code --- */
const KON = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let kp = [];
addEventListener('keydown', e => {
  kp.push(e.key.length === 1 ? e.key.toLowerCase() : e.key); kp = kp.slice(-KON.length);
  if (kp.join() !== KON.join()) return;
  document.body.classList.toggle('hacker');
  const r = document.createElement('img'); r.src = 'mascotte.jpg'; r.alt = ''; r.className = 'runner'; document.body.append(r);
  setTimeout(() => r.remove(), 6200);
});
})();
