// Left-side navigation rail: once the top navigation has scrolled out of
// view, its links appear as a vertical list, centered in the part of the
// viewport below the home hero (or the whole viewport on other pages).
(function () {
  const nav = document.querySelector('.navigation');
  if (!nav) return;
  const hero = document.querySelector('.home-hero');

  const links = Array.from(nav.querySelectorAll('.navigation-list a.navigation-link[href]'))
    .filter((a) => getComputedStyle(a).display !== 'none');
  if (!links.length) return;

  const rail = document.createElement('nav');
  rail.className = 'nav-rail';
  rail.setAttribute('aria-label', 'Site sections');
  const list = document.createElement('ul');
  const here = location.pathname.replace(/index\.html$/, '');

  links.forEach((source) => {
    const a = source.cloneNode(true);
    a.className = 'nav-rail__link';
    a.tabIndex = -1;
    const label = source.textContent.trim();
    a.setAttribute('title', label);
    const text = document.createElement('span');
    text.className = 'nav-rail__label';
    text.textContent = label;
    // Keep the icon, replace the bare text node with a styleable label.
    Array.from(a.childNodes).forEach((n) => { if (n.nodeType === Node.TEXT_NODE) n.remove(); });
    a.appendChild(text);
    if (source.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
    const li = document.createElement('li');
    li.appendChild(a);
    list.appendChild(li);
  });
  rail.appendChild(list);
  document.body.appendChild(rail);

  let visible = false;
  let ticking = false;

  function update() {
    ticking = false;
    const show = nav.getBoundingClientRect().bottom <= 0;
    if (show !== visible) {
      visible = show;
      rail.classList.toggle('is-visible', show);
      rail.querySelectorAll('a').forEach((a) => { a.tabIndex = show ? 0 : -1; });
    }
    if (!show) return;
    const regionTop = hero ? Math.max(0, hero.getBoundingClientRect().bottom) : 0;
    const center = (regionTop + window.innerHeight) / 2;
    // Never let the list ride up over the hero when the free area is short.
    const half = rail.offsetHeight / 2;
    const top = Math.max(center, regionTop + half + 8);
    rail.style.top = top.toFixed(1) + 'px';
  }

  function schedule() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();
