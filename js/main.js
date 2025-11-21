// Accessible mobile menu with focus management, overlay, scroll-lock and keyboard trapping
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const MOBILE_BREAKPOINT = 768;

  if (!toggle || !navMenu) return;

  let prevFocusedElement = null;
  let overlay = null;

  // utility: get all focusable elements inside an element
  const getFocusable = (root) => {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex^="-"])'
    ];
    return Array.from(root.querySelectorAll(selectors.join(','))).filter(el => el.offsetParent !== null);
  };

  const openMenu = () => {
    if (navMenu.classList.contains('active')) return;
    prevFocusedElement = document.activeElement;

    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('active');
    navMenu.classList.add('active');

    // create overlay to capture outside clicks
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '999',            // below the toggle (toggle has higher z-index in CSS)
      background: 'transparent' // transparent so design isn't affected; clicks still captured
    });
    document.body.appendChild(overlay);

    // prevent background scrolling
    document.body.style.overflow = 'hidden';

    // focus first link
    const firstLink = navMenu.querySelector('a, button, [tabindex]');
    if (firstLink) firstLink.focus();

    // click outside closes menu
    overlay.addEventListener('click', closeMenu, { once: true });
  };

  const closeMenu = () => {
    if (!navMenu.classList.contains('active')) return;

    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('active');
    navMenu.classList.remove('active');

    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
      overlay = null;
    }

    // restore scrolling
    document.body.style.overflow = '';

    // restore focus
    if (prevFocusedElement && typeof prevFocusedElement.focus === 'function') {
      prevFocusedElement.focus();
      prevFocusedElement = null;
    } else {
      toggle.focus();
    }
  };

  // Toggle click
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu();
    else openMenu();
  });

  // Close on Escape, trap Tab inside open menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      e.preventDefault();
      closeMenu();
      return;
    }

    if (e.key === 'Tab' && navMenu.classList.contains('active')) {
      // Focus trap logic
      const focusable = getFocusable(navMenu);
      if (focusable.length === 0) {
        // If no focusable inside, keep focus on toggle
        e.preventDefault();
        toggle.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        // shift + tab
        if (active === first || active === navMenu) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // tab
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Close menu when any nav link is clicked (mobile)
  navMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  });

  // On resize, if desktop size, ensure menu is closed and body scroll restored
  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Optional: close menu when clicking outside the navMenu (for setups without overlay)
  // (Covered by overlay creation above, but keep a fallback)
  document.addEventListener('click', (e) => {
    if (!navMenu.classList.contains('active')) return;
    const isClickInside = navMenu.contains(e.target) || toggle.contains(e.target);
    if (!isClickInside) closeMenu();
  }, true);
});
