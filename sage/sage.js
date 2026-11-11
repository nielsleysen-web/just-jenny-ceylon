/* Just Jenny – Sage Leaf salespagina (/sage): galerij, bundelkeuze, koopknoppen, sticky knop. */
(function () {
  // Checkout voor dit product: vul hier de link in zodra de checkout bestaat (?b=1|3|5 wordt erachter gezet)
  const CHECKOUT_URL = 'https://checkout.getjustjenny.com/en/sageleaf';

  const META_PIXEL_ID = '1514819433466204'; // zelfde pixel als de checkout
  const PRODUCT_ID = '10710604906762';       // Shopify-product "Just Jenny™ Sage Leaf Extract" (content_ids, zelfde als op de checkout)
  const TRACK = !window.JJ_EDITOR && META_PIXEL_ID && window.fbq;
  if (TRACK) { fbq('init', META_PIXEL_ID); fbq('track', 'PageView'); fbq('track', 'ViewContent', { content_ids: [PRODUCT_ID], content_type: 'product', currency: 'USD' }); }
  // Tracking-parameters (fbclid, ad_id, utm's…) die jjb-track.js bewaart, meesturen naar de checkout (ander domein → cookies gaan niet mee)
  function trackedCheckoutUrl(qty) {
    const url = new URL(CHECKOUT_URL); url.searchParams.set('b', qty);
    try {
      const d = JSON.parse(localStorage.getItem('jjb_track') || '{}');
      ['ad_id', 'adset_id', 'campaign_id', 'fbclid', 'fbc', 'fbp', 'vid', 'utm_source', 'utm_campaign', 'utm_content', 'first_touch', 'host', 'path', 'pgs'].forEach((k) => { if (d[k]) url.searchParams.set(k, d[k]); });
      const q = new URLSearchParams(location.search);
      ['fbclid', 'ad_id', 'adset_id', 'campaign_id', 'utm_source', 'utm_campaign', 'utm_content'].forEach((k) => { if (q.get(k) && !url.searchParams.get(k)) url.searchParams.set(k, q.get(k)); });
      const ck = (n) => (document.cookie.match('(?:^|; )' + n + '=([^;]*)') || [])[1];
      ['fbp', 'fbc'].forEach((k) => { const v = ck('_' + k); if (v && !url.searchParams.get(k)) url.searchParams.set(k, decodeURIComponent(v)); });
    } catch (e) { }
    return url.toString();
  }

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
      btn.href = CHECKOUT_URL ? trackedCheckoutUrl(q) : '#';
      btn.dataset.qty = q;
    }
    // Add To Cart: InitiateCheckout + doorsturen met de tracking-parameters van dat moment
    btn.addEventListener('click', (e) => {
      if (window.JJ_EDITOR || !CHECKOUT_URL) return;
      e.preventDefault();
      const q = parseInt(btn.dataset.qty, 10) || 1, value = num(($('.now', btn) || {}).textContent);
      if (TRACK) fbq('track', 'InitiateCheckout', { content_ids: [PRODUCT_ID], content_type: 'product', num_items: q, value: value, currency: 'USD' });
      setTimeout(() => { window.location.href = trackedCheckoutUrl(q); }, TRACK ? 250 : 0);
    });
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
