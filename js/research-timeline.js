// Right-side timeline for the Research page: one entry per "###" project
// section, click to scroll, highlights the section currently in view.
(function () {
  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function timelineComment(heading) {
    for (let node = heading.previousSibling; node; node = node.previousSibling) {
      if (node.nodeType === Node.ELEMENT_NODE) return null;
      if (node.nodeType !== Node.COMMENT_NODE) continue;
      const m = node.data.match(/^\s*timeline:\s*(.*?)\s*\|\s*(.*?)\s*$/);
      if (m) return [m[1], m[2]];
    }
    return null;
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
      const fullTitle = strong ? strong.textContent.split(':')[0].trim() : h.textContent;
      if (!h.id) h.id = slugify(fullTitle);

      // Optional short label from a preceding "<!-- timeline: Title | Subtitle -->".
      const custom = timelineComment(h);
      const project = custom ? custom[0] : fullTitle;
      const lab = custom ? custom[1] : h.textContent.split('—')[0].trim();

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

    // Lives inside the article so CSS can lay it out as a sticky side column
    // (desktop) or a sticky strip under the page title (mobile).
    body.parentNode.insertBefore(nav, body);
    body.parentNode.classList.add('has-timeline');

    function setActive(h) {
      links.forEach((li, key) => li.classList.toggle('is-active', key === h));
      const li = links.get(h);
      if (list.scrollWidth > list.clientWidth && li) {
        const offset = li.getBoundingClientRect().left - list.getBoundingClientRect().left;
        list.scrollTo({ left: Math.max(0, list.scrollLeft + offset), behavior: 'auto' });
      }
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
