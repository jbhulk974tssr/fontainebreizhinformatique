(() => {
  const WA = 'https://wa.me/33651854152';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const THEMES = {
    jedi: ['#38bdf8', 'rgba(56,189,248,.6)'],
    vador: ['#dc2626', 'rgba(220,38,38,.6)'],
    mando: ['#94a3b8', 'rgba(148,163,184,.55)'],
    reset: ['#009B4D', 'rgba(0,155,77,.4)']
  };
  const setTheme = (c, g) => { root.style.setProperty('--g', c); root.style.setProperty('--glow', g); };
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  const open = u => window.open(u, '_blank', 'noopener,noreferrer');

  /* Menu mobile */
  const tg = $('#nav-toggle'), nl = $('#nav-links');
  if (tg && nl) {
    const close = () => {
      nl.classList.remove('open');
      tg.setAttribute('aria-expanded', 'false');
      tg.innerHTML = '<i class="fas fa-bars"></i>';
    };
    tg.onclick = () => {
      const o = nl.classList.toggle('open');
      tg.setAttribute('aria-expanded', String(o));
      tg.innerHTML = o ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    };
    $$('a', nl).forEach(a => a.addEventListener('click', close));
  }

  /* Mini-Quiz Interactif (Haut de page) */
  const quizChoices = [
    {
      verdict: 'Diagnostic inclus : un nettoyage système complet ou une désinfection (65 €) redonnera toute sa réactivité à votre ordinateur. Déplacement offert à domicile dans un rayon de 15 km autour de Pleumeleuc.',
      waText: 'Bonjour Jean-Baptiste, mon PC est lent ou infecté et je souhaiterais un diagnostic.'
    },
    {
      verdict: 'Accompagnement Pro sur devis : création de visuels, calendrier éditorial et animation de vos pages Facebook et Instagram pour booster votre visibilité locale.',
      waText: 'Bonjour Jean-Baptiste, je souhaite être accompagné pour la gestion de mes réseaux sociaux / conseil IT.'
    },
    {
      verdict: 'Ne jetez pas votre PC Windows 10 ! L\'installation clé en main de Linux Mint ou Zorin OS (79 €) lui offre une seconde vie rapide, sécurisée et sans licence à payer.',
      waText: 'Bonjour Jean-Baptiste, j\'aimerais donner une seconde vie à mon PC Windows 10 avec Linux.'
    }
  ];
  const qOpts = $('#quiz-options'), qRes = $('#quiz-result'), qVerd = $('#quiz-verdict'), qWa = $('#quiz-wa'), qReset = $('#quiz-reset');
  if (qOpts && qRes && qVerd && qWa) {
    $$('.quiz-btn', qOpts).forEach(btn => {
      btn.addEventListener('click', () => {
        const item = quizChoices[+btn.dataset.choice] || quizChoices[0];
        qVerd.textContent = item.verdict;
        qWa.href = `${WA}?text=${encodeURIComponent(item.waText)}`;
        qOpts.style.display = 'none';
        qRes.classList.add('active');
      });
    });
    qReset?.addEventListener('click', () => {
      qRes.classList.remove('active');
      qOpts.style.display = 'grid';
    });
  }

  /* Pépite Geek du jour */
  const QUOTES = [
    '« Le DNS est toujours le coupable. Toujours. »',
    '« Il y a 10 types de personnes dans le monde : celles qui comprennent le binaire, et les autres. »',
    '« Une sauvegarde n\'existe vraiment que si on a testé sa restauration. »',
    '« Sous Linux, un vieux PC retrouve ses 20 ans. C\'est ça la vraie écologie numérique. »',
    '« Avez-vous essayé d\'éteindre et de rallumer ? (Mais pour de vrai, pas en veille prolongée !) »',
    '« TSSR un jour, Jedi du réseau toujours : que la bande passante soit avec vous. »'
  ];
  let qi = 0;
  const qTxt = $('#daily-quote-text'), qNext = $('#next-quote');
  if (qTxt && qNext) {
    qNext.addEventListener('click', () => {
      qi = (qi + 1) % QUOTES.length;
      qTxt.textContent = QUOTES[qi];
    });
  }

  /* Formulaire -> WhatsApp */
  $('#f')?.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('#m').value.trim();
    open(`${WA}?text=${encodeURIComponent(`Bonjour Jean-Baptiste, c'est ${$('#n').value.trim()}. Besoin : ${$('#b').value}.${msg ? ' Précisions : ' + msg : ''}`)}`);
  });

  /* Terminal BZH-SH */
  const tout = $('#tout'), tin = $('#tin'), term = $('#term'), hist = [];
  let hi = 0;
  if (tout && tin && term) {
    const say = (t, dim) => {
      const p = document.createElement('pre');
      p.textContent = t;
      if (dim) p.style.opacity = .7;
      tout.append(p);
      term.scrollTop = 1e6;
    };
    const CMD = {
      help: () => 'Commandes : help, whoami, ls, tarifs, avis, neofetch, ping, contact, theme jedi|vador|mando|reset, clear',
      whoami: () => 'jean-baptiste · Titre Pro TSSR (2026) · Pleumeleuc (35) · Déplacement 15 km offert',
      ls: () => 'prestations/  linux/  avis_5_etoiles.txt  tarifs.txt  contact.sh',
      tarifs: () => 'Diagnostic ......... inclus\nWi-Fi .............. 49 €\nDésinfection ....... 65 €\nRéinstall OS ....... 79 €\nDéplacement ........ offert (15 km)\nPro ................ sur devis',
      avis: () => '★★★★★ Muriel SOPHIE : "Intervention à mon domicile très efficace !"\n★★★★★ Florian Ramard : "Super compétent et efficace. Réaction très rapide"',
      neofetch: () => 'OS: Fontaine-Breizh IT 26.11\nHost: Pleumeleuc, Bretagne\nShell: bzh-sh\nMascotte: Belette + Tux\nAvis Google: 5.0/5 ★',
      ping: () => 'PING fontainebreizhinformatique.fr : 64 bytes, time=0.4 ms',
      contact: () => { open(WA); return 'Ouverture de WhatsApp…'; },
      clear: () => { tout.innerHTML = ''; return null; },
      'sudo rm -rf /': () => 'Permission refusée : ce système est gardé par une belette bretonne.'
    };
    say('Bienvenue sur BZH-SH. Tapez help pour voir les commandes.');
    tin.addEventListener('keydown', e => {
      e.stopPropagation();
      if (e.key === 'ArrowUp') { hi = Math.max(0, hi - 1); tin.value = hist[hi] || ''; e.preventDefault(); }
      if (e.key !== 'Enter') return;
      const v = tin.value.trim(); tin.value = '';
      if (!v) return;
      hist.push(v); hi = hist.length; say('$ ' + v, true);
      const m = v.toLowerCase().match(/^theme (jedi|vador|mando|reset)$/);
      const f = CMD[v.toLowerCase()];
      const out = m ? (setTheme(...THEMES[m[1]]), 'Thème activé : ' + m[1]) : f ? f() : `Commande inconnue : ${v} (tapez help)`;
      if (out) say(out);
    });
    term.addEventListener('click', () => tin.focus());
  }

  /* Scan de la machine (100 % local) */
  $('#scan-go')?.addEventListener('click', () => {
    const n = navigator, ua = n.userAgent;
    const nav = /Firefox\//.test(ua) ? 'Firefox' : /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Standard';
    const cores = n.hardwareConcurrency || 0, mem = n.deviceMemory || 0;
    const rows = [
      ['Plateforme', n.userAgentData?.platform || n.platform || 'Détectée'],
      ['Navigateur', nav],
      ['Cœurs logiques', cores || 'Non communiqué'],
      ['Mémoire vive', mem ? '≥ ' + mem + ' Go' : 'Masquée par le navigateur'],
      ['Écran', `${screen.width}×${screen.height} px`]
    ];
    const modest = (cores && cores <= 2) || (mem && mem <= 4);
    $('#scan-out').innerHTML = `<table class="scan-table">${rows.map(r => `<tr><td>${r[0]}</td><td>${esc(r[1])}</td></tr>`).join('')}</table>
      <p class="verdict">${modest ? '💡 Configuration modeste : Linux Mint ou Zorin OS lui offrirait une seconde jeunesse.' : '✅ Configuration fluide : pensez aux sauvegardes et à la propreté du système.'}</p>`;
  });

  /* Testeur de mot de passe (rien n'est envoyé) */
  const COMMUNS = ['123456', 'password', 'azerty', 'qwerty', 'motdepasse', 'admin', '123456789', '000000', 'azerty123'];
  $('#pwd')?.addEventListener('input', e => {
    const v = e.target.value;
    if (!v) { $('#pbar').style.width = 0; $('#ptxt').textContent = 'En attente de saisie…'; return; }
    const pool = (/[a-z]/.test(v) ? 26 : 0) + (/[A-Z]/.test(v) ? 26 : 0) + (/\d/.test(v) ? 10 : 0) + (/[^A-Za-z0-9]/.test(v) ? 32 : 0);
    let bits = v.length * Math.log2(pool || 1);
    if (COMMUNS.includes(v.toLowerCase())) bits = 8;
    const s = Math.pow(2, bits) / 2e10;
    const dur = s < 1 ? 'instantané' : s < 3600 ? Math.round(s / 60 + .5) + ' min' : s < 31536000 ? Math.round(s / 86400) + ' jours' : s < 3.1536e10 ? Math.round(s / 31536000) + ' ans' : 'des siècles';
    const lvl = bits < 40 ? ['Faible', '#dc2626'] : bits < 60 ? ['Moyen', '#f59e0b'] : bits < 80 ? ['Bon', '#38bdf8'] : ['Excellent', '#00c853'];
    $('#pbar').style.width = Math.min(100, bits) + '%'; $('#pbar').style.background = lvl[1];
    $('#ptxt').textContent = `${lvl[0]} (~${Math.round(bits)} bits) · Craquage estimé : ${dur}.`;
  });

  /* Palette Ctrl+K */
  const ACT = [
    ['Voir les prestations et tarifs', () => go('services')],
    ['Lire les avis clients 5★', () => go('avis')],
    ['Voir les actualités IT', () => go('actualites')],
    ['Descendre au Labo Geek', () => go('lab')],
    ['Écrire sur WhatsApp', () => open(WA)],
    ['Thème Jedi', () => setTheme(...THEMES.jedi)],
    ['Thème Vador', () => setTheme(...THEMES.vador)],
    ['Thème Mandalorian', () => setTheme(...THEMES.mando)],
    ['Réinitialiser le thème', () => { setTheme(...THEMES.reset); document.body.classList.remove('hacker'); }]
  ];
  const pal = document.createElement('div');
  pal.id = 'pal'; pal.setAttribute('role', 'dialog'); pal.setAttribute('aria-label', 'Palette de commandes');
  pal.innerHTML = '<div class="pal-box"><input id="pin" placeholder="Rechercher une action (tarifs, labo, jedi)..." autocomplete="off"><ul id="pul"></ul></div>';
  document.body.append(pal);
  let sel = 0, shown = [];
  const draw = () => {
    const q = $('#pin').value.toLowerCase();
    shown = ACT.filter(a => a[0].toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    $('#pul').innerHTML = shown.map((a, i) => `<li class="${i === sel ? 'sel' : ''}" data-i="${i}">${esc(a[0])}</li>`).join('');
  };
  const closePal = () => pal.classList.remove('open');
  const run = i => { const a = shown[i]; closePal(); if (a) a[1](); };
  const openPal = () => { pal.classList.add('open'); $('#pin').value = ''; sel = 0; draw(); $('#pin').focus(); };
  $('#pul').onclick = e => { const li = e.target.closest('li'); if (li) run(+li.dataset.i); };
  pal.onclick = e => { if (e.target === pal) closePal(); };
  $('#pal-open')?.addEventListener('click', e => { e.preventDefault(); openPal(); });
  $('#pin').addEventListener('input', draw);
  $('#pin').addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Escape') closePal();
    if (e.key === 'ArrowDown') { sel = Math.min(shown.length - 1, sel + 1); draw(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
    if (e.key === 'Enter') run(sel);
  });
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.classList.contains('open') ? closePal() : openPal(); }
  });

  /* Konami code */
  const KON = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kp = [];
  addEventListener('keydown', e => {
    kp = [...kp, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KON.length);
    if (kp.join() !== KON.join()) return;
    document.body.classList.toggle('hacker');
    const r = document.createElement('img');
    r.src = 'mascotte.jpg'; r.alt = ''; r.className = 'runner';
    document.body.append(r); setTimeout(() => r.remove(), 6200);
  });
})();
