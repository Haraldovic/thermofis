(() => {
  'use strict';
  const section = document.getElementById('google-bewertungen');
  if (!section) return;
  const grid = section.querySelector('[data-reviews-grid]');
  const summary = section.querySelector('[data-reviews-summary]');
  const fallback = section.querySelector('[data-reviews-fallback]');
  const count = section.querySelector('[data-reviews-count]');
  const rating = section.querySelector('[data-reviews-rating]');
  const stars = section.querySelector('[data-reviews-stars]');
  const timestamp = section.querySelector('[data-reviews-updated]');
  const disclosure = section.querySelector('[data-reviews-disclosure]');
  const link = section.querySelector('[data-reviews-link]');
  if (!grid || !summary || !fallback || !count || !rating || !stars || !link) return;

  const number = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const date = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' });
  const searchUrl = 'https://www.google.com/maps/search/?api=1&query=Thermofis%20Hanau';
  const safeMapsUrl = (value) => {
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      const allowed = ['maps.app.goo.gl', 'g.page'].includes(host)
        || (['www.google.com', 'google.com', 'www.google.de', 'google.de'].includes(host) && url.pathname.startsWith('/maps'));
      return url.protocol === 'https:' && !url.username && !url.password && allowed ? url.href : searchUrl;
    } catch (_) { return searchUrl; }
  };
  const node = (tag, className, content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  };
  const displayDate = (value) => {
    const parsed = value ? new Date(value) : null;
    return parsed && Number.isFinite(parsed.getTime()) ? date.format(parsed) : '';
  };

  const render = (data) => {
    link.href = safeMapsUrl(data.googleMapsUrl);
    if (link.href !== searchUrl) link.textContent = 'Bewertungen direkt auf Google ansehen';
    if (data.status !== 'ready' || !Number.isInteger(data.count) || data.count < 1
      || !Number.isFinite(data.rating) || data.rating < 1 || data.rating > 5 || !Array.isArray(data.reviews)) return;
    const visible = data.reviews.filter((review) => review && typeof review.author === 'string'
      && typeof review.text === 'string' && Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5).slice(0, 6);
    rating.textContent = number.format(data.rating);
    count.textContent = `${data.count.toLocaleString('de-DE')} ${data.count === 1 ? 'Google-Bewertung' : 'Google-Bewertungen'}`;
    // The numeric Google average is exact to the display precision; stars are decoration.
    stars.textContent = '★★★★★';
    stars.style.setProperty('--rating-fill', `${(data.rating / 5) * 100}%`);
    stars.setAttribute('aria-label', `${number.format(data.rating)} von 5 Sternen`);
    summary.hidden = false;
    fallback.hidden = true;
    grid.replaceChildren();
    visible.forEach((review) => {
      const card = node('article', 'google-review-card');
      const header = node('div', 'google-review-card__header');
      // Initials avoid loading profile photos from a third-party server.
      const initials = review.author.trim().split(/\s+/).slice(0, 2).map((part) => Array.from(part)[0] || '').join('').toLocaleUpperCase('de-DE');
      const avatar = node('span', 'google-review-card__avatar', initials || 'G');
      avatar.setAttribute('aria-hidden', 'true');
      const meta = node('div', 'google-review-card__meta');
      meta.append(node('strong', '', review.author));
      const published = displayDate(review.publishedAt || review.updatedAt);
      if (published) meta.append(node('small', '', published));
      header.append(avatar, meta);
      const starLine = node('div', 'google-review-card__stars', '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating));
      starLine.setAttribute('aria-label', `${review.rating} von 5 Sternen`);
      card.append(header, starLine);
      const text = review.text.trim();
      if (text.length > 320) {
        card.append(node('p', 'google-review-card__text', `${text.slice(0, 320)}…`));
        const details = node('details', 'google-review-card__more');
        details.append(node('summary', '', 'Vollständige Bewertung lesen'), node('p', '', text));
        card.append(details);
      } else if (text) {
        card.append(node('p', 'google-review-card__text', text));
      } else {
        card.append(node('p', 'google-review-card__text', 'Bewertung ohne Text.'));
      }
      card.append(node('span', 'google-review-card__source', 'Google-Bewertung'));
      grid.append(card);
    });
    grid.hidden = visible.length === 0;
    if (disclosure) {
      disclosure.textContent = 'Eine Auswahl der zuletzt aktualisierten Google-Bewertungen. Keine Filterung nach Sternezahl.';
      disclosure.hidden = visible.length === 0;
    }
    if (timestamp) {
      const updated = displayDate(data.updatedAt);
      timestamp.textContent = updated ? `Stand: ${updated}` : '';
    }
  };

  const load = async () => {
    let endpoint;
    try {
      endpoint = new URL(section.dataset.reviewsEndpoint || '/api/google-reviews.php', window.location.href);
      if (endpoint.origin !== window.location.origin || !['http:', 'https:'].includes(endpoint.protocol)) return;
    } catch (_) { return; }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 22000);
    try {
      const response = await fetch(endpoint.href, { credentials: 'same-origin', cache: 'no-store', signal: controller.signal });
      if (response.ok && (response.headers.get('content-type') || '').includes('application/json')) render(await response.json());
    } catch (_) {
      // The accessible Google link remains usable when a connection is unavailable.
    } finally { window.clearTimeout(timeout); }
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { observer.disconnect(); load(); }
    }, { rootMargin: '300px' });
    observer.observe(section);
  } else { load(); }
})();
