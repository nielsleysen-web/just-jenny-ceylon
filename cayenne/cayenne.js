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

  /* ---------- galerij: klik op een kleine foto → grote foto; pijlen op de foto en vegen met de duim bladeren ---------- */
  (function () {
    const thumbs = $$('.thumbs .th'), nav = $('.g-nav');
    if (!mainEl || !thumbs.length || ED) return;
    mainEl.appendChild(nav); mainEl.classList.add('g-has-nav');
    let cur = -1; // -1 = de hoofdfoto zelf
    const show = (i) => {
      if (i === -1) { showBig(''); thumbs.forEach((x) => x.classList.remove('on')); cur = -1; return true; }
      const img = bgOf(thumbs[i]); if (!img) return false;
      showBig(img); thumbs.forEach((x, k) => x.classList.toggle('on', k === i)); cur = i; return true;
    };
    thumbs.forEach((x, i) => x.addEventListener('click', () => show(i)));
    const step = (d) => { const n = thumbs.length + 1; let pos = cur + 1; for (let k = 0; k < n; k++) { pos = (((pos + d) % n) + n) % n; if (show(pos - 1)) return; } };
    $('.g-prev', nav).addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
    $('.g-next', nav).addEventListener('click', (e) => { e.stopPropagation(); step(1); });
    // vegen: horizontale beweging van minstens 36px (en duidelijk meer horizontaal dan verticaal)
    let sx = 0, sy = 0, down = false;
    mainEl.addEventListener('touchstart', (e) => { const p = e.touches[0]; sx = p.clientX; sy = p.clientY; down = true; }, { passive: true });
    mainEl.addEventListener('touchend', (e) => { if (!down) return; down = false; const p = e.changedTouches[0], dx = p.clientX - sx, dy = p.clientY - sy; if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1); }, { passive: true });
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
  /* ---------- veegbare rijen op mobiel (oplossingskaarten, reviews): bolletjes volgen de veegpositie ---------- */
  [['.support .cards', '.card', '.support .cd-dots i'], ['.sp-cards', '.sp-card', '.sp-dots i']].forEach(([rs, is, ds]) => {
    const row = $(rs), dots = $$(ds); if (!row || !dots.length || ED) return;
    const cs = $$(is, row);
    const upd = () => { const mid = row.scrollLeft + row.clientWidth / 2; let b = 0, d = 1e9; cs.forEach((c, i) => { const m = c.offsetLeft - row.offsetLeft + c.offsetWidth / 2, dd = Math.abs(m - mid); if (dd < d) { d = dd; b = i; } }); dots.forEach((x, i) => x.classList.toggle('on', i === b)); };
    row.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
    dots.forEach((x, i) => x.addEventListener('click', () => row.scrollTo({ left: cs[i].offsetLeft - row.offsetLeft - (row.clientWidth - cs[i].offsetWidth) / 2, behavior: 'smooth' })));
  });

  /* ---------- probleemkaarten: komen één voor één binnen ---------- */
  if (!ED && 'IntersectionObserver' in window) (function () {
    const sec = $('.prob'); if (!sec) return; const cs = $$('.circ', sec); sec.classList.add('anim');
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('on'), (cs.indexOf(e.target) % 4) * 110); io.unobserve(e.target); } }), { threshold: 0.2 });
    cs.forEach((c) => io.observe(c));
  })();

  /* ---------- uitklapvragen: vloeiend open en dicht, nooit meer dan één open per groep ---------- */
  if (!ED) (function () {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const run = (el, from, to, done) => {
      if (reduce || !el.animate) { done && done(); return; }
      const an = el.animate([{ height: from + 'px', opacity: from ? 1 : 0 }, { height: to + 'px', opacity: to ? 1 : 0 }], { duration: 260, easing: 'cubic-bezier(.3,.7,.3,1)' });
      an.onfinish = an.oncancel = () => { done && done(); };
    };
    const close = (d) => { if (!d.open || d._busy) return; const a = $('.a', d); d._busy = true; d.classList.remove('on'); run(a, a.offsetHeight, 0, () => { d.open = false; d._busy = false; }); };
    const open = (d) => { if (d.open || d._busy) return; d.open = true; d.classList.add('on'); const a = $('.a', d); d._busy = true; run(a, 0, a.offsetHeight, () => { d._busy = false; }); };
    $$('details.acc').forEach((d) => {
      if (d.open) d.classList.add('on');
      $('summary', d).addEventListener('click', (e) => {
        e.preventDefault();
        if (d.open) { close(d); return; }
        $$('details.acc', d.parentElement).forEach((x) => { if (x !== d) close(x); });
        open(d);
      });
    });
  })();

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

  /* ---------- ingrediënten: lijst + groot paneel, loopt vanzelf door tot iemand klikt ---------- */
  (function () {
    const tabs = $$('.ig-tab'), slides = $$('.ig-slide'), list = $('.ig-list'); if (!tabs.length || ED) return;
    const DUR = 4200; let cur = 0, t0 = performance.now(), paused = false, seen = false;
    const set = (i, scroll) => { cur = i; t0 = performance.now(); tabs.forEach((x, k) => { x.classList.toggle('on', k === i); $('u', x).style.width = '0'; }); slides.forEach((x, k) => x.classList.toggle('on', k === i));
      if (scroll !== false && list.scrollWidth > list.clientWidth) list.scrollTo({ left: tabs[i].offsetLeft - list.offsetLeft - 20, behavior: 'smooth' }); };
    tabs.forEach((x, i) => x.addEventListener('click', () => { paused = true; set(i); }));
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { seen = es[0].isIntersecting; if (seen) t0 = performance.now() - (parseFloat($('u', tabs[cur]).style.width) || 0) / 100 * DUR; }, { threshold: 0.3 }).observe($('.ig-grid')); else seen = true;
    const loop = (now) => { if (!paused && seen) { const p = Math.min(1, (now - t0) / DUR); $('u', tabs[cur]).style.width = (p * 100) + '%'; if (p >= 1) set((cur + 1) % tabs.length); } requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  })();

  /* ---------- editor: alle uitklappers open zodat de antwoorden bewerkbaar zijn ---------- */
  if (ED) {
    $$('details.acc').forEach((d) => { d.open = true; });
    document.addEventListener('click', (e) => { if (e.target.closest('summary')) e.preventDefault(); }, true);
  }
})();
