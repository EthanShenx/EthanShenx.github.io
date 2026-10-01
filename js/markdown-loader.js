// Lightweight markdown loader for static pages.
(function () {
  const loadingMarkup = `
    <div class="dots-bounce flex flex-col items-center justify-center" data-dots-bounce-root role="status" aria-live="polite">
      <div class="dots-bounce__dots flex items-center justify-center gap-2" aria-hidden="true">
        <span class="dots-bounce__dot h-2 w-2 rounded-full bg-zinc-800"></span>
        <span class="dots-bounce__dot h-2 w-2 rounded-full bg-zinc-800"></span>
        <span class="dots-bounce__dot h-2 w-2 rounded-full bg-zinc-800"></span>
      </div>
      <span class="dots-bounce__label">Loading</span>
    </div>`;
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
    el.innerHTML = loadingMarkup;
    el.dispatchEvent(new CustomEvent('markdown:loading', { bubbles: true }));

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((md) => {
        el.dispatchEvent(new CustomEvent('markdown:before-render', { bubbles: true }));
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
        el.dispatchEvent(new CustomEvent('markdown:before-render', { bubbles: true }));
        el.innerHTML = '<p>Failed to load content. Please try again later.</p>';
      });
  });
})();
