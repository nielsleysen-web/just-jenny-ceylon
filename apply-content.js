/* Just Jenny – past content.json (teksten + foto's uit de bewerkmodus) toe op de pagina.
   content.json wordt door de bewerkpagina naar GitHub gepusht; Vercel zet het live. */
(function () {
  const IMG_SEL = [
    '.gallery-main', '.thumb', '.expert-video', '.ph-box', '.ph-img', '.review-img', '.flip-img',
    '.journey-banner', '.cmp-photo', '.cmp-pouch', '.riskfree-photo > div', '.story-video',
    '.feel-pouches', '.offer-img', '.offer-row-img', '.bundle-qty', '.rv-thumb', '.tp-photo', '.avatar-ph', '.sticky-pouch'
  ].join(',');
  const BG_SEL = '.report';
  const DROP_SEL = IMG_SEL + ',' + BG_SEL;
  const OVERLAY = 'linear-gradient(rgba(176,79,40,.78),rgba(176,79,40,.78))';

  // Zelfde sleutels als in de bewerkmodus: selector + volgnummer, in documentvolgorde.
  function keyElements() {
    const counts = {}, out = new Map();
    document.querySelectorAll(DROP_SEL).forEach(el => {
      if (el.parentElement && el.parentElement.closest(IMG_SEL)) return;
      const sel = DROP_SEL.split(',').find(s => el.matches(s.trim())).trim();
      counts[sel] = (counts[sel] || 0) + 1;
      const key = sel + '#' + counts[sel];
      el.dataset.jjKey = key; out.set(key, el);
    });
    return out;
  }
  function paint(el, src, type) {
    el.classList.add('has-img');
    el.querySelectorAll('.jj-video').forEach(v => v.remove());
    if (type && type.startsWith('video/')) {
      el.style.backgroundImage = '';
      const v = document.createElement('video'); v.className = 'jj-video'; v.src = src; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      el.appendChild(v);
    } else if (el.matches(BG_SEL)) {
      el.style.background = OVERLAY + ', url(' + src + ') center/cover no-repeat';
    } else {
      el.style.backgroundImage = 'url(' + src + ')';
      el.style.backgroundSize = el.matches('.bundle-qty, .offer-row-img, .offer-img, .sticky-pouch, .cmp-pouch') ? 'contain' : 'cover';
      el.style.backgroundPosition = 'center'; el.style.backgroundRepeat = 'no-repeat';
      if (el.matches('.ph-box')) { const im = new Image(); im.onload = () => { el.style.aspectRatio = im.naturalWidth + '/' + im.naturalHeight; }; im.src = src; }
    }
  }
  function cssPath(el) {
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.body) {
      let s = el.tagName.toLowerCase();
      if (el.id) { parts.unshift('#' + el.id); break; }
      const p = el.parentElement;
      if (p) { const sib = Array.from(p.children).filter(c => c.tagName === el.tagName); if (sib.length > 1) s += ':nth-of-type(' + (sib.indexOf(el) + 1) + ')'; }
      parts.unshift(s); el = p;
    }
    return parts.join('>');
  }
  function galleryIndex(key) {
    if (key === '.gallery-main#1') return 0;
    const m = /^\.thumb#(\d+)$/.exec(key); return m ? parseInt(m[1], 10) - 1 : -1;
  }
  function applyData(c) {
    const data = window.Alpine && Alpine.$data ? Alpine.$data(document.body) : null;
    (c.texts || []).forEach(t => {
      try { const el = document.querySelector(t.path); if (el && !el.closest('[x-text],[x-html]')) el.innerText = t.new; } catch (e) { }
    });
    if (data && c.data) Object.entries(c.data).forEach(([a, v]) => { try { const t = a.match(/[^.\[\]]+/g); let o = data; for (let i = 0; i < t.length - 1; i++) o = o[t[i]]; if (o) o[t[t.length - 1]] = v; } catch (e) { } });
    const map = keyElements();
    (c.images || []).forEach(im => {
      const gi = galleryIndex(im.key);
      const src = srcOf(im.src);
      if (gi >= 0 && data && data.thumbs && data.thumbs[gi] && !(im.type || '').startsWith('video/')) { data.thumbs[gi].src = src; return; }
      const el = map.get(im.key); if (el) paint(el, src, im.type);
    });
  }
  const api = { IMG_SEL, BG_SEL, DROP_SEL, OVERLAY, keyElements, paint, cssPath, applyData, galleryIndex, data: null, ready: null };
  const BASE = window.JJ_ASSET_BASE || '';
  const srcOf = (src) => (/^(https?:|data:|blob:|\/)/.test(src) ? src : BASE + src);
  api.ready = fetch((window.JJ_CONTENT_URL || 'content.json') + (window.JJ_CONTENT_URL ? '?t=' + Date.now() : ''), { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null).then(c => { api.data = c || { texts: [], images: [] }; return api.data; });
  function run() { api.ready.then(c => { applyData(c); setTimeout(() => applyData(c), 900); }); }
  if (!window.JJ_NO_APPLY) {
    if (window.Alpine) run(); else document.addEventListener('alpine:initialized', run);
  }
  window.JJ_CONTENT = api;
})();
