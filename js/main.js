// École Supérieure 2ET — comportements partagés du site

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDropdowns();
  initFaqAccordion();
  initGalleryFilter();
  initAdmissionsToggle();
  initNetlifyForms();
  initHeroCarousel();
  initStatsCounter();
  initVisitorCounter();
  initAnnounceConfetti();
  initWhatsAppButton();
  initGalleryLightbox();
  initOrientationQuiz();
});

// ---- Bouton WhatsApp flottant (injecté sur toutes les pages, sauf celles ayant déjà un accès WhatsApp dédié) ----
function initWhatsAppButton() {
  if (document.body.hasAttribute('data-no-whatsapp-float')) return;
  const btn = document.createElement('a');
  btn.href = 'https://wa.me/2250546262313?text=' + encodeURIComponent("Bonjour, je souhaite avoir des informations sur l'École 2ET.");
  btn.className = 'whatsapp-float';
  btn.target = '_blank';
  btn.rel = 'noopener';
  btn.setAttribute('aria-label', "Contacter l'École 2ET sur WhatsApp");
  btn.innerHTML = '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.7 4.607 1.902 6.474L4 29l7.73-1.867A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7c-1.97 0-3.9-.53-5.57-1.53l-.4-.24-4.59 1.11 1.13-4.47-.26-.42A9.65 9.65 0 0 1 5.3 15c0-5.9 4.8-10.7 10.7-10.7S26.7 9.1 26.7 15 21.9 24.7 16.004 24.7Zm5.9-8.02c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.84 1.05-1.03 1.26-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.6-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64s1.14 3.06 1.3 3.27c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.53 1.82.68.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z"/></svg>';
  document.body.appendChild(btn);
}

// ---- Lightbox de la galerie : agrandissement au clic, navigation, respecte le filtre actif ----
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  if (!items.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let current = 0;

  function visibleImages() {
    return Array.from(items).filter((img) => img.closest('.gallery-item').style.display !== 'none');
  }

  function show(index) {
    const list = visibleImages();
    current = (index + list.length) % list.length;
    lightboxImg.src = list[current].src;
    lightboxImg.alt = list[current].alt;
  }

  function open(img) {
    show(visibleImages().indexOf(img));
    lightbox.classList.add('open');
  }

  function close() {
    lightbox.classList.remove('open');
  }

  items.forEach((img) => {
    img.addEventListener('click', () => open(img));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });
}

// ---- Éclat de confettis façon anniversaire sur le bandeau d'annonce (accueil) ----
// À chaque chargement de la page, des petites bandes colorées partent du centre
// du bouton et éclatent sur un rayon d'environ 5cm, comme des confettis.
function initAnnounceConfetti() {
  const host = document.querySelector('.announce-confetti');
  if (!host) return;
  const colors = ['#E2792F', '#D9A62E', '#1B5E3A', '#ffffff'];
  const pieceCount = 34;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const angle = Math.random() * 360;
    const distCm = 1.5 + Math.random() * 3.5; // jusqu'à ~5cm du centre
    const size = 5 + Math.random() * 5;
    const duration = 0.9 + Math.random() * 0.6;
    const delay = Math.random() * 0.15;
    piece.style.setProperty('--angle', angle + 'deg');
    piece.style.setProperty('--dist', distCm + 'cm');
    piece.style.width = size + 'px';
    piece.style.height = (size * 0.4) + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = duration + 's';
    piece.style.animationDelay = delay + 's';
    host.appendChild(piece);
  }

  setTimeout(() => { host.innerHTML = ''; }, 1800);
}

// ---- Compteurs animés du bandeau de chiffres clés (accueil) ----
// Chaque chiffre part de 0 et monte jusqu'à sa valeur à chaque chargement du site.
function animateCount(el, target, suffix, duration) {
  duration = duration || 1400;
  suffix = suffix || '';
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function initStatsCounter() {
  const values = document.querySelectorAll('.stats-bar .value[data-count-to]');
  values.forEach((el) => {
    const target = parseInt(el.getAttribute('data-count-to'), 10);
    if (isNaN(target)) return;
    animateCount(el, target, el.getAttribute('data-suffix') || '');
  });
}

// ---- Compteur de visiteurs réel (accueil), via GoatCounter ----
// Chiffre exact récupéré auprès de GoatCounter (service gratuit de mesure d'audience,
// sans cookies), jamais inventé. Mis à jour côté GoatCounter toutes les 4h.
function initVisitorCounter() {
  const el = document.getElementById('visitor-count');
  if (!el) return;
  fetch('https://ecole2et.goatcounter.com/counter//.json')
    .then((r) => r.json())
    .then((data) => {
      const target = parseInt(String(data.count).replace(/[^\d]/g, ''), 10);
      if (!isNaN(target)) animateCount(el, target);
    })
    .catch(() => { /* si GoatCounter est injoignable, la tuile reste à 0 plutôt que d'afficher une erreur */ });
}

// ---- Carousel du hero (accueil) : annonces + flèches + points + défilement auto ----
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-arrow-prev');
  const nextBtn = document.querySelector('.hero-arrow-next');
  if (!slides.length) return;
  let current = 0;
  let timer;

  function show(index) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function next() {
    show(current + 1);
  }

  function prev() {
    show(current - 1);
  }

  function startAutoplay() {
    timer = setInterval(next, 6000);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      restartAutoplay();
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });

  // Pause au survol, reprise à la sortie du curseur
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

// ---- Menu mobile ----
function initMobileNav() {
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!burger || !mobileNav) return;
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
}

// ---- Sous-menus déroulants (desktop) ----
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach((dd) => {
    const toggle = dd.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;
    dd.addEventListener('mouseenter', () => dd.classList.add('open'));
    dd.addEventListener('mouseleave', () => dd.classList.remove('open'));
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      dropdowns.forEach((other) => { if (other !== dd) other.classList.remove('open'); });
      dd.classList.toggle('open');
    });
  });
  document.addEventListener('click', (e) => {
    dropdowns.forEach((dd) => {
      if (!dd.contains(e.target)) dd.classList.remove('open');
    });
  });
}

// ---- FAQ accordéon ----
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}

// ---- Filtre galerie ----
function initGalleryFilter() {
  const tabs = document.querySelectorAll('.gallery-tab');
  const items = document.querySelectorAll('.gallery-item');
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-cat');
      items.forEach((item) => {
        const show = cat === 'Tout' || item.getAttribute('data-cat') === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

// ---- Bascule inscriptions (lit js/config.js) ----
function initAdmissionsToggle() {
  const openBlock = document.querySelector('[data-admissions="open"]');
  const closedBlock = document.querySelector('[data-admissions="closed"]');
  if (!openBlock || !closedBlock || typeof SITE_CONFIG === 'undefined') return;
  if (SITE_CONFIG.admissionsOpen) {
    openBlock.style.display = '';
    closedBlock.style.display = 'none';
  } else {
    openBlock.style.display = 'none';
    closedBlock.style.display = '';
  }
}

// ---- Envoi des formulaires Netlify Forms en AJAX (avec message de confirmation inline) ----
// On envoie le FormData tel quel (multipart/form-data, boundary posé automatiquement
// par le navigateur) : ça fonctionne aussi bien pour les formulaires simples que pour
// celui avec upload de CV (recrutement.html).
function initNetlifyForms() {
  const forms = document.querySelectorAll('form[data-netlify="true"]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      fetch('/', {
        method: 'POST',
        body: data
      })
        .then(() => {
          const successEl = form.querySelector('.form-success');
          if (successEl) successEl.classList.add('show');
          form.reset();
        })
        .catch(() => {
          alert("Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous contacter par téléphone.");
        });
    });
  });
}

// ---- Quiz d'orientation : "Quelle filière BTS est faite pour vous ?" ----
function initOrientationQuiz() {
  const app = document.getElementById('quiz-app');
  if (!app) return;

  const FILIERES = {
    GEC: { title: 'Gestion Commerciale', code: 'BTS · GEC', img: 'images/programs/gec.jpg', anchor: 'gec', desc: "Formation aux techniques de vente, de marketing et de relation client pour développer l'activité commerciale d'une entreprise." },
    FCGE: { title: 'Finance Comptabilité et Gestion des Entreprises', code: 'BTS · FCGE', img: 'images/programs/fcge.jpg', anchor: 'fcge', desc: "Formation aux outils comptables et financiers nécessaires au pilotage économique d'une organisation." },
    TL: { title: 'Logistique', code: 'BTS · Log', img: 'images/programs/log.jpg', anchor: 'log', desc: "Formation à la gestion des flux physiques et d'information, de l'approvisionnement au stockage, pour optimiser la chaîne logistique d'une organisation." },
    IDA: { title: "Informatique Développeur d'Applications", code: 'BTS · IDA', img: 'images/programs/ida.jpg', anchor: 'ida', desc: "Formation à la conception et au développement d'applications informatiques et web." },
    TH: { title: 'Tourisme et Hôtellerie', code: 'BTS · TH', img: 'images/programs/th.jpg', anchor: 'th', desc: "Formation aux métiers de l'accueil, de l'hôtellerie et de l'organisation touristique." },
    MGP: { title: 'Mines et Géologie Pétrole', code: 'BTS · MGP', img: 'images/programs/mgp.jpg', anchor: 'mgp', desc: "Formation aux techniques d'exploration et d'exploitation des ressources minières et pétrolières." },
    AD: { title: 'Assistanat de Direction', code: 'BTS · AD', img: 'images/programs/ad.jpg', anchor: 'ad', desc: "Formation aux techniques modernes de secrétariat et d'appui à la direction d'une organisation." }
  };

  const questions = Array.from(app.querySelectorAll('.quiz-question'));
  const progressBar = document.getElementById('quiz-progress-bar');
  const backBtn = document.getElementById('quiz-back');
  const resultEl = document.getElementById('quiz-result');
  const restartBtn = document.getElementById('quiz-restart');
  const total = questions.length;
  const answers = [];
  let current = 0;

  function updateProgress() {
    const pct = ((current) / total) * 100;
    progressBar.style.width = Math.max(pct, 4) + '%';
    backBtn.hidden = current === 0;
  }

  function showQuestion(index) {
    questions.forEach((q) => q.classList.remove('active'));
    questions[index].classList.add('active');
    resultEl.classList.remove('active');
    current = index;
    updateProgress();
  }

  function showResult() {
    questions.forEach((q) => q.classList.remove('active'));
    progressBar.style.width = '100%';
    backBtn.hidden = true;

    const tally = {};
    answers.forEach((v) => { tally[v] = (tally[v] || 0) + 1; });
    let winner = answers[0];
    let best = 0;
    Object.keys(tally).forEach((key) => {
      if (tally[key] > best) { best = tally[key]; winner = key; }
    });

    const f = FILIERES[winner];
    document.getElementById('quiz-result-img').src = f.img;
    document.getElementById('quiz-result-img').alt = 'Filière ' + f.title;
    document.getElementById('quiz-result-code').textContent = f.code;
    document.getElementById('quiz-result-title').textContent = f.title;
    document.getElementById('quiz-result-desc').textContent = f.desc;
    document.getElementById('quiz-result-link').href = 'formations.html#' + f.anchor;

    const shareBtn = document.getElementById('quiz-share-whatsapp');
    if (shareBtn) {
      const message = "J'ai fait le quiz d'orientation de l'École 2ET et je suis fait(e) pour la filière " + f.title + " ! Découvre ta filière ici : https://2et.edu.ci/orientation.html";
      shareBtn.href = 'https://wa.me/?text=' + encodeURIComponent(message);
    }

    resultEl.classList.add('active');
  }

  questions.forEach((q, index) => {
    q.querySelectorAll('.quiz-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        answers[index] = btn.getAttribute('data-value');
        if (index + 1 < total) {
          showQuestion(index + 1);
        } else {
          showResult();
        }
      });
    });
  });

  backBtn.addEventListener('click', () => {
    if (current > 0) showQuestion(current - 1);
  });

  restartBtn.addEventListener('click', () => {
    answers.length = 0;
    showQuestion(0);
  });

  updateProgress();
}
