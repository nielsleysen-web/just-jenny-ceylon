/* Just Jenny – Sage Leaf salespagina (/sage): galerij, bundelkeuze, koopknoppen, sticky knop. */
(function () {
  // Checkout voor dit product: vul hier de link in zodra de checkout bestaat (?b=1|3|5 wordt erachter gezet)
  const CHECKOUT_URL = 'https://checkout.getjustjenny.com/en/sageleaf';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const money = (n) => '$' + n.toFixed(2);
  const num = (t) => parseFloat(String(t || '').replace(/[^\d.,]/g, '').replace(',', '.')) || 0;

  /* ---------- galerij: groot beeld = actieve thumbnail ---------- */
  const main = $('.g-main');
  const thumbs = $$('.thumbs .ed-pic').filter((t) => getComputedStyle(t).display !== 'none');
  let cur = 0;
  function bgOf(el) { const m = /url\(["']?([^"')]+)["']?\)/.exec(el.style.backgroundImage || ''); return m ? m[1] : ''; }
  function show(i) {
    if (!thumbs.length) return;
    cur = (i + thumbs.length) % thumbs.length;
    thumbs.forEach((t, k) => t.classList.toggle('active', k === cur));
    const src = bgOf(thumbs[cur]);
    main.style.backgroundImage = src ? 'url(' + src + ')' : '';
    main.classList.toggle('filled', !!src);
    main.classList.toggle('first', cur === 0); // badge alleen op de 1e foto
  }
  thumbs.forEach((t, i) => t.addEventListener('click', () => { if (!window.JJ_EDITOR) show(i); }));
  // in de editor: na een upload het grote beeld bijwerken
  thumbs.forEach((t) => new MutationObserver(() => show(cur)).observe(t, { attributes: true, attributeFilter: ['style'] }));
  const prev = $('.g-prev'), next = $('.g-next');
  if (prev) prev.addEventListener('click', () => show(cur - 1));
  if (next) next.addEventListener('click', () => show(cur + 1));
  show(0);

  /* ---------- bundels ---------- */
  $$('.buybox').forEach((box) => {
    const rows = $$('.bundle', box), btn = $('.buy-btn', box);
    function update() {
      const sel = $('.bundle.sel', box) || rows[1] || rows[0];
      const q = parseInt(sel.dataset.qty, 10) || 1;
      const now = $('.now', btn), was = $('s', btn);
      // de prijs in de bundel = het totaalbedrag voor die bundel (zoals ingevuld in de editor)
      if (now) now.textContent = $('.per', sel).textContent.trim();
      if (was) was.textContent = $('.was', sel).textContent.trim();
      btn.href = CHECKOUT_URL ? CHECKOUT_URL + (CHECKOUT_URL.includes('?') ? '&' : '?') + 'b=' + q : '#';
    }
    rows.forEach((r) => r.addEventListener('click', (e) => {
      if (window.JJ_EDITOR && e.target.closest('[contenteditable]')) return;
      rows.forEach((x) => x.classList.toggle('sel', x === r)); update();
    }));
    // prijzen aangepast in de editor → totaal opnieuw berekenen
    rows.forEach((r) => r.addEventListener('input', update));
    update();
    setTimeout(update, 1500);
  });

  /* ---------- FAQ: in de editor alles open zodat vragen én antwoorden te bewerken zijn ---------- */
  if (window.JJ_EDITOR) {
    $$('.faq details').forEach((d) => { d.open = true; });
    $$('.faq summary').forEach((sm) => {
      sm.addEventListener('click', (e) => e.preventDefault());
      sm.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') e.preventDefault(); });
    });
  }

  /* ---------- "Order today for delivery by …" boven elke Add To Cart (altijd vandaag + 5 dagen) ---------- */
  if (!window.JJ_EDITOR) {
    const d = new Date(Date.now() + 5 * 864e5);
    const txt = d.toLocaleDateString('en-US', { weekday: 'short' }) + ', ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    document.querySelectorAll('.atc-wrap').forEach((w) => {
      if (w.previousElementSibling && w.previousElementSibling.classList.contains('dlv')) return;
      const el = document.createElement('aside'); // eigen tag: verschuift geen opgeslagen tekstpaden
      el.className = 'dlv';
      el.innerHTML = '<i></i>Order today for delivery by <b>' + txt + '</b>';
      w.parentNode.insertBefore(el, w);
    });
  }

  /* ---------- mobiel: de review (desktop onder de foto's) onder de Add To Cart-knop tonen ---------- */
  (function () {
    const src = $('.hero .g-review'), note = $('.hero .sub-note') || $('.hero .atc-wrap');
    if (!src || !note || window.JJ_EDITOR) return;
    const m = document.createElement('aside'); // eigen tag: verschuift geen opgeslagen tekstpaden
    m.className = 'g-review g-review-m';
    const sync = () => { m.innerHTML = src.innerHTML; };
    sync();
    note.parentNode.insertBefore(m, note.nextSibling);
    // teksten/foto uit de editor komen later binnen → kopie bijwerken
    new MutationObserver(sync).observe(src, { childList: true, subtree: true, characterData: true, attributes: true });
  })();

  /* ---------- elke knop (behalve Add To Cart zelf) → de offers bovenaan, volledig in beeld ---------- */
  function toOffer() {
    const t = $('.hero .batch') || $('.hero .bundles'), end = $('.hero .atc-wrap') || t;
    const top = t.getBoundingClientRect().top + window.scrollY, bottom = end.getBoundingClientRect().bottom + window.scrollY;
    const vh = window.innerHeight, h = bottom - top;
    // past het blok in het scherm → gecentreerd; anders bovenkant bovenaan
    const y = h + 32 <= vh ? top - (vh - h) / 2 : top - 12;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }
  document.querySelectorAll('a[href="#offer"]').forEach((a) => a.addEventListener('click', (e) => {
    if (window.JJ_EDITOR) return;
    e.preventDefault(); e.stopPropagation();
    toOffer();
  }));

  /* ---------- sticky koopknop (mobiel) ---------- */
  const sticky = $('.sticky'), heroBtn = $('.hero .buy-btn');
  if (sticky && heroBtn && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => sticky.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(heroBtn);
  }
})();
