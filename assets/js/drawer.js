(() => {
  const openBtn  = document.querySelector('[data-drawer-open]');
  const backdrop = document.querySelector('.drawerBackdrop');
  const drawer   = document.getElementById('drawer');
  if (!openBtn || !backdrop || !drawer) return;

  const closeTargets = Array.from(document.querySelectorAll('[data-drawer-close]'));
  let lastFocus = null;

  const focusableSelector = [
    'a[href]','button:not([disabled])','input:not([disabled])',
    'select:not([disabled])','textarea:not([disabled])','[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const getFocusables = () =>
    Array.from(drawer.querySelectorAll(focusableSelector)).filter(el => {
      const s = window.getComputedStyle(el);
      return s.visibility !== 'hidden' && s.display !== 'none';
    });

  const setAria = (open) => {
    openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  // Expose closeDrawer globally so our inline JS can call it too
  window._closeDrawer = function closeDrawer() {
    if (!document.body.classList.contains('drawerOpen')) return;
    document.body.classList.remove('drawerOpen');
    setAria(false);
    document.removeEventListener('keydown', onKeyDown);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  const openDrawer = () => {
    if (document.body.classList.contains('drawerOpen')) return;
    lastFocus = document.activeElement;
    document.body.classList.add('drawerOpen');
    setAria(true);
    const focusables = getFocusables();
    const target = focusables[0] || drawer.querySelector('.drawerClose') || openBtn;
    if (target && typeof target.focus === 'function') target.focus();
    document.addEventListener('keydown', onKeyDown);
  };

  const trapTab = (e) => {
    const focusables = getFocusables();
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  function onKeyDown(e) {
    if (e.key === 'Escape') { window._closeDrawer(); return; }
    if (e.key === 'Tab') trapTab(e);
  }

  openBtn.addEventListener('click', openDrawer);
  closeTargets.forEach(el => el.addEventListener('click', window._closeDrawer));
  backdrop.addEventListener('click', window._closeDrawer);

  // Drawer link clicks — handled by inline JS in each page
  // (we keep this as fallback for non-hash links)
  drawer.addEventListener('click', (e) => {
    const link = e.target?.closest?.('a[href]');
    if (link && !link.getAttribute('href').includes('#')) window._closeDrawer();
  });

  setAria(false);
})();
