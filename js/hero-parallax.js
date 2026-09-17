// Home hero photo reveal: while the header scrolls out of view, the photo
// layer drifts down at a fraction of the scroll speed, so it moves slower
// than the page and the visible window slides from the top of the photo
// toward the bottom. Speed/crop per breakpoint live in CSS (--hero-speed).
(function () {
  const hero = document.querySelector('[data-hero-parallax]');
  if (!hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 0.14; // fraction of the remaining distance covered per frame

  let speed = 0;
  let heroHeight = 0;
  let current = 0;
  let target = 0;
  let frame = 0;

  function measure() {
    speed = parseFloat(getComputedStyle(hero).getPropertyValue('--hero-speed')) || 0;
    heroHeight = hero.offsetHeight;
  }

  function computeTarget() {
    // Clamp to the header's own scroll range so the photo never loops or
    // overshoots once the header has left the viewport.
    const progress = Math.min(Math.max(window.scrollY, 0), heroHeight);
    return progress * speed;
  }

  function render() {
    current += (target - current) * EASE;
    if (Math.abs(target - current) < 0.1) current = target;
    hero.style.setProperty('--hero-shift', current.toFixed(2) + 'px');
    frame = current === target ? 0 : requestAnimationFrame(render);
  }

  function onScroll() {
    target = computeTarget();
    if (!frame) frame = requestAnimationFrame(render);
  }

  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    measure();
    if (reduceMotion.matches) {
      window.removeEventListener('scroll', onScroll);
      current = target = 0;
      hero.style.removeProperty('--hero-shift');
      return;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    // Jump straight to the right spot (e.g. on reload mid-page), no easing.
    current = target = computeTarget();
    hero.style.setProperty('--hero-shift', current + 'px');
  }

  window.addEventListener('resize', reset);
  reduceMotion.addEventListener('change', reset);
  reset();
})();
