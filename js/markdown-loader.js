// Lightweight markdown loader for static pages.
(function () {
  const containers = document.querySelectorAll('[data-markdown]');
  if (!containers.length) return;
  if (!window.marked) {
    containers.forEach((el) => {
      el.textContent = 'Markdown renderer missing.';
    });
    return;
  }

  marked.setOptions({ gfm: true, breaks: true });

  containers.forEach((el) => {
    const src = el.getAttribute('data-markdown');
    if (!src) return;
    el.innerHTML = '<p>Loading content...</p>';

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((md) => {
        el.innerHTML = marked.parse(md);
        // Only the first image may be above the fold; defer the rest.
        el.querySelectorAll('img').forEach((img, i) => {
          img.decoding = 'async';
          if (i > 0) img.loading = 'lazy';
        });
        el.dispatchEvent(new CustomEvent('markdown:loaded', { bubbles: true }));
      })
      .catch((err) => {
        console.error('Markdown load failed:', err);
        el.innerHTML = '<p>Failed to load content. Please try again later.</p>';
      });
  });
})();
