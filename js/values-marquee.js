(function () {
  function init() {
    var marquee = document.querySelector('.values-marquee');
    var track   = document.querySelector('.values-track');
    if (!marquee || !track) return;

    // Let CSS handle the reduced-motion fallback layout; JS does nothing there.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var position      = 0;      // pixels scrolled
    var paused        = false;
    var lastTimestamp = null;
    var SPEED         = 60;     // px per second

    function halfWidth() {
      return track.scrollWidth / 2;
    }

    function step(ts) {
      if (lastTimestamp !== null && !paused) {
        var elapsed = ts - lastTimestamp;
        position += SPEED * elapsed / 1000;
        var half = halfWidth();
        if (position >= half) position -= half;
        track.style.transform = 'translateX(' + (-position) + 'px)';
      }
      lastTimestamp = ts;
      requestAnimationFrame(step);
    }

    marquee.addEventListener('mouseenter', function () {
      paused = true;
    });
    marquee.addEventListener('mouseleave', function () {
      paused        = false;
      lastTimestamp = null; // prevents a jump after a long hover pause
    });

    requestAnimationFrame(step);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
