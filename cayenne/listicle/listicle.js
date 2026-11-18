/* Cayenne-listicle: aftelklok, knoppen → salespagina (met tracking-parameters), sticky knop, Meta Pixel */
(function () {
  const ED = !!window.JJ_EDITOR;
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  if (ED) document.documentElement.classList.add('jj-editing');

  const META_PIXEL_ID = '2040844393290901'; // pixel "Big 5 Just Jenny" (zelfde als salespagina en checkout)
  const TRACK = !ED && META_PIXEL_ID && window.fbq;
  if (TRACK) { fbq('init', META_PIXEL_ID); fbq('track', 'PageView'); }

  // Salespagina: op cayenne.getjustjenny.com /listicle/sales (zelfde salespagina, maar binnen de listicle-funnel
  // zodat het dashboard kliks en sales aan de listicle toeschrijft), anders /cayenne/. Tracking-parameters gaan mee.
  function salesUrl() {
    const u = new URL(/^cayenne\./i.test(location.hostname) ? '/listicle/sales' : '/cayenne/', location.origin);
    const q = new URLSearchParams(location.search);
    q.forEach((v, k) => u.searchParams.set(k, v));
    u.searchParams.set('src', 'listicle');
    return u.toString();
  }
  if (!ED) $$('.ls-btn').forEach((a) => { a.href = salesUrl(); });
  document.addEventListener('click', (e) => { if (ED && e.target.closest('.ls-btn')) e.preventDefault(); });

  /* aftelklok: zelfde teller als de salespagina (90 min per bezoek) */
  (function () {
    const LEN = 90 * 60 * 1000, K = 'jj_cay_timer';
    let end = 0;
    try { end = parseInt(sessionStorage.getItem(K), 10) || 0; } catch (e) {}
    if (!end || end <= Date.now()) { end = Date.now() + LEN; try { sessionStorage.setItem(K, end); } catch (e) {} }
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      let left = end - Date.now();
      if (left <= 0) { end = Date.now() + LEN; left = LEN; try { sessionStorage.setItem(K, end); } catch (e) {} }
      const t = Math.floor(left / 1000), v = [pad(Math.floor(t / 3600)), pad(Math.floor((t % 3600) / 60)), pad(t % 60)];
      ['h', 'm', 's'].forEach((k, i) => { const a = $('#t-' + k); if (a) a.textContent = v[i]; $$('.t2 .t-' + k).forEach((b) => { b.textContent = v[i]; }); });
    };
    if (ED) return;
    tick(); setInterval(tick, 1000);
  })();

  // lege alinea's verbergen (ook na het inladen van de teksten uit de editor)
  const hideEmpty = () => { if (ED) return; $$('.ls-item p').forEach((p) => p.classList.toggle('is-empty', !p.textContent.trim())); };
  hideEmpty(); addEventListener('load', hideEmpty); setTimeout(hideEmpty, 1200); setTimeout(hideEmpty, 3000);

  /* video's: automatisch afspelen zodra ze in beeld komen (gedempt, in een lus), pauzeren buiten beeld */
  (function () {
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
    }), { threshold: 0.25 }) : null;
    const prep = (v) => {
      if (v.__jjAuto) return; v.__jjAuto = true;
      v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', ''); v.preload = 'auto';
      if (io) io.observe(v); else { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    };
    const scan = () => $$('video').forEach(prep);
    scan(); new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
    // sommige telefoons (spaarstand) blokkeren autoplay tot de eerste aanraking
    const kick = () => $$('video').forEach((v) => { const r = v.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } });
    addEventListener('touchstart', kick, { passive: true, once: true }); addEventListener('scroll', kick, { passive: true, once: true });
  })();

  /* sticky knop: na de vergelijkingstabel, verborgen bij het offer onderaan */
  const satc = $('#satc'), cmp = $('.cmp'), off = $('.offer');
  if (satc && !ED) {
    const upd = () => { const a = cmp && cmp.getBoundingClientRect(), r = off && off.getBoundingClientRect();
      satc.classList.toggle('on', !!(a && a.bottom < 0) && !(r && r.top < innerHeight && r.bottom > 0)); };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }
})();
