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
    const btn = $('.buy-btn'), now = $('.buy-btn .now');
    const pick = (b) => {
      $$('.bundle').forEach((x) => x.classList.toggle('sel', x === b));
      const r = $('input', b); if (r) r.checked = true;
      const per = $('.per', b);
      if (now && per) now.textContent = per.textContent.trim();
      const bw = $('.buy-btn .bb-was'), ws = $('.was', b); if (bw && ws) bw.textContent = ws.textContent.trim();
      // cadeaus: 1 zak = alleen het eerste, 2+1 = eerste twee, 3+2 = alle drie
      const lvl = { 1: 1, 3: 2, 5: 3 }[b.dataset.qty] || 1;
      $$('.gf').forEach((g) => g.classList.toggle('locked', !ED && parseInt(g.dataset.min, 10) > lvl));
      // grote foto wisselt mee met het gekozen offer (als er voor dat offer een foto is ingesteld; anders de gewone hoofdfoto)
      showBig(bgOf($('.bh-img[data-qty="' + b.dataset.qty + '"]')));
      $$('.thumbs .th').forEach((t) => t.classList.remove('on'));
      if (btn) btn.href = CHECKOUT_URL ? CHECKOUT_URL + (CHECKOUT_URL.includes('?') ? '&' : '?') + 'b=' + b.dataset.qty : '#';
    };
    $$('.bundle').forEach((b) => b.addEventListener('click', (e) => { if (ED && e.target.closest('[contenteditable]')) return; pick(b); }));
    const first = $('.bundle.sel') || $('.bundle');
    if (first) setTimeout(() => pick(first), 0);
    // teksten uit de editor komen later binnen → prijs op de knop bijwerken
    if (!ED && first) new MutationObserver(() => { const s = $('.bundle.sel'); if (s && now) { const per = $('.per', s); if (per && now.textContent !== per.textContent.trim()) now.textContent = per.textContent.trim(); } }).observe($('.bundles'), { childList: true, subtree: true, characterData: true });
    // foto's uit de editor komen iets later binnen → gekozen offer nog een paar keer toepassen (zolang de bezoeker zelf niets koos)
    if (!ED) { let n = 0, touched = false; document.addEventListener('click', () => { touched = true; }, true); const again = setInterval(() => { const sl = $('.bundle.sel'); if (sl && !touched) pick(sl); if (++n >= 5 || touched) clearInterval(again); }, 600); }
    if (btn) btn.addEventListener('click', (e) => { if (!CHECKOUT_URL || ED) e.preventDefault(); });
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
