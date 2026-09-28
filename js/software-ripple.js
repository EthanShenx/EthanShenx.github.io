(function () {
  const RIPPLE_DURATION_MS = 600;
  const POINTER_SELECTOR = '.software-logo-button';
  const LINK_SELECTOR = '.software-logos a';

  function createRipple(surface, clientX, clientY) {
    const rect = surface.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);

    ripple.className = 'software-logo-ripple';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${clientX - rect.left}px`;
    ripple.style.top = `${clientY - rect.top}px`;
    ripple.style.setProperty('--software-ripple-size', `${size}px`);

    const removeRipple = () => ripple.remove();
    ripple.addEventListener('animationend', removeRipple, { once: true });
    window.setTimeout(removeRipple, RIPPLE_DURATION_MS + 100);
    surface.appendChild(ripple);
  }

  function createCenteredRipple(link) {
    const surface = link.querySelector(POINTER_SELECTOR);
    if (!surface) return;

    const rect = surface.getBoundingClientRect();
    createRipple(surface, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const surface = event.target.closest(POINTER_SELECTOR);
    if (!surface) return;

    createRipple(surface, event.clientX, event.clientY);
  });

  document.addEventListener('keydown', (event) => {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;

    const link = event.target.closest(LINK_SELECTOR);
    if (!link) return;

    createCenteredRipple(link);

    if (event.key === ' ') {
      event.preventDefault();
      link.click();
    }
  });
})();
