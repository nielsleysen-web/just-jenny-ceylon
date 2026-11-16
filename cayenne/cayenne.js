/* Cayenne-salespagina: timer, galerij, bundels, ingrediënt-tabs */
(function () {
  const CHECKOUT_URL = ''; // nog geen checkout voor dit product — invullen zodra die bestaat
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const ED = !!window.JJ_EDITOR;
  if (ED) document.documentElement.classList.add('jj-editing');

  /* ---------- aftelklok: 90 minuten per bezoek, start opnieuw als hij afloopt ---------- */
  (function () {
    const LEN = 90 * 60 * 1000, K = 'jj_cay_timer';
    let end = 0;
    try { end = parseInt(sessionStorage.getItem(K), 10) || 0; } catch (e) {}
    if (!end || end <= Date.now()) { end = Date.now() + LEN; try { sessionStorage.setItem(K, end); } catch (e) {} }
    const h = $('#t-h'), m = $('#t-m'), s = $('#t-s');
    if (!h) return;
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      let left = end - Date.now();
      if (left <= 0) { end = Date.now() + LEN; left = LEN; try { sessionStorage.setItem(K, end); } catch (e) {} }
      const t = Math.floor(left / 1000);
      h.textContent = pad(Math.floor(t / 3600)); m.textContent = pad(Math.floor((t % 3600) / 60)); s.textContent = pad(t % 60);
    };
    tick(); setInterval(tick, 1000);
  })();

  /* ---------- grote foto: een laag bovenop de hoofdfoto toont een gekozen kleine foto of de foto van het gekozen offer ---------- */
  const mainEl = $('.g-main');
  let over = null;
  const bgOf = (el) => { if (!el) return ''; const v = getComputedStyle(el).backgroundImage; return v && v !== 'none' ? v : ''; };
  const showBig = (img) => {
    if (!mainEl || ED) return;
    if (!over) { over = document.createElement('div'); over.className = 'g-over'; mainEl.appendChild(over); }
    over.style.backgroundImage = img || ''; over.style.display = img ? 'block' : 'none';
  };

  /* ---------- galerij: klik op een kleine foto → grote foto; pijlen bladeren ---------- */
  (function () {
    const thumbs = $$('.thumbs .th');
    if (!mainEl || !thumbs.length || ED) return;
    let cur = -1;
    const show = (i) => {
      const n = thumbs.length; i = ((i % n) + n) % n;
      const img = bgOf(thumbs[i]); if (!img) return;
      showBig(img); thumbs.forEach((t, k) => t.classList.toggle('on', k === i)); cur = i;
    };
    thumbs.forEach((t, i) => t.addEventListener('click', () => show(i)));
    const step = (d) => { const n = thumbs.length; for (let k = 1; k <= n; k++) { const i = (((cur + d * k) % n) + n) % n; if (bgOf(thumbs[i])) return show(i); } };
    const p = $('.g-prev'), nx = $('.g-next');
    if (p) p.addEventListener('click', () => step(-1));
    if (nx) nx.addEventListener('click', () => step(1));
  })();

  /* ---------- bundels: keuze → knop toont de prijs en gaat naar de checkout met die bundel ---------- */
  (function () {
    const money = (s) => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;
    let cur = null;
    const pick = (q) => {
      cur = q; const b = $('.bundles .bundle[data-qty="' + q + '"]'); if (!b) return;
      $$('.bundle').forEach((x) => { const on = x.dataset.qty === q; x.classList.toggle('sel', on); const r = $('input', x); if (r) r.checked = on; });
      const per = $('.per', b), ws = $('.was', b), pt = per ? per.textContent.trim() : '', wt = ws ? ws.textContent.trim() : '';
      $$('.buy-btn .now').forEach((n) => { if (pt) n.textContent = pt; });
      $$('.buy-btn .bb-was').forEach((n) => { if (wt) n.textContent = wt; });
      // prijsregel van de herhaling onderaan
      const on2 = $('.o2-now'), ow2 = $('.o2-was'), os2 = $('.o2-save');
      if (on2 && pt) on2.textContent = pt; if (ow2 && wt) ow2.textContent = wt;
      if (os2) { const d = money(wt) - money(pt); os2.textContent = 'Save $' + d.toFixed(2); os2.style.display = d > 0 ? '' : 'none'; }
      // cadeaus: 1 zak = alleen het eerste, 2+1 = eerste twee, 3+2 = alle drie
      const lvl = { 1: 1, 3: 2, 5: 3 }[q] || 1;
      $$('.gf').forEach((g) => g.classList.toggle('locked', !ED && parseInt(g.dataset.min, 10) > lvl));
      // grote foto wisselt mee met het gekozen offer (als er voor dat offer een foto is ingesteld; anders de gewone hoofdfoto)
      showBig(bgOf($('.bh-img[data-qty="' + q + '"]')));
      $$('.thumbs .th').forEach((x) => x.classList.remove('on'));
      $$('.buy-btn').forEach((x) => { x.href = CHECKOUT_URL ? CHECKOUT_URL + (CHECKOUT_URL.includes('?') ? '&' : '?') + 'b=' + q : '#'; });
    };
    document.addEventListener('click', (e) => {
      const b = e.target.closest('.bundle');
      if (b) { if (ED && e.target.closest('[contenteditable]')) return; pick(b.dataset.qty); return; }
      if (e.target.closest('.buy-btn') && (!CHECKOUT_URL || ED)) e.preventDefault();
    });
    // herhaling boven de FAQ: kopie van het offer bovenaan, zodat teksten en foto's maar op één plek beheerd worden
    const body = $('.o2-body'), src = $('.h-right');
    const mirror = () => {
      if (!body || !src || ED) return;
      body.innerHTML = '';
      ['.bundles', '.gifts', '.ship', '.atc-wrap'].forEach((sel) => { const el = $(sel, src); if (!el) return; const c = el.cloneNode(true);
        $$('[data-jj-key]', c).forEach((x) => x.removeAttribute('data-jj-key')); $$('input', c).forEach((x) => { x.name = 'bundle2'; });
        body.appendChild(c); });
      if (cur) pick(cur);
    };
    const first = $('.bundle.sel') || $('.bundle');
    if (first) setTimeout(() => { pick(first.dataset.qty); mirror(); }, 0);
    // teksten en foto's uit de editor komen later binnen → prijs en kopie bijwerken; grote foto nog een paar keer toepassen zolang de bezoeker zelf niets koos
    if (!ED && first) {
      let touched = false; document.addEventListener('click', () => { touched = true; }, true);
      [700, 1500, 2600, 4500].forEach((ms) => setTimeout(() => { if (touched) { const keep = cur; mirror(); if (keep) pick(keep); } else { mirror(); } }, ms));
    }
  })();

  /* ---------- titel: op desktop altijd op één lijn (letter wordt kleiner tot hij past) ---------- */
  (function () {
    const h = $('.hero h1'); if (!h) return;
    const fit = () => {
      h.style.fontSize = '';
      if (window.innerWidth <= 900) return;
      let size = 38; h.style.fontSize = size + 'px';
      while (h.scrollWidth > h.clientWidth + 1 && size > 20) { size -= 1; h.style.fontSize = size + 'px'; }
    };
    fit(); window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    new MutationObserver(fit).observe(h, { childList: true, characterData: true, subtree: true });
  })();

  /* ---------- tijdlijn: lijn vult zich en stappen lichten op bij het scrollen ---------- */
  (function () {
    const tl = $('.tl'); if (!tl || ED) return;
    const fill = $('.tl-fill', tl), steps = $$('.tl-step', tl); let tick = false;
    tl.classList.add('tl-on');
    const frame = () => {
      tick = false; const mid = window.innerHeight * 0.68, r = tl.getBoundingClientRect();
      fill.style.height = (Math.max(0, Math.min(1, (mid - r.top) / r.height)) * 100) + '%';
      steps.forEach((s) => { const d = $('.tl-dot', s).getBoundingClientRect(); if (d.top + d.height / 2 < mid + 6) s.classList.add('on'); else if (d.top > window.innerHeight) s.classList.remove('on'); });
    };
    const on = () => { if (!tick) { tick = true; requestAnimationFrame(frame); } };
    window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on); frame();
  })();

  /* ---------- klantfoto-strook: lijst verdubbelen zodat hij naadloos doorloopt ---------- */
  (function () {
    const track = $('.sp-track'); if (!track || ED) return;
    const build = () => {
      $$('.sp-clone', track).forEach((c) => c.remove());
      const orig = $$('.sp-ph', track);
      const filled = orig.filter((o) => o.classList.contains('has-img'));
      // lege fotovakken niet tonen zodra er minstens één echte foto is
      orig.forEach((o) => { o.style.display = filled.length && !o.classList.contains('has-img') ? 'none' : ''; });
      const show = filled.length ? filled : orig;
      const reps = Math.max(2, Math.ceil(24 / show.length)); // genoeg kopieën om de breedte te vullen (even aantal helften)
      for (let r = 1; r < reps * 2; r++) show.forEach((o) => { const c = o.cloneNode(true); c.classList.add('sp-clone'); c.removeAttribute('data-jj-key'); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
    };
    build(); [900, 2200, 4500].forEach((t) => setTimeout(build, t));
  })();

  /* ---------- voordelen-strook: lijst verdubbelen zodat hij naadloos doorloopt ---------- */
  (function () {
    const track = $('.rb-track'); if (!track || ED) return;
    const build = () => { $$('.rb-clone', track).forEach((c) => c.remove()); const orig = $$('.rb-it', track); for (let r = 1; r < 8; r++) orig.forEach((o) => { const c = o.cloneNode(true); c.classList.add('rb-clone'); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); }); };
    build(); [900, 2500].forEach((t) => setTimeout(build, t));
  })();
  if (ED) $$('details.rb-card').forEach((d) => { d.open = true; });
  /* ---------- Real Benefits: kaart draait om bij klik, nooit meer dan één tegelijk ---------- */
  if (!ED) (function () {
    const cards = $$('details.rb-card'); if (!cards.length) return;
    const set = (c, on) => {
      c.classList.toggle('flipped', on);
      const m = $('.rb-more', c), s = $('summary', c);
      c.style.minHeight = on && m ? Math.max(s.offsetHeight, m.scrollHeight) + 'px' : '';
      if (s) s.setAttribute('aria-expanded', on ? 'true' : 'false');
    };
    cards.forEach((c) => { c.open = true; c.classList.add('rb-flip'); set(c, false);
      c.addEventListener('click', (e) => { e.preventDefault(); const on = !c.classList.contains('flipped'); cards.forEach((x) => set(x, x === c && on)); });
    });
  })();

  /* ---------- leverdatum: altijd vandaag + 5 dagen ---------- */
  (function () {
    const el = $('.dlv-d'); if (!el) return;
    const d = new Date(Date.now() + 5 * 864e5), n = d.getDate();
    const suf = n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th';
    el.textContent = d.toLocaleDateString('en-US', { month: 'long' }) + ' ' + n + suf;
  })();

  /* ---------- ingrediënten: klik op een naam → bijhorende uitleg ---------- */
  $$('.i-tab').forEach((t) => t.addEventListener('click', () => {
    if (ED) return;
    $$('.i-tab').forEach((x) => x.classList.toggle('on', x === t));
    $$('.i-p').forEach((p) => p.classList.toggle('on', p.dataset.i === t.dataset.i));
  }));

  /* ---------- editor: alle uitklappers open zodat de antwoorden bewerkbaar zijn ---------- */
  if (ED) {
    $$('details.acc').forEach((d) => { d.open = true; });
    document.addEventListener('click', (e) => { if (e.target.closest('summary')) e.preventDefault(); }, true);
  }
})();
