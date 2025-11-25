// main.js — Professional version
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (!toggle || !navMenu) return;

  let overlay = null;

  // Open mobile menu
  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('active');
    navMenu.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Create overlay
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0,0,0,0.7)',
      zIndex: '998',
    });
    document.body.appendChild(overlay);

    overlay.addEventListener('click', closeMenu);
  };

  // Close mobile menu
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';

    if (overlay) {
      overlay.removeEventListener('click', closeMenu);
      overlay.remove();
      overlay = null;
    }
  };

  // Toggle button
  toggle.addEventListener('click', () => {
    navMenu.classList.contains('active') ? closeMenu() : openMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close menu if resizing beyond mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Optional: trap focus inside menu for accessibility
  const focusableSelectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const trapFocus = (container) => {
    const focusableEls = Array.from(container.querySelectorAll(focusableSelectors));
    if (focusableEls.length === 0) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    container.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    });
  };

  trapFocus(navMenu);
});
