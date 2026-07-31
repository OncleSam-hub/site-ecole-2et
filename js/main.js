// École Supérieure 2ET — comportements partagés du site

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDropdowns();
  initFaqAccordion();
  initGalleryFilter();
  initAdmissionsToggle();
  initNetlifyForms();
  initHeroCarousel();
});

// ---- Carousel du hero (accueil) ----
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  let current = 0;
  let timer;

  function show(index) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function next() {
    show((current + 1) % slides.length);
  }

  function startAutoplay() {
    timer = setInterval(next, 5000);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      stopAutoplay();
      startAutoplay();
    });
  });

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
