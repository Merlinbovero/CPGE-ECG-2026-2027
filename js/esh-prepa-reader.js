/* Lecteur des diapositives : les images et le PDF original restent locaux. */
(function () {
  'use strict';
  const reader = document.querySelector('[data-esh-reader]');
  const data = document.getElementById('esh-slides-data');
  if (!reader || !data) return;
  let slides;
  try { slides = JSON.parse(data.textContent); } catch (_) { return; }
  if (!Array.isArray(slides) || !slides.length) return;
  const base = reader.dataset.assets;
  const picture = document.getElementById('esh-slide-image');
  const select = document.getElementById('esh-slide-select');
  const previous = document.getElementById('esh-slide-prev');
  const next = document.getElementById('esh-slide-next');
  const counter = document.getElementById('esh-slide-counter');
  const text = document.getElementById('esh-slide-text');
  const note = document.getElementById('esh-slide-note');
  const original = document.getElementById('esh-slide-original');
  const search = document.getElementById('esh-slide-search');
  const results = document.getElementById('esh-slide-results');
  const status = document.getElementById('esh-slide-status');
  let current = 1;

  function readPage() {
    const value = Number(new URL(location.href).searchParams.get('page'));
    return Number.isInteger(value) && value >= 1 && value <= slides.length ? value : 1;
  }

  function render(page, updateHistory) {
    current = Math.max(1, Math.min(slides.length, page));
    const slide = slides[current - 1];
    picture.src = base + '/page-' + String(current).padStart(2, '0') + '.webp';
    picture.alt = 'Diapositive ' + current + ' : ' + slide.title + '. ' + (slide.note || '');
    original.href = picture.src;
    select.value = String(current);
    counter.textContent = 'Diapositive ' + current + ' / ' + slides.length + ' · ' + slide.title;
    text.textContent = slide.text;
    note.textContent = slide.note || '';
    note.hidden = !slide.note;
    previous.disabled = current === 1;
    next.disabled = current === slides.length;
    if (updateHistory) {
      const url = new URL(location.href);
      url.searchParams.set('page', String(current));
      history.pushState(null, '', url);
    }
  }

  function normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  previous.addEventListener('click', function () { render(current - 1, true); });
  next.addEventListener('click', function () { render(current + 1, true); });
  select.addEventListener('change', function () { render(Number(select.value), true); });
  window.addEventListener('popstate', function () { render(readPage(), false); });
  reader.addEventListener('keydown', function (event) {
    if (/^(INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY|A)$/.test(event.target.tagName) || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'ArrowLeft' && current > 1) { event.preventDefault(); render(current - 1, true); }
    if (event.key === 'ArrowRight' && current < slides.length) { event.preventDefault(); render(current + 1, true); }
  });
  document.querySelectorAll('[data-slide-page]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      render(Number(link.dataset.slidePage), true);
    });
  });
  search.addEventListener('input', function () {
    results.replaceChildren();
    const query = normalize(search.value.trim());
    if (!query) { results.hidden = true; status.textContent = ''; return; }
    const terms = query.split(/\s+/);
    const matches = slides.filter(function (slide) {
      const haystack = normalize(slide.title + ' ' + slide.text + ' ' + (slide.note || ''));
      return terms.every(function (term) { return haystack.includes(term); });
    });
    status.textContent = matches.length + ' diapositive' + (matches.length > 1 ? 's' : '') + ' trouvée' + (matches.length > 1 ? 's' : '') + '.';
    results.hidden = !matches.length;
    matches.forEach(function (slide) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = '?page=' + slide.page;
      link.textContent = 'Page ' + slide.page + ' · ' + slide.title;
      link.addEventListener('click', function (event) {
        if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        render(slide.page, true);
        reader.focus({preventScroll: true});
        picture.scrollIntoView({block: 'start'});
      });
      item.append(link); results.append(item);
    });
  });
  picture.addEventListener('error', function () {
    status.textContent = 'Cette image n’est pas disponible. Le PDF original est accessible en haut de la page.';
  });
  reader.querySelectorAll('[data-reader-enhancement]').forEach(function (element) { element.hidden = false; });
  render(readPage(), false);
})();
