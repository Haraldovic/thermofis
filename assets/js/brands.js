(function () {
  'use strict';
  const root = document.querySelector('[data-brands]');
  if (!root) return;
  const rail = root.querySelector('.brands__slider');
  const track = root.querySelector('.brands__track');
  const group = root.querySelector('.brands__group');
  if (!rail || !track || !group) return;

  const media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const clone = group.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('button').forEach(button => { button.tabIndex = -1; });
  track.appendChild(clone);
  let visible = true, frame = 0, last = 0, position = 0, width = 0, contact = null;

  function colour(target) {
    rail.querySelectorAll('.is-touched').forEach(item => item.classList.remove('is-touched'));
    const item = target && target.closest('.brand-logo-box');
    if (item && rail.contains(item)) item.classList.add('is-touched');
  }
  function paint() { track.style.transform = `translate3d(${-position}px,0,0)`; }
  function measure() {
    width = group.getBoundingClientRect().width;
    if (width > 0) position %= width;
    paint();
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || media.matches) { last = 0; return; }
    if (!width) measure();
    if (last && width > 0) { position = (position + Math.min(50, now - last) * .023) % width; paint(); }
    if (contact) colour(document.elementFromPoint(contact.x, contact.y));
    last = now;
    frame = requestAnimationFrame(tick);
  }
  function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; }
  function start() { last = 0; if (!frame && visible && !document.hidden && !media.matches) frame = requestAnimationFrame(tick); }
  function clearContact() { contact = null; colour(null); }
  function follow(event) {
    contact = { x: event.clientX, y: event.clientY };
    colour(event.target);
  }
  // Touch and hover colour the logo; neither interrupts the continuous loop.
  rail.addEventListener('pointerdown', follow, { passive: true });
  rail.addEventListener('pointermove', follow, { passive: true });
  rail.addEventListener('pointerleave', clearContact);
  window.addEventListener('pointerup', clearContact, { passive: true });
  window.addEventListener('pointercancel', clearContact, { passive: true });
  rail.addEventListener('focusin', event => colour(event.target));
  rail.addEventListener('focusout', clearContact);
  rail.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 154 : -154;
    if (media.matches) rail.scrollLeft += delta;
    else if (width > 0) { position = (position + delta + width) % width; paint(); }
  });
  function motionPreference() {
    stop();
    root.dataset.brandsReduced = String(media.matches);
    position = 0; rail.scrollLeft = 0; paint();
    start();
  }
  if (window.IntersectionObserver) {
    const observer = new window.IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) start(); else { stop(); clearContact(); }
    });
    observer.observe(rail);
  }
  if (window.ResizeObserver) new window.ResizeObserver(measure).observe(group);
  window.addEventListener('resize', measure, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); clearContact(); } else start(); });
  if (media.addEventListener) media.addEventListener('change', motionPreference);
  root.dataset.brandsReady = 'true';
  measure(); motionPreference();
})();
