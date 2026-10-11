/**
 * geek.js - Logique fonctionnelle de Fontaine Breizh Informatique
 * Architecture sécurisée, gestion asynchrone et Easter Eggs.
 */

document.addEventListener("DOMContentLoaded", () => {
    initBootSequence();
    initTypingEffect();
    initQuotes();
    fetchRSSFeeds();
    initEasterEgg();
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
});

/* --- 1. BOOT SEQUENCE --- */
function initBootSequence() {
    const bootScreen = document.getElementById("boot-screen");
    const lines = document.querySelectorAll(".boot-line");
    
    if (sessionStorage.getItem('bootSeen')) {
        bootScreen.style.display = 'none';
        return;
    }
    
    let delay = 300;
    lines.forEach((line) => {
        setTimeout(() => { line.style.opacity = 1; }, delay);
        delay += Math.random() * 300 + 150;
    });
    
    setTimeout(() => {
        bootScreen.style.opacity = 0;
        setTimeout(() => {
            bootScreen.style.display = 'none';
            sessionStorage.setItem('bootSeen', 'true');
        }, 600);
    }, delay + 500);
}

/* --- 2. TYPING EFFECT (HERO) --- */
function initTypingEffect() {
    const words = ["réussite", "entreprise", "tranquillité", "système"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextElement = document.getElementById("typed-text");

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typedTextElement.textContent = currentWord.substring(0, charIndex);

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause à la fin du mot
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause avant le prochain mot
        }

        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1500); // Délai initial
}

/* --- 3. QUIZ INTERACTIF --- */
window.nextQuestion = function(step) {
    const qTitle = document.getElementById("quiz-question");
    const qSub = document.getElementById("quiz-subtitle");
    const options = document.getElementById("quiz-options");
    const result = document.getElementById("quiz-result");
    
    if (step === 1) {
        qTitle.textContent = "Analyse terminée ✅";
        qSub.style.display = "none";
        options.style.display = "none";
        result.style.display = "block";
        document.getElementById("quiz-verdict").textContent = "J'ai la solution pour vous accompagner de manière personnalisée. Discutons-en de vive voix !";
    }
};

/* --- 4. GESTIONNAIRE DE CITATIONS --- */
function initQuotes() {
    const citations = [
        "Le DNS est toujours le coupable. Toujours.",
        "Un jour Chuck Norris a fait un 'rm -rf /' et le serveur s'est excusé.",
        "Il y a 10 types de personnes : ceux qui comprennent le binaire et les autres.",
        "Avez-vous essayé de l'éteindre et de le rallumer ?",
        "Il n'y a pas d'essai, fais-le ou ne le fais pas. (Surtout en prod)"
    ];
    const index = Math.floor(Math.random() * citations.length);
    document.getElementById("daily-quote-text").textContent = `« ${citations[index]} »`;
}

/* --- 5. LECTEUR RSS SÉCURISÉ (ANTI-XSS) --- */
async function fetchRSSFeeds() {
    const CACHE_KEY = 'fontaine_it_news_cache_v4';
    const CACHE_LIFETIME = 4 * 60 * 60 * 1000; // 4 heures
    
    const feeds = [
        { id: 'feed-it', url: 'https://www.it-connect.fr/feed/' },
        { id: 'feed-linux', url: 'https://linuxfr.org/news.atom' }
    ];

    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        if (Date.now() - parsedCache.timestamp < CACHE_LIFETIME) {
            renderRSS(parsedCache.articles);
            updateTime(new Date(parsedCache.timestamp));
            return;
        }
    }

    let fetchedArticles = { 'feed-it': [], 'feed-linux': [] };
    
    for (const feed of feeds) {
        try {
            // Utilisation d'un proxy public pour contourner CORS
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();
            
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");
            const items = xml.querySelectorAll("item, entry");
            
            for(let i = 0; i < Math.min(3, items.length); i++) {
                const title = items[i].querySelector("title")?.textContent || "Article";
                const link = items[i].querySelector("link")?.textContent || items[i].querySelector("link")?.getAttribute("href") || "#";
                
                fetchedArticles[feed.id].push({ title, link });
            }
        } catch (error) {
            console.error(`Erreur RSS pour ${feed.id}:`, error);
        }
    }

    renderRSS(fetchedArticles);
    const now = new Date();
    updateTime(now);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now.getTime(), articles: fetchedArticles }));
}

function renderRSS(articlesMap) {
    for (const [containerId, articles] of Object.entries(articlesMap)) {
        const container = document.getElementById(containerId);
        if (!container) continue;
        container.innerHTML = ''; // Clear loader
        
        if (articles.length === 0) {
            container.innerHTML = '<p class="text-muted">Flux indisponible actuellement.</p>';
            continue;
        }

        articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'news-card';
            
            const title = document.createElement('h4');
            title.textContent = article.title;
            
            const link = document.createElement('a');
            link.href = article.link;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Lire l\'article →';
            
            card.appendChild(title);
            card.appendChild(link);
            container.appendChild(card);
        });
    }
}

function updateTime(dateObj) {
    document.getElementById("news-updated-time").textContent = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/* --- 6. EASTER EGG MANDALORIAN --- */
function initEasterEgg() {
    let typedKeys = "";
    document.addEventListener("keydown", (e) => {
        typedKeys += e.key.toLowerCase();
        if (typedKeys.length > 10) typedKeys = typedKeys.slice(-10);
        
        if (typedKeys.includes("mando") || typedKeys.includes("jedi")) {
            const isMando = document.body.classList.toggle('theme-mando');
            const alertMsg = isMando ? "Telle est la voie. (Thème Beskar activé 🛡️)" : "Retour au système standard.";
            
            // Création d'une notification console propre plutôt qu'un vieux "alert()"
            console.log(`%c ${alertMsg}`, 'background: #222; color: #bada55; font-size: 16px; padding: 10px;');
            
            // Remplacement de l'icône de badge
            const badgeIcon = document.querySelector('.certification-badge i');
            if(badgeIcon) {
                badgeIcon.className = isMando ? 'fas fa-jedi' : 'fas fa-award';
            }
            
            typedKeys = ""; // Reset
        }
    });
}
