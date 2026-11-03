/* Just Jenny – bewerkmodus v2.
   Teksten en foto's bewerken; "Opslaan & publiceren" pusht content.json + foto's naar GitHub,
   waarna Vercel de site automatisch live zet. Niets wordt op deze pagina zelf opgeslagen. */

(function () {
  const REPO = { owner: 'nielsleysen-web', repo: 'just-jenny-ceylon', branch: 'main' };
  const LIVE = location.origin;
  const TOKEN_KEY = 'jj-gh-token', DRAFT_KEY = 'jj-editor-draft-v2';
  const SKIP = '.ticker, .countdown, .mini-pouch, .pouch, .pouch-lg, .pouch-side, .pouch-mid, .feel-pouches, .cmp-pouch, .sticky-pouch, .ed-ui, svg, script, style';
  const BUY_SEL = '.atc-main, .offer-atc, .offer-m-atc, .sticky-btn';
  const images = new Map(); // key -> {key,label,blob,type,objectURL}
  let C = null;             // window.JJ_CONTENT
  let baseline = { texts: [], images: [] };

  /* ---------- teksten ---------- */
  function sectionOf(el) {
    const s = el.closest('section, header, footer, .announce, .sticky-atc'); if (!s) return '';
    const h = s.querySelector('h1') || s.querySelector('h2') || s.querySelector('h3');
    return (s.id ? '#' + s.id + ' ' : '') + (h ? h.innerText.trim().slice(0, 50) : s.className.split(' ')[0]);
  }
  function hasOwnText(el) { return Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim()); }
  function makeTextsEditable() {
    document.querySelectorAll('h1,h2,h3,h4,p,li,small,strong,b,span,button,a,div,label,s,i,em,td,th').forEach(el => {
      if (el.classList.contains('ed-text') || el.classList.contains('ed-fixed')) return;
      if (el.closest(SKIP)) return;
      if (el.closest(C.IMG_SEL)) return;
      if (!hasOwnText(el)) return;
      if (el.closest('[x-text],[x-html]')) {
        const expr = (el.getAttribute('x-text') || '').trim();
        const addr = el.hasAttribute('x-text') && SIMPLE.test(expr) ? addressOf(expr, forChain(el)) : null;
        if (!addr || typeof getPath(root(), addr) !== 'string') { el.classList.add('ed-fixed'); el.title = 'Deze tekst is berekend (prijs, score, nummer) en kan hier niet getypt worden'; return; }
        el.setAttribute('contenteditable', 'true'); el.classList.add('ed-text', 'ed-data'); el.dataset.edAddr = addr; el.dataset.edOrig = el.innerText.trim();
        el.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el.blur(); } });
        el.addEventListener('input', () => { dataEdits.set(addr, el.innerText.trim()); saveDraft(); });
        el.addEventListener('blur', () => { const v = el.innerText.trim(); if (v !== el.dataset.edOrig) { dataEdits.set(addr, v); setPath(root(), addr, v); saveDraft(); } });
        return;
      }
      if (el.isContentEditable && el.closest('[contenteditable=true]') !== el) return;
      el.setAttribute('contenteditable', 'true');
      el.classList.add('ed-text');
      el.dataset.edOrig = el.innerText.trim();
      el.dataset.edPath = C.cssPath(el);
      el.addEventListener('input', saveDraft);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !['P', 'LI', 'DIV'].includes(el.tagName)) { e.preventDefault(); el.blur(); } });
    });
  }
  /* ---------- teksten uit de data (x-text) ---------- */
  const dataEdits = new Map(); // adres (bv. faqs[2].body) -> nieuwe tekst
  const SIMPLE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/;
  const root = () => (window.Alpine && Alpine.$data) ? Alpine.$data(document.body) : null;
  function getPath(o, addr) { const t = addr.match(/[^.\[\]]+/g) || []; for (const k of t) { if (o == null) return undefined; o = o[k]; } return o; }
  function setPath(o, addr, v) { const t = addr.match(/[^.\[\]]+/g) || []; for (let i = 0; i < t.length - 1; i++) { o = o && o[t[i]]; } if (o == null) return false; o[t[t.length - 1]] = v; return true; }
  function forChain(node) {
    const chain = []; let n = node;
    while (n && n !== document.body) {
      if (n._x_dataStack) {
        let p = n.previousElementSibling; while (p && !(p.tagName === 'TEMPLATE' && p.hasAttribute('x-for'))) p = p.previousElementSibling;
        const m = p && /^\s*\(?\s*([\w$]+)\s*(?:,\s*([\w$]+))?\s*\)?\s+in\s+(.+)$/.exec(p.getAttribute('x-for'));
        if (m) {
          let idx = null; try { idx = m[2] ? Alpine.$data(n)[m[2]] : null; } catch (e) { }
          if (typeof idx !== 'number') { idx = 0; let q = p.nextElementSibling; while (q && q !== n) { idx++; q = q.nextElementSibling; } }
          chain.unshift({ item: m[1], iterable: m[3].trim(), idx });
        }
      }
      n = n.parentElement;
    }
    return chain;
  }
  function resolveVar(name, chain, upto) {
    for (let k = upto - 1; k >= 0; k--) {
      const c = chain[k]; if (c.item !== name) continue;
      const it = c.iterable;
      if (it === 'storiesPage') return 'stories[' + (c.idx + ((root() || {}).revPage || 0) * 3) + ']';
      if (/^feed\.slice/.test(it)) return 'feed[' + c.idx + ']';
      if (!SIMPLE.test(it)) return null;
      const ip = it.split('.'); const base = resolveVar(ip[0], chain, k) || ip[0];
      return base + ip.slice(1).map(x => '.' + x).join('') + '[' + c.idx + ']';
    }
    return null;
  }
  function addressOf(expr, chain) {
    const parts = expr.split('.');
    const base = resolveVar(parts[0], chain, chain.length) || (chain.some(c => c.item === parts[0]) ? null : parts[0]);
    return base ? base + parts.slice(1).map(x => '.' + x).join('') : null;
  }
  function applyDataEdits() { const r = root(); if (r) dataEdits.forEach((v, a) => setPath(r, a, v)); }

  function changedTexts() {
    const out = [];
    document.querySelectorAll('.ed-text:not(.ed-data)').forEach(el => {
      const now = el.innerText.trim();
      if (now !== el.dataset.edOrig) out.push({ section: sectionOf(el), path: el.dataset.edPath, original: el.dataset.edOrig, new: now });
    });
    return out;
  }
  function mergedTexts() {
    const m = new Map(); (baseline.texts || []).forEach(t => m.set(t.path, t));
    changedTexts().forEach(t => m.set(t.path, t));
    return Array.from(m.values());
  }
  function saveDraft() {
    updateCount();
    try { const d = {}; changedTexts().forEach(t => { d[t.path] = t.new; }); localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); localStorage.setItem(DRAFT_KEY + '-data', JSON.stringify(Object.fromEntries(dataEdits))); } catch (e) { }
  }
  let draftDataLoaded = false;
  function loadDraft() {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
      document.querySelectorAll('.ed-text:not(.ed-data)').forEach(el => { const v = d[el.dataset.edPath]; if (v != null && el.innerText.trim() !== v) el.innerText = v; });
      if (!draftDataLoaded) { draftDataLoaded = true; const dd = JSON.parse(localStorage.getItem(DRAFT_KEY + '-data') || '{}'); Object.entries(dd).forEach(([a, v]) => dataEdits.set(a, v)); applyDataEdits(); }
    } catch (e) { }
  }

  /* ---------- foto's ---------- */
  function labelOf(el) {
    const t = el.innerText.trim().replace(/\s+/g, ' ');
    return t && t.length < 80 ? t : (el.className.split(' ')[0] || el.tagName);
  }
  function setMedia(el, file) {
    const key = el.dataset.jjKey;
    const old = images.get(key); if (old && old.objectURL) URL.revokeObjectURL(old.objectURL);
    const url = URL.createObjectURL(file);
    images.set(key, { key, label: el.dataset.edLabel, name: file.name, type: file.type, blob: file, objectURL: url });
    const gi = C.galleryIndex(key);
    const data = window.Alpine && Alpine.$data ? Alpine.$data(document.body) : null;
    if (gi >= 0 && data && data.thumbs && !file.type.startsWith('video/')) { data.thumbs[gi].src = url; if (gi === 0) data.img = 0; else data.img = gi; }
    else C.paint(el, url, file.type);
    el.classList.add('ed-has-img');
    updateCount();
  }
  function makeImagesDroppable() {
    C.keyElements().forEach((el, key) => {
      if (el.classList.contains('ed-drop') || el.classList.contains('ed-mirror')) return;
      if (key === '.thumb#1') { el.classList.add('ed-mirror'); el.title = 'Foto 1 = de grote foto hierboven'; return; }
      const isBg = el.matches(C.BG_SEL);
      el.dataset.edLabel = isBg ? 'Achtergrondfoto: ' + sectionOf(el) : labelOf(el);
      el.classList.add('ed-drop'); if (isBg) el.classList.add('ed-bg');
      el.title = (isBg ? 'Klik op een lege plek of sleep een foto hierheen: ' : 'Klik of sleep een foto/video hierheen: ') + el.dataset.edLabel;
      if (!isBg) el.querySelectorAll('[contenteditable]').forEach(c => c.removeAttribute('contenteditable'));
      el.addEventListener('click', e => {
        if (e.target.closest('.ed-text')) return;
        e.preventDefault(); e.stopPropagation();
        const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*,video/*';
        inp.onchange = () => inp.files[0] && setMedia(el, inp.files[0]);
        inp.click();
      }, true);
      el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('ed-over'); });
      el.addEventListener('dragleave', () => el.classList.remove('ed-over'));
      el.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); el.classList.remove('ed-over'); const f = e.dataTransfer.files[0]; if (f) setMedia(el, f); });
    });
    // reeds live foto's markeren
    (baseline.images || []).forEach(im => { const el = document.querySelector('[data-jj-key="' + im.key + '"]'); if (el) el.classList.add('ed-has-img'); });
  }

  /* ---------- GitHub ---------- */
  function token(force) {
    let t = localStorage.getItem(TOKEN_KEY) || '';
    if (!t || force) {
      t = (prompt('Plak je GitHub-token (fine-grained, alleen repo ' + REPO.owner + '/' + REPO.repo + ', Contents: read & write). Het wordt alleen in deze browser bewaard.') || '').trim();
      if (t) localStorage.setItem(TOKEN_KEY, t);
    }
    return t;
  }
  async function gh(method, path, body) {
    const r = await fetch('https://api.github.com/repos/' + REPO.owner + '/' + REPO.repo + '/' + path, {
      method, headers: { Authorization: 'Bearer ' + token(), Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    if (r.status === 401 || r.status === 403) { localStorage.removeItem(TOKEN_KEY); throw new Error('GitHub-token geweigerd (' + r.status + '). Klik opnieuw op Opslaan en plak een geldig token.'); }
    if (!r.ok && r.status !== 404) throw new Error('GitHub ' + r.status + ': ' + (await r.text()).slice(0, 120));
    return r.status === 404 ? null : r.json();
  }
  const shaCache = new Map();
  async function shaOf(path) { const j = await gh('GET', 'contents/' + path + '?ref=' + REPO.branch + '&t=' + Date.now()); return j && j.sha; }
  async function putFile(path, base64, message) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const sha = shaCache.has(path) ? shaCache.get(path) : await shaOf(path);
      const body = { message, content: base64, branch: REPO.branch }; if (sha) body.sha = sha;
      try {
        const j = await gh('PUT', 'contents/' + path, body);
        if (j && j.content && j.content.sha) shaCache.set(path, j.content.sha);
        return j;
      } catch (e) {
        if (!/GitHub 409/.test(e.message) || attempt === 3) throw e;
        shaCache.delete(path); await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }
  const MAXW = { '.gallery-main': 1400, '.thumb': 1400, '.report': 2000, '.review-img': 800, '.rv-thumb': 1000, '.avatar-ph': 200, '.bundle-qty': 300, '.offer-row-img': 300, '.sticky-pouch': 200, '.offer-img': 700, '.cmp-photo': 400, '.cmp-pouch': 400, '.flip-img': 500, '.journey-banner': 1400, '.ph-box': 1200, '.ph-img': 900, '.feel-pouches': 1000 };
  // Foto's verkleinen + omzetten naar WebP vóór upload, zodat de site snel blijft.
  async function optimize(im) {
    if (!/^image\/(png|jpe?g|webp|avif|bmp)$/i.test(im.type)) return { blob: im.blob, type: im.type, ext: extOf(im.type, im.name) };
    const max = MAXW[im.key.split('#')[0]] || 1200;
    const bmp = await createImageBitmap(im.blob);
    const w = Math.min(max, bmp.width), h = Math.round(bmp.height * w / bmp.width);
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    cv.getContext('2d').drawImage(bmp, 0, 0, w, h);
    const out = await new Promise(r => cv.toBlob(r, 'image/webp', 0.82));
    if (!out || out.type !== 'image/webp') return { blob: im.blob, type: im.type, ext: extOf(im.type, im.name) };
    return { blob: out, type: 'image/webp', ext: 'webp' };
  }
  function blobToBase64(blob) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); }); }
  function safeName(key) { return key.replace(/^\./, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '').toLowerCase(); }
  function extOf(type, name) { const m = /\.([a-z0-9]{2,5})$/i.exec(name || ''); if (m) return m[1].toLowerCase(); return ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' })[type] || 'bin'; }

  async function publish() {
    const btn = document.getElementById('ed-save');
    if (!token()) { btn.textContent = '⚠ geen token'; return; }
    btn.disabled = true;
    try {
      const imgs = new Map(); (baseline.images || []).forEach(im => imgs.set(im.key, im));
      const list = Array.from(images.values());
      for (let i = 0; i < list.length; i++) {
        const im = list[i];
        btn.textContent = 'Foto ' + (i + 1) + '/' + list.length + ' uploaden…';
        const o = await optimize(im);
        if (o.blob.size > 25 * 1024 * 1024) throw new Error(im.label + ': bestand groter dan 25 MB');
        const path = 'assets/uploads/' + safeName(im.key) + '.' + o.ext;
        await putFile(path, await blobToBase64(o.blob), 'Upload ' + im.label);
        imgs.set(im.key, { key: im.key, label: im.label, src: path + '?v=' + Date.now().toString(36), type: o.type });
        im.committed = true;
      }
      btn.textContent = 'Teksten opslaan…';
      const content = { saved: new Date().toISOString(), texts: mergedTexts(), data: Object.assign({}, baseline.data || {}, Object.fromEntries(dataEdits)), images: Array.from(imgs.values()) };
      await putFile('content.json', btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 1)))), 'Update content (' + (content.texts.length + Object.keys(content.data).length) + ' teksten, ' + content.images.length + ' foto\'s)');
      baseline = content; dataEdits.clear();
      document.querySelectorAll('.ed-text').forEach(el => { el.dataset.edOrig = el.innerText.trim(); });
      try { localStorage.removeItem(DRAFT_KEY + '-data'); } catch (e) { }
      images.forEach(im => { if (im.objectURL) { /* bewaren voor weergave */ } });
      images.clear();
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) { }
      updateCount();
      const inf = document.getElementById('ed-saved'); if (inf) inf.textContent = 'gepubliceerd ' + new Date().toLocaleTimeString('nl-BE').slice(0, 5) + ' – live binnen ±1 min';
      btn.textContent = '✓ Gepubliceerd'; setTimeout(() => { btn.textContent = '🚀 Opslaan & publiceren'; btn.disabled = false; }, 3000);
    } catch (e) {
      console.error(e); btn.disabled = false; btn.textContent = '🚀 Opslaan & publiceren';
      alert('Publiceren mislukt:\n' + (e.message || e));
    }
  }

  /* ---------- UI ---------- */
  function updateCount() {
    const c = document.getElementById('ed-count');
    if (c) c.textContent = (changedTexts().length + dataEdits.size) + ' teksten · ' + images.size + ' foto\'s nog niet gepubliceerd';
  }
  function ui() {
    const bar = document.createElement('div'); bar.className = 'ed-ui';
    bar.innerHTML = '<strong>✏️ Bewerkmodus</strong><span id="ed-count">0 teksten · 0 foto\'s nog niet gepubliceerd</span>' +
      '<em id="ed-saved"></em><button type="button" id="ed-help">Uitleg</button><button type="button" id="ed-live">Bekijk live</button><button type="button" id="ed-save" class="ed-primary">🚀 Opslaan & publiceren</button><button type="button" id="ed-token">Token</button><button type="button" id="ed-reset">Reset</button>';
    document.body.appendChild(bar);
    const help = document.createElement('div'); help.className = 'ed-ui ed-help';
    help.innerHTML = '<b>Zo werkt het</b><ol><li>Klik op een tekst en typ erover (oranje stippellijn = bewerkbaar; grijs = berekend, zoals prijzen en scores).</li><li>Klik op een foto-/videovak (groen gestreept) of sleep er een bestand in. Grote foto = foto 1; vakjes 2–9 zijn de andere productfoto\'s. De sectie "Cosa riferiscono i clienti" krijgt een achtergrondfoto met overlay.</li><li>Klik op <b>Opslaan & publiceren</b>: alles gaat naar GitHub en Vercel zet het binnen ±1 minuut live. De eerste keer vraagt de pagina je GitHub-token.</li></ol><p>Niet-gepubliceerde teksten blijven in deze browser staan; foto\'s alleen tot je de pagina herlaadt. Koopknoppen sturen hier niet door naar de checkout.</p><button type="button" id="ed-close">Sluiten</button>';
    help.style.display = 'none'; document.body.appendChild(help);
    document.getElementById('ed-save').onclick = publish;
    document.getElementById('ed-live').onclick = () => window.open(LIVE + '?v=' + Date.now(), '_blank');
    document.getElementById('ed-token').onclick = () => token(true);
    document.getElementById('ed-help').onclick = () => help.style.display = 'block';
    document.getElementById('ed-close').onclick = () => help.style.display = 'none';
    let rc = 0; document.getElementById('ed-reset').onclick = (e) => { rc++; if (rc < 2) { e.target.textContent = 'Zeker? Klik nogmaals'; setTimeout(() => { rc = 0; e.target.textContent = 'Reset'; }, 3000); return; } try { localStorage.removeItem(DRAFT_KEY); localStorage.removeItem(DRAFT_KEY + '-data'); } catch (x) { } location.reload(); };
  }

  function init() {
    document.addEventListener('click', e => { if (e.target.closest(BUY_SEL)) e.stopPropagation(); }, true);
    C.applyData(baseline);
    makeImagesDroppable();
    makeTextsEditable();
    loadDraft();
    ui();
    updateCount();
    let mo; const rescan = () => { clearTimeout(mo); mo = setTimeout(() => { try { makeImagesDroppable(); makeTextsEditable(); loadDraft(); updateCount(); } catch (e) { } }, 250); };
    new MutationObserver(muts => { if (muts.some(m => m.addedNodes.length)) rescan(); }).observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('[x-show]').forEach(el => {
      if (el.closest('.toast, .sticky-atc, .ed-ui')) return;
      if (el.matches('.acc-body, [class*="body"], [class*="panel"]')) el.style.display = 'block';
    });
  }
  function showErr(e) {
    const d = document.createElement('div'); d.className = 'ed-ui'; d.style.cssText = 'top:auto;bottom:0;background:#B00020;color:#fff;padding:10px 16px;font-size:12px';
    d.textContent = 'Bewerkmodus fout: ' + (e && e.message || e); document.body.appendChild(d); console.error(e);
  }
  function boot() {
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      const ready = window.JJ_CONTENT && document.querySelector('.why-card, .offer-row') && document.body.innerText.length > 2000;
      if (ready || tries > 40) {
        clearInterval(t);
        C = window.JJ_CONTENT;
        if (!C) return showErr(new Error('apply-content.js niet geladen'));
        C.ready.then(c => { baseline = c || { texts: [], images: [] }; try { init(); } catch (e) { showErr(e); } });
      }
    }, 300);
  }
  window.addEventListener('error', ev => { if (!document.querySelector('.ed-ui')) showErr(ev.error || ev.message); });
  if (document.readyState === 'complete') boot(); else window.addEventListener('load', boot);
})();
