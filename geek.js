/* geek.js — Logique interactive (Responsive, 2 Avis Google, Pépite en haut & Labo en bas) */
(() => {
  const WA = 'https://wa.me/33651854152';
  const AVIS_URL = 'https://search.google.com/local/writereview?placeid=ChIJH4ggSQMorEIRKAMJm79BP30';
  const FICHE_URL = 'https://share.google/q0WLynfvsGCFjCLWZ';

  // Tes 2 vrais avis Google 5 étoiles (dont le dernier de Muriel SOPHIE)
  const AVIS = [
    {
      nom: 'Muriel SOPHIE',
      date: 'octobre 2026',
      note: 5,
      texte: 'Intervention à mon domicile très efficace ! Mon ordinateur a retrouvé toutes ses fonctionnalités. Je recommande vivement M.Fontaine, qui est une personne très agréable et professionnels.'
    },
    {
      nom: 'Florian Ramard',
      date: 'octobre 2026',
      note: 5,
      texte: 'Super compétent et efficace. Réaction très rapide'
    }
  ];

  const $ = (s, r = document) => r.querySelector(s); const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const setTheme = (c, g) => {
    root.style.setProperty('--vert-celte', c);
    root.style.setProperty('--vert-celte-glow', g);
  };
  const THEMES = {
    jedi: ['#38bdf8', 'rgba(56,189,248,.6)'],
    vador: ['#dc2626', 'rgba(220,38,38,.6)'],
    mando: ['#94a3b8', 'rgba(148,163,184,.55)'],
    reset: ['#009B4D', 'rgba(0,155,77,.4)']
  };
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  const openUrl = u => window.open(u, '_blank', 'noopener,noreferrer');

  /* --- 1. Menu Hamburger Mobile / Tablette --- */
  const navToggle = $('#nav-toggle'), navLinks = $('#nav-links'); if (navToggle && navLinks) { navToggle.onclick = () => { const isOpen = navLinks.classList.toggle('open'); navToggle.setAttribute('aria-expanded', isOpen); navToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>'; }; $$('a', navLinks).forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }));
  }

  /* --- 2. Hero : Matrix (OFF par défaut) + Machine à écrire --- */
  const hero = $('.hero');
  let mxOn = false;
  if (hero) {
    const c = document.createElement('canvas');
    c.id = 'mx';
    hero.prepend(c);
    const x = c.getContext('2d');
    let drops = [];
    const fit = () => {
      c.width = hero.clientWidth;
      c.height = hero.clientHeight;
      drops = Array.from({ length: Math.floor(c.width / 16) }, () => -Math.random() * 50);
    };
    fit();
    addEventListener('resize', fit);
    const chars = '01アイウエオカキクケコ<>/{}$#';
    (function draw() {
      if (mxOn) {
        x.fillStyle = 'rgba(15,23,42,.12)';
        x.fillRect(0, 0, c.width, c.height);
        x.fillStyle = getComputedStyle(root).getPropertyValue('--vert-celte');
        x.font = '14px "Fira Code",monospace';
        drops.forEach((d, i) => {
          x.fillText(chars[Math.random() * chars.length | 0], i * 16, d * 16);
          drops[i] = d * 16 > c.height && Math.random() > 0.975 ? 0 : d + 1;
        });
      } else {
        x.clearRect(0, 0, c.width, c.height);
      }
      requestAnimationFrame(draw);
    })();

    const b = document.createElement('button');
    b.className = 'mx-toggle';
    b.textContent = 'matrix: off';
    b.onclick = () => {
      mxOn = !mxOn;
      b.textContent = 'matrix: ' + (mxOn ? 'on' : 'off');
    };
    hero.append(b);
    window.toggleMatrix = () => b.click();

    const sp = $('h1 span', hero); if (sp && !reduced) { const mots = ['sérénité', 'réussite', 'tranquilité', 'autonomie']; let i = 0, j = mots[0].length, del = true; (function tick() { sp.textContent = mots[i].slice(0, j); if (del) { j--; if (j < 0) { del = false; i = (i + 1) \% mots.length; j = 0; } } else { j++; if (j > mots[i].length) { del = true; j = mots[i].length; setTimeout(tick, 2000); return; } } setTimeout(tick, del ? 45 : 90); })(); } }    /* --- 3. Mini-Quiz Interactif en haut de page --- */ const VERDICTS = [ [ 'Diagnostic inclus : je vérifie l\'état du système, supprime les virus/adwares (65 €) ou réinstalle un système propre (79 €).', 'PC lent ou infecté' ], [ 'Accompagnement Pro (sur devis) : je crée vos visuels et anime vos pages Facebook & Instagram pour attirer des clients locaux.', 'visibilité réseaux sociaux' ], [ 'Seconde vie Open Source (79 €) : avec Linux Mint ou Zorin OS, votre PC retrouve sa rapidité sans avoir à racheter d\'ordinateur.', 'passage à Linux' ] ]; $$('.quiz-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = +btn.dataset.choice || 0;
      const [txt, sujet] = VERDICTS[idx];
      $('#quiz-options').style.display = 'none';
      $('#quiz-subtitle').style.display = 'none';
      $('#quiz-question').textContent = 'Diagnostic préliminaire ✅';
      $('#quiz-verdict').textContent = txt;
      $('#quiz-wa').href = `${WA}?text=${encodeURIComponent('Bonjour Jean-Baptiste, j\'ai fait le test sur votre site (' + sujet + ') et j\'aimerais échanger avec vous.')}`;
      $('#quiz-result').style.display = 'block';
    };
  });
  $('#quiz-reset')?.addEventListener('click', () => {
    $('#quiz-question').textContent = '🛠️ Votre outil informatique vous freine ?';
    $('#quiz-subtitle').style.display = 'block';
    $('#quiz-options').style.display = 'grid';
    $('#quiz-result').style.display = 'none';
  });

  /* --- 4. Pépite Geek du jour (en haut de page + bouton changer) --- */
  const citations = [
    "Le DNS est toujours le coupable. Toujours. — Proverbe d'Admin Sys",
    "Fais-le ou ne le fais pas. Mais il n'y a pas d'essai. (Surtout en prod) — Maître Yoda",
    "Un jour Chuck Norris a fait un 'rm -rf /' et le serveur s'est excusé.",
    "Avez-vous essayé de l'éteindre et de le rallumer ? — The IT Crowd",
    "Il y a 10 types de personnes : ceux qui comprennent le binaire et les autres.",
    "Un bon administrateur système est quelqu'un qui a toujours une sauvegarde d'avance."
  ];
  const qEl = $('#daily-quote-text');
  let qIdx = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000) % citations.length;
  if (qEl) {
    qEl.textContent = `« ${citations[qIdx]} »`;
    $('#next-quote')?.addEventListener('click', () => {
      qIdx = (qIdx + 1) % citations.length;
      qEl.textContent = `« ${citations[qIdx]} »`;
    });
  }

  /* --- 5. Rendu des Avis Google --- */
  const list = $('#avis-list');
  if (list && AVIS.length) {
    list.innerHTML = AVIS.map(a => `
      <article class="card review">
        <span class="stars">${'★'.repeat(a.note || 5)}</span>
        <p>« ${esc(a.texte)} »</p>
        <strong><i class="fab fa-google" style="color:#4285F4"></i> ${esc(a.nom)} · ${esc(a.date)}</strong>
      </article>
    `).join('');
  }

  /* --- 6. Formulaire WhatsApp --- */
  $('#f')?.addEventListener('submit', e => {
    e.preventDefault();
    const prenom = $('#n').value.trim();
    const sujet = $('#b').value;
    const msg = $('#m').value.trim();
    const t = `Bonjour Jean-Baptiste, c'est ${prenom}. Besoin : ${sujet}.${msg ? ' Précisions : ' + msg : ''}`;
    openUrl(`${WA}?text=${encodeURIComponent(t)}`);
  });

  /* --- 7. Terminal BZH-SH (dans le Labo Geek en bas) --- */
  const tout = $('#tout'), tin = $('#tin'), term = $('#term'), hist = [];
  let hi = 0;
  if (tout && tin && term) {
    const say = (t, dim) => {
      const p = document.createElement('pre');
      p.textContent = t;
      if (dim) p.style.opacity = 0.7;
      tout.append(p);
      term.scrollTop = 1e6;
    };
    const CMD = {
      help: () => 'Commandes : help, whoami, ls, tarifs, avis, neofetch, ping, contact, matrix, theme jedi|vador|mando|reset, clear',
      whoami: () => 'jean-baptiste · Titre Pro TSSR (2026) · Pleumeleuc (35)',
      ls: () => 'prestations/  linux/  avis_5_etoiles.txt  tarifs.txt  contact.sh',
      tarifs: () => 'Diagnostic ......... inclus\nWi-Fi .............. 49 €\nDésinfection ....... 65 €\nRéinstall OS ....... 79 €\nPro ................ sur devis',
      'cat tarifs.txt': () => CMD.tarifs(),
      avis: () => '★★★★★ Muriel SOPHIE : "Intervention à mon domicile très efficace !"\n★★★★★ Florian Ramard : "Super compétent et efficace. Réaction très rapide"',
      neofetch: () => 'OS: Fontaine-Breizh IT 26.10\nHost: Pleumeleuc, Bretagne\nShell: bzh-sh\nMascotte: Belette + Tux\nAvis Google: 5.0/5 ★ (2 avis)',
      ping: () => 'PING fontainebreizhinformatique.fr : 64 bytes, time=0.4 ms (service local ultra-réactif)',
      contact: () => { openUrl(WA); return 'Ouverture de WhatsApp…'; },
      matrix: () => { window.toggleMatrix?.(); return 'Pluie Matrix basculée.'; },
      clear: () => { tout.innerHTML = ''; return null; },
      'sudo rm -rf /': () => 'Permission refusée : ce système est gardé par une belette bretonne 🦦.'
    };
    say('Bienvenue sur BZH-SH. Tapez help pour voir les commandes.');
    tin.addEventListener('keydown', e => {
      e.stopPropagation();
      if (e.key === 'ArrowUp') { hi = Math.max(0, hi - 1); tin.value = hist[hi] || ''; e.preventDefault(); }
      if (e.key !== 'Enter') return;
      const v = tin.value.trim();
      tin.value = '';
      if (!v) return;
      hist.push(v);
      hi = hist.length;
      say('$ ' + v, true);
      const m = v.toLowerCase().match(/^theme (jedi|vador|mando|reset)$/);
      const out = m
        ? (setTheme(...THEMES[m[1]]), `Thème activé : ${m[1]}`)
        : (CMD[v.toLowerCase()] ? CMD[v.toLowerCase()]() : `Commande inconnue : ${v} (tapez help)`);
      if (out) say(out);
    });
    term.addEventListener('click', () => tin.focus());
  }

  /* --- 8. Scanner de machine --- */
  $('#scan-go')?.addEventListener('click', () => {
    const ua = navigator.userAgent, n = navigator;
    const navName = /Firefox\//.test(ua) ? 'Firefox' : /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Navigateur standard';
    const cores = n.hardwareConcurrency || 0, mem = n.deviceMemory || 0;
    const rows = [
      ['Plateforme', n.userAgentData?.platform || n.platform || 'Détectée'],
      ['Navigateur', navName],
      ['Cœurs logiques CPU', cores || 'Non communiqué'],
      ['Mémoire vive', mem ? '≥ ' + mem + ' Go' : 'Masquée par le navigateur'],
      ['Écran', `${screen.width}×${screen.height} px`],
      ['Réseau', n.connection?.effectiveType || ' Haut débit']
    ];
    const modest = (cores && cores <= 2) || (mem && mem <= 4);
    $('#scan-out').innerHTML = `
      <table class="scan-table">${rows.map(r => `<tr><td>${r[0]}</td><td>${esc(r[1])}</td></tr>`).join('')}</table>
      <p class="verdict">${modest ? '💡 Configuration modeste : Linux Mint ou Zorin OS lui offrirait une seconde jeunesse.' : '✅ Configuration fluide : pensez simplement aux sauvegardes et à la propreté du système.'}</p>
    `;
  });

  /* --- 9. Testeur de mot de passe --- */
  const COMMUNS = ['123456', 'password', 'azerty', 'qwerty', 'motdepasse', 'admin', '123456789', '000000', 'azerty123'];
  $('#pwd')?.addEventListener('input', e => {
    e.stopPropagation();
    const v = e.target.value;
    if (!v) { $('#pbar').style.width = 0; $('#ptxt').textContent = 'En attente de saisie…'; return; }
    const pool = (/[a-z]/.test(v) ? 26 : 0) + (/[A-Z]/.test(v) ? 26 : 0) + (/\d/.test(v) ? 10 : 0) + (/[^A-Za-z0-9]/.test(v) ? 32 : 0);
    let bits = v.length * Math.log2(pool || 1);
    if (COMMUNS.includes(v.toLowerCase())) bits = 8;
    const s = Math.pow(2, bits) / 2e10;
    const dur = s < 1 ? 'instantané' : s < 3600 ? Math.round(s / 60 + 0.5) + ' min' : s < 86400 * 365 ? Math.round(s / 86400) + ' jours' : s < 86400 * 365e3 ? Math.round(s / 31536000) + ' ans' : 'des siècles';
    const lvl = bits < 40 ? ['Faible', '#dc2626'] : bits < 60 ? ['Moyen', '#f59e0b'] : bits < 80 ? ['Bon', '#38bdf8'] : ['Excellent', '#00c853'];
    $('#pbar').style.width = Math.min(100, bits) + '%';
    $('#pbar').style.background = lvl[1];
    $('#ptxt').textContent = `${lvl[0]} (~${Math.round(bits)} bits) · Craquage estimé : ${dur}.`;
  });

  /* --- 10. Palette Ctrl+K --- */
  const ACTIONS = [
    ['Voir les prestations et tarifs', () => go('services')],
    ['Lire les 2 avis clients 5★', () => go('avis')],
    ['Descendre au Labo Geek 🧪', () => go('lab')],
    ['Voir les actualités IT', () => go('actualites')],
    ['Écrire sur WhatsApp', () => openUrl(WA)],
    ['Laisser un avis Google', () => openUrl(AVIS_URL)],
    ['Activer / Désactiver la pluie Matrix', () => window.toggleMatrix?.()],
    ['Thème Jedi', () => setTheme(...THEMES.jedi)],
    ['Thème Vador', () => setTheme(...THEMES.vador)],
    ['Thème Mandalorian', () => setTheme(...THEMES.mando)],
    ['Réinitialiser le thème', () => { setTheme(...THEMES.reset); document.body.classList.remove('hacker'); }]
  ];

  const pal = document.createElement('div');
  pal.id = 'pal';
  pal.setAttribute('role', 'dialog');
  pal.setAttribute('aria-label', 'Palette de commandes');
  pal.innerHTML = '<div class="pal-box"><input id="pin" placeholder="Rechercher une action (tarifs, labo, matrix, jedi)..." autocomplete="off"><ul id="pul"></ul></div>';
  document.body.append(pal);

  let sel = 0, shown = [];
  const drawPal = () => {
    const q = $('#pin').value.toLowerCase();
    shown = ACTIONS.filter(a => a[0].toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    $('#pul').innerHTML = shown.map((a, i) => `<li class="${i === sel ? 'sel' : ''}" data-i="${i}">${esc(a[0])}</li>`).join('');
  };
  const runPal = i => { const a = shown[i]; closePal(); if (a) a[1](); };
  const openPal = () => { pal.classList.add('open'); $('#pin').value = ''; sel = 0; drawPal(); $('#pin').focus(); };
  const closePal = () => pal.classList.remove('open');

  $('#pul').onclick = e => { const li = e.target.closest('li'); if (li) runPal(+li.dataset.i); };
  pal.onclick = e => { if (e.target === pal) closePal(); };
  $('#pin').addEventListener('input', e => { e.stopPropagation(); drawPal(); });
  $('#pin').addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Escape') closePal();
    if (e.key === 'ArrowDown') { sel = Math.min(shown.length - 1, sel + 1); drawPal(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); drawPal(); e.preventDefault(); }
    if (e.key === 'Enter') runPal(sel);
  });
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      pal.classList.contains('open') ? closePal() : openPal();
    }
  });
  $('#pal-open')?.addEventListener('click', e => { e.preventDefault(); openPal(); });

  /* --- 11. Konami Code --- */
  const KON = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kp = [];
  addEventListener('keydown', e => {
    kp.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    kp = kp.slice(-KON.length);
    if (kp.join() !== KON.join()) return;
    document.body.classList.toggle('hacker');
    const r = document.createElement('img');
    r.src = 'mascotte.jpg';
    r.alt = '';
    r.className = 'runner';
    document.body.append(r);
    setTimeout(() => r.remove(), 6200);
  });
})();