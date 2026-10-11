// geek.js - Logique et dynamisme

document.addEventListener("DOMContentLoaded", () => {
    initBootSequence();
    initTypingEffect();
    initQuotes();
    fetchRSSFeeds();
    initEasterEgg();
    
    // Effet sur la barre de navigation au scroll
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
    
    let delay = 200;
    lines.forEach((line) => {
        setTimeout(() => { line.style.opacity = 1; }, delay);
        delay += Math.random() * 300 + 100;
    });
    
    setTimeout(() => {
        bootScreen.style.opacity = 0;
        setTimeout(() => {
            bootScreen.style.display = 'none';
            sessionStorage.setItem('bootSeen', 'true');
        }, 500);
    }, delay + 400);
}

/* --- 2. TYPING EFFECT (HERO) --- */
function initTypingEffect() {
    const words = ["réussite", "entreprise", "tranquilité", "système"];
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
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);
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

/* --- 5. LECTEUR RSS SECURISE --- */
async function fetchRSSFeeds() {
    const feeds = [
        { id: 'feed-it', url: 'https://www.it-connect.fr/feed/' },
        { id: 'feed-linux', url: 'https://linuxfr.org/news.atom' }
    ];

    let fetchedArticles = { 'feed-it': [], 'feed-linux': [] };
    
    for (const feed of feeds) {
        try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();
            
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");
            const items = xml.querySelectorAll("item, entry");
            
            for(let i = 0; i < Math.min(3, items.length); i++) {
                const title = items[i].querySelector("title")?.textContent || "Nouvel Article";
                const link = items[i].querySelector("link")?.textContent || items[i].querySelector("link")?.getAttribute("href") || "#";
                fetchedArticles[feed.id].push({ title, link });
            }
        } catch (error) {
            console.error(`Erreur RSS pour ${feed.id}`);
        }
    }

    renderRSS(fetchedArticles);
}

function renderRSS(articlesMap) {
    for (const [containerId, articles] of Object.entries(articlesMap)) {
        const container = document.getElementById(containerId);
        if (!container) continue;
        container.innerHTML = ''; 
        
        if (articles.length === 0) {
            container.innerHTML = '<p class="text-muted" style="font-size:0.9rem;">Flux momentanément indisponible.</p>';
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

/* --- 6. EASTER EGG (MANDALORIAN) --- */
function initEasterEgg() {
    let typedKeys = "";
    document.addEventListener("keydown", (e) => {
        typedKeys += e.key.toLowerCase();
        if (typedKeys.length > 10) typedKeys = typedKeys.slice(-10);
        
        if (typedKeys.includes("mando") || typedKeys.includes("jedi")) {
            const isMando = document.body.classList.toggle('theme-mando');
            console.log(`%c ${isMando ? "Telle est la voie. 🛡️" : "Retour au thème standard."}`, 'background: #222; color: #bada55; font-size: 16px; padding: 10px;');
            
            const badgeIcon = document.querySelector('.certification-badge i');
            if(badgeIcon) badgeIcon.className = isMando ? 'fas fa-jedi' : 'fas fa-award';
            
            typedKeys = "";
        }
    });
}
