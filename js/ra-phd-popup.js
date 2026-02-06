// Pop-up notice for Fall RA/PhD positions.
(function () {
  const popup = document.getElementById('ra-popup');
  if (!popup) return;

  const panel = popup.querySelector('.ra-popup__panel');
  const closeButtons = popup.querySelectorAll('[data-popup-close]');

  function openPopup() {
    popup.classList.add('is-visible');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ra-popup-open');
    panel && panel.focus();
  }

  function closePopup() {
    popup.classList.remove('is-visible');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ra-popup-open');
  }

  closeButtons.forEach((button) => {
    button.addEventListener('click', closePopup);
  });

  popup.addEventListener('click', (event) => {
    if (event.target === popup) closePopup();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePopup();
  });

  window.setTimeout(openPopup, 450);
})();
