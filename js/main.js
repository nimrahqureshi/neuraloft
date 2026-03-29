/* main.js — Neuraloft v2 | Mobile nav + Smooth scroll + Scroll-reveal */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. MOBILE NAV ── */
  const toggle  = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  let overlay   = null;

  function openMenu() {
    if (!toggle || !navMenu) return;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('active');
    navMenu.classList.add('active');
    document.body.style.overflow = 'hidden';

    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0',
      background: 'rgba(0,0,0,0.6)',
      zIndex: '998', cursor: 'pointer',
    });
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeMenu);
  }

  function closeMenu() {
    if (!toggle || !navMenu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
    if (overlay) { overlay.remove(); overlay = null; }
  }

  if (toggle) {
    toggle.addEventListener('click', () =>
      navMenu.classList.contains('active') ? closeMenu() : openMenu()
    );
  }

  /* Close on nav link click (mobile) */
  if (navMenu) {
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeMenu();
      });
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu?.classList.contains('active')) closeMenu();
  });


  /* ── 2. SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── 3. SCROLL-REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.card, .service-box, .faq-item, .section-header, .hero-content, .hero-visual, .reveal'
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      /* stagger cards inside grids */
      el.classList.add('reveal');
      const parent = el.closest('.card-grid, .services-grid, .faq-grid');
      if (parent) {
        const siblings = [...parent.children];
        const idx = siblings.indexOf(el);
        if (idx > 0 && idx < 5) {
          el.style.transitionDelay = `${idx * 0.08}s`;
        }
      }
      io.observe(el);
    });
  } else {
    /* Fallback — just show everything */
    revealEls.forEach(el => el.classList.add('visible'));
  }


  /* ── 4. NAV SHRINK on scroll ── */
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.style.background = 'rgba(0,0,0,0.97)';
        nav.style.boxShadow  = '0 2px 20px rgba(0,0,0,0.4)';
      } else {
        nav.style.background = 'rgba(0,0,0,0.92)';
        nav.style.boxShadow  = 'none';
      }
    }, { passive: true });
  }


  /* ── 5. ACTIVE NAV LINK highlight ── */
  (function setActiveLink() {
    const path = window.location.pathname.replace(/\/$/, '') || '/index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPath = href.replace(/\/$/, '') || '/index.html';
      if (path.endsWith(linkPath) || (path === '' && linkPath.includes('index'))) {
        link.classList.add('active');
      }
    });
  })();

});
