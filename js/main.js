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
  initAnnounceConfetti();
});

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
function initStatsCounter() {
  const values = document.querySelectorAll('.stats-bar .value[data-count-to]');
  if (!values.length) return;
  const duration = 1400;

  values.forEach((el) => {
    const target = parseInt(el.getAttribute('data-count-to'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  });
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
