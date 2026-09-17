// Right-side timeline for the Research page: one entry per "###" project
// section, click to scroll, highlights the section currently in view.
(function () {
  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function build(body) {
    const headings = Array.from(body.querySelectorAll('h3'));
    if (!headings.length) return;

    const nav = document.createElement('nav');
    nav.className = 'research-timeline';
    nav.setAttribute('aria-label', 'Research timeline');
    const list = document.createElement('ol');
    nav.appendChild(list);

    const links = new Map();
    headings.forEach((h) => {
      // Project title is the bold line right after the lab heading.
      const next = h.nextElementSibling;
      const strong = next && next.querySelector('strong');
      const project = strong ? strong.textContent.split(':')[0].trim() : h.textContent;
      const lab = h.textContent.split('—')[0].trim();
      if (!h.id) h.id = slugify(project);

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.innerHTML = '<span class="research-timeline__title"></span><span class="research-timeline__meta"></span>';
      a.firstChild.textContent = project;
      a.lastChild.textContent = lab;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        h.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + h.id);
      });
      li.appendChild(a);
      list.appendChild(li);
      links.set(h, li);
    });

    document.body.appendChild(nav);

    function setActive(h) {
      links.forEach((li, key) => li.classList.toggle('is-active', key === h));
    }

    // Active section = last heading scrolled past the upper third of the viewport.
    let ticking = false;
    function update() {
      ticking = false;
      const line = window.innerHeight / 3;
      let current = headings[0];
      headings.forEach((h) => {
        if (h.getBoundingClientRect().top <= line) current = h;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = headings[headings.length - 1];
      }
      setActive(current);
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();

    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView({ block: 'start' });
    }
  }

  document.addEventListener('markdown:loaded', (e) => {
    if (e.target.hasAttribute('data-timeline')) build(e.target);
  });
})();
