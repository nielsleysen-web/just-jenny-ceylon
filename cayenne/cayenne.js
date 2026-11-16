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

  /* ---------- galerij: klik op een kleine foto → grote foto; pijlen bladeren ---------- */
  (function () {
    const main = $('.g-main'), thumbs = $$('.thumbs .th');
    if (!main || !thumbs.length || ED) return;
    let cur = -1;
    const bg = (el) => { const v = getComputedStyle(el).backgroundImage; return v && v !== 'none' ? v : ''; };
    const original = () => main.dataset.orig || (main.dataset.orig = bg(main));
    const show = (i) => {
      const n = thumbs.length;
      i = ((i % n) + n) % n;
      const img = bg(thumbs[i]);
      if (!img) return;
      original();
      main.style.backgroundImage = img; main.classList.add('has-img');
      thumbs.forEach((t, k) => t.classList.toggle('on', k === i));
      cur = i;
    };
    thumbs.forEach((t, i) => t.addEventListener('click', () => show(i)));
    const step = (d) => { for (let k = 1; k <= thumbs.length; k++) { const i = cur + d * k; const n = thumbs.length; if (bg(thumbs[((i % n) + n) % n])) return show(i); } };
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
      if (btn) btn.href = CHECKOUT_URL ? CHECKOUT_URL + (CHECKOUT_URL.includes('?') ? '&' : '?') + 'b=' + b.dataset.qty : '#';
    };
    $$('.bundle').forEach((b) => b.addEventListener('click', (e) => { if (ED && e.target.closest('[contenteditable]')) return; pick(b); }));
    const first = $('.bundle.sel') || $('.bundle');
    if (first) setTimeout(() => pick(first), 0);
    // teksten uit de editor komen later binnen → prijs op de knop bijwerken
    if (!ED && first) new MutationObserver(() => { const s = $('.bundle.sel'); if (s && now) { const per = $('.per', s); if (per && now.textContent !== per.textContent.trim()) now.textContent = per.textContent.trim(); } }).observe($('.bundles'), { childList: true, subtree: true, characterData: true });
    if (btn) btn.addEventListener('click', (e) => { if (!CHECKOUT_URL || ED) e.preventDefault(); });
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
