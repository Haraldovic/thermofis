/* Native horizontal review rails. Touch, wheel and vertical page scroll stay native. */
(function () {
  'use strict';

  document.querySelectorAll('[data-reviews-slider]').forEach(function (section) {
    const rail = section.querySelector('[data-reviews-rail]');
    const controls = section.querySelector('[data-reviews-controls]');
    const previous = section.querySelector('[data-reviews-prev]');
    const next = section.querySelector('[data-reviews-next]');
    if (!rail || !controls || !previous || !next) return;
    const cards = Array.from(rail.querySelectorAll('.google-review-card'));
    if (!cards.length) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function limit() {
      return Math.max(0, rail.scrollWidth - rail.clientWidth);
    }

    function update() {
      const end = limit();
      previous.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= end - 2;
      controls.hidden = end <= 2;
    }

    function goTo(left) {
      rail.scrollTo({
        left: Math.max(0, Math.min(limit(), left)),
        behavior: motion.matches ? 'auto' : 'smooth'
      });
    }

    function move(direction) {
      const step = cards.length > 1
        ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left
        : rail.clientWidth;
      if (step <= 0) return;
      const position = Math.max(0, Math.min(limit(), rail.scrollLeft));
      const index = direction > 0
        ? Math.floor((position + 2) / step) + 1
        : Math.ceil((position - 2) / step) - 1;
      goTo(index * step);
    }

    previous.addEventListener('click', function () { move(-1); });
    next.addEventListener('click', function () { move(1); });
    rail.addEventListener('scroll', update, { passive: true });
    rail.addEventListener('keydown', function (event) {
      if (event.target !== rail || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === 'ArrowLeft') move(-1);
      else if (event.key === 'ArrowRight') move(1);
      else if (event.key === 'Home') goTo(0);
      else if (event.key === 'End') goTo(limit());
      else return;
      event.preventDefault();
    });

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(update);
      observer.observe(rail);
    } else {
      window.addEventListener('resize', update, { passive: true });
    }
    update();
  });
})();
