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

  /* ---------- knop onder de FAQ → naar de bundels bovenaan ---------- */
  const faqBtn = $('.faq-cta a');
  if (faqBtn) faqBtn.addEventListener('click', (e) => {
    if (window.JJ_EDITOR) return;
    e.preventDefault();
    const t = $('.hero .batch') || $('.hero .bundles');
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 16, behavior: 'smooth' });
  });

  /* ---------- sticky koopknop (mobiel) ---------- */
  const sticky = $('.sticky'), heroBtn = $('.hero .buy-btn');
  if (sticky && heroBtn && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => sticky.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(heroBtn);
    sticky.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      // naar de bundels (offers) bovenaan, met wat ruimte erboven
      const t = $('.hero .batch') || $('.hero .bundles');
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 16, behavior: 'smooth' });
    });
  }
})();
