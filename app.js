// Just Jenny – Ceylon Cinnamon product page logic (Alpine.js)
function page() {
  const BUNDLES = [
    { id: 1, qty: 1, title: 'Buy One', save: '50%', price: '€29.99', was: '€59.99', badge: '' },
    { id: 2, qty: 3, title: 'Buy 2 Get 1 FREE', save: '67%', price: '€59.99', was: '€179.97', badge: 'Most Popular' },
    { id: 3, qty: 5, title: 'Buy 3 Get 2 FREE', save: '70%', price: '€89.99', was: '€299.95', badge: 'Free Shipping' }
  ];
  const IC = (d) => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const BADGE = (d) => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9643A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '<path d="M3 3l18 18"/></svg>';

  return {
    // state
    bundle: 2, img: 0, acc: 0, ben: -1, faq: -1, revPage: 0, rStart: 0,
    cart: 0, toast: false, toastQty: 0, subscribed: false, sticky: false,
    whyIdx: 0,
    vidIdx: 0,
    storyIdx: 0,
    tlP: 0, tlAct: 0, wide: true, now: Date.now(), end: Date.now() + 6753000,

    bundles: BUNDLES,
    // Customer survey results. Fill in YOUR OWN survey numbers (e.g. value: 84).
    // While value is null the page shows "[XX]%" and nothing animates.
    reportStats: [
      { value: null, label: 'would keep Just Jenny in their daily routine' },
      { value: null, label: 'felt steadier energy through the day*' },
      { value: null, label: 'found it easier on the stomach than other cinnamon supplements*' },
      { value: null, label: 'would recommend it to a friend*' }
    ],
    statShown: [0, 0, 0, 0],
    thumbs: [
      { short: 'Pouch', label: 'Product pouch' },
      { short: 'Softgels', label: 'Softgels close-up' },
      { short: 'Benefits', label: 'Key benefits infographic' },
      { short: 'Lifestyle', label: 'Woman 50+ with product at breakfast' }
    ],
    productAcc: [
      { t: 'Clinically Supported Benefits', body: 'Supports healthy blood sugar levels, steady daily energy and metabolic balance – with Ceylon cinnamon, an ingredient studied for its role in glucose metabolism.*' },
      { t: 'Key Ingredients', body: 'Ceylon cinnamon extract (Cinnamomum verum, 12:1 – equal to 7,200 mg raw cinnamon), MCT oil, softgel shell. No harsh additives, gluten-free, non-GMO. [Confirm final ingredient list]' },
      { t: 'How It Works', body: 'Take one softgel a day with a meal. The MCT oil carries cinnamon’s fat-soluble compounds for better absorption, so one softgel does the work of several capsules.' }
    ],
    benefits: [
      { t: 'Blood Sugar Support', sub: 'Supports healthy blood sugar levels', img: 'blood sugar / glucose', short: 'Ceylon cinnamon is studied for its role in healthy glucose metabolism – one daily softgel helps keep your levels steady.*', deep: 'Ceylon cinnamon contains polyphenols that are studied for their role in how the body handles glucose after meals. Taken every day, it helps support healthy blood sugar levels that are already within the normal range – fewer spikes, fewer afternoon crashes.*' },
      { t: 'Gentle on the Stomach', sub: 'Designed for comfortable daily use', img: 'woman with a calm stomach', short: 'Suspended in MCT oil inside a smooth softgel – no burning, no bitter aftertaste, easy on your stomach.', deep: 'Powdered cinnamon capsules can burn, repeat on you or leave a bitter aftertaste. Just Jenny suspends the extract in MCT oil inside a smooth softgel, so it dissolves gently – no burning, no aftertaste, easy to take with breakfast.' },
      { t: 'Liver Health Support', sub: 'Made with coumarin-free Ceylon cinnamon', img: 'healthy liver / Ceylon vs Cassia', short: 'True Ceylon is naturally low in coumarin, so it’s suited to taking every day for the long term.', deep: 'Cassia cinnamon – the kind in most supplements and spice jars – is high in coumarin, which can put strain on the liver when taken daily. True Ceylon cinnamon is naturally very low in coumarin, which makes it the better choice for long-term daily use.' },
      { t: 'Enhanced Absorption', sub: 'Helps your body absorb cinnamon', img: 'MCT oil softgel', short: 'Cinnamon’s active compounds are fat-soluble – MCT oil helps your body take up more of them.', deep: 'Cinnamon’s active compounds are fat-soluble. Bound to MCT oil, a fast-digesting fat, more of them are taken up by your body instead of passing straight through – so one softgel works harder than several dry capsules.' }
    ],
    weeks: [
      { t: 'Week 1–2: Easy Start', items: ['One softgel a day slots straight into your morning', 'Many people feel their energy start to even out', 'Fewer late-afternoon sugar cravings for some', 'Your body starts getting used to daily Ceylon support'] },
      { t: 'Week 3–4: Finding Balance', items: ['Days feel more even from morning to evening', 'Fewer highs and lows than before', 'The routine starts to feel automatic', 'Sticking with it gets easier'] },
      { t: 'Week 5–6: Metabolic Support', items: ['This is often when people notice the biggest change', 'Supports healthy glucose metabolism within the normal range*', 'More confidence in your daily energy', 'Benefits build the longer you keep going'] },
      { t: 'Week 7–8+: Long-Term Wellness', items: ['Ongoing metabolic and antioxidant support*', 'Made for steady, long-term daily use', 'About stability – not a quick fix', 'Individual results depend on health, diet and lifestyle'] }
    ],
    reasons: [
      { t: '12:1 Concentrated Ceylon Cinnamon', photo: 'softgels on cinnamon powder', body: 'Most cinnamon on the shelf is Cassia, which is high in coumarin. Just Jenny uses only true Ceylon cinnamon, concentrated so a single daily softgel equals 7,200 mg of raw cinnamon.' },
      { t: 'Zero-Coumarin, Clean Formula', photo: 'Ceylon vs Cassia sticks side by side', body: 'Only true Cinnamomum verum – no Cassia, no fillers, no harsh additives. Gluten-free and non-GMO.' },
      { t: 'MCT Oil Delivery System', photo: 'MCT oil drop', body: 'Cinnamon’s active compounds are fat-soluble. Suspended in MCT oil they absorb better than dry powder capsules – and sit gently on the stomach.' },
      { t: 'Independently Lab Tested', photo: 'lab testing', body: 'Every batch is third-party tested for purity and potency, so you get exactly what the label promises.' },
      { t: 'One Easy Softgel a Day', photo: 'one softgel in palm of hand', body: 'No handful of hard-to-swallow capsules. One small softgel with breakfast is all it takes.' }
    ],
    stories: [
      { r: 5.0, title: '[Review headline, e.g. "Finally back in control!"]', text: '[Paste a real customer review here – 3 to 5 sentences.]', name: '[Customer name]', tag1: 'Stable Sugar', tag2: 'Steady Energy' },
      { r: 4.8, title: '[Review headline 2]', text: '[Second real customer review.]', name: '[Customer name]', tag1: 'Fewer Cravings', tag2: 'Daily Routine' },
      { r: 4.9, title: '[Review headline 3]', text: '[Third real customer review.]', name: '[Customer name]', tag1: 'Gentle on Stomach', tag2: 'Long-Term Use' },
      { r: 4.7, title: '[Review headline 4]', text: '[Fourth real customer review.]', name: '[Customer name]', tag1: 'Easy to Swallow', tag2: 'No Aftertaste' },
      { r: 5.0, title: '[Review headline 5]', text: '[Fifth real customer review.]', name: '[Customer name]', tag1: 'Fewer Crashes', tag2: 'Steady Energy' },
      { r: 4.6, title: '[Review headline 6]', text: '[Sixth real customer review.]', name: '[Customer name]', tag1: 'Long-Term Use', tag2: 'Stable Sugar' }
    ],
    compare: [
      { us: 'Backed by Research', them: 'Trend-Driven Formulas', icon: IC('<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M7.5 15h9"/>') },
      { us: 'Third-Party Lab Tested', them: 'No Independent Testing', icon: IC('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>') },
      { us: 'Low-Coumarin Ceylon, Clean Formula', them: 'Cheap, High-Coumarin Cassia', icon: IC('<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z"/><path d="M5 19l8-8"/>') },
      { us: 'Full-Strength 12:1 Extract', them: 'Low-Dose Formulas', icon: IC('<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>') },
      { us: 'Boosted with MCT Oil', them: 'Poor Absorption', icon: IC('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>') },
      { us: 'Easy, High-Absorption Softgels', them: 'Big, Hard-to-Swallow Capsules', icon: IC('<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="m9.5 8.4 5 7.2"/>') }
    ],
    faqs: [
      { t: 'What makes Ceylon cinnamon different from what most supplements use?', body: 'Most supplements use Cassia – cheaper, but high in coumarin, which can strain the liver with daily long-term use. Just Jenny uses only true Ceylon (Cinnamomum verum), which is naturally low in coumarin.' },
      { t: 'How does Just Jenny compare to standard cinnamon capsules at the pharmacy?', body: 'Pharmacy capsules are usually low-dose Cassia powder. Just Jenny is a 12:1 Ceylon extract equal to 7,200 mg of raw cinnamon, delivered in MCT oil for better absorption – in one softgel a day.' },
      { t: 'Is it safe to take alongside my current medications?', body: 'If you take any medication – especially for blood sugar, blood pressure or blood thinning – check with your doctor or pharmacist before starting a new supplement.' },
      { t: 'When can I expect to notice a difference?', body: 'Many people notice steadier energy in the first two weeks; most see the biggest change around weeks 5–6 of daily use. Results vary with health, diet and lifestyle.' }
    ],
    feed: [
      { r: 5.0, photo: true, ago: '[2 days ago]' }, { r: 5.0, photo: false, ago: '[1 week ago]' }, { r: 4.6, photo: true, ago: '[3 days ago]' },
      { r: 5.0, photo: false, ago: '[5 days ago]' }, { r: 4.8, photo: true, ago: '[2 weeks ago]' }, { r: 5.0, photo: false, ago: '[3 weeks ago]' },
      { r: 4.7, photo: false, ago: '[1 month ago]' }, { r: 5.0, photo: true, ago: '[1 month ago]' }, { r: 4.9, photo: false, ago: '[1 month ago]' }
    ].map((x, i) => Object.assign(x, {
      initials: ['AM', 'JS', 'LK', 'RT', 'MB', 'CW', 'DP', 'EH', 'SN'][i],
      bg: ['#F6E2D6', '#E4EEF3', '#EAF3E4', '#F3E8F1', '#FBF0CF', '#E8EAF6', '#F6E2D6', '#E4EEF3', '#EAF3E4'][i]
    })),

    // derived
    get cur() { return BUNDLES.find((b) => b.id === this.bundle) || BUNDLES[1]; },
    get secs() { return Math.max(0, Math.floor((this.end - this.now) / 1000)); },
    get hh() { return String(Math.floor(this.secs / 3600)).padStart(2, '0'); },
    get mm() { return String(Math.floor((this.secs % 3600) / 60)).padStart(2, '0'); },
    get ss() { return String(this.secs % 60).padStart(2, '0'); },
    get toastText() { return 'Added ' + this.toastQty + (this.toastQty === 1 ? ' pouch' : ' pouches') + ' to your cart'; },
    get storiesPage() { return this.stories.slice(this.revPage * 3, this.revPage * 3 + 3); },
    get per() { return this.wide ? 3 : 1; },
    get rStartC() { return Math.min(this.rStart, this.reasons.length - this.per); },
    get cardW() { return 'calc((100% - ' + ((this.per - 1) * 24) + 'px) / ' + this.per + ')'; },
    get trackStyle() { return 'transform: translateX(calc(-' + this.rStartC + ' * (100% + 24px) / ' + this.per + '))'; },

    // helpers
    stars(r, w) {
      const h = Math.round(w * 18 / 98);
      const last = Math.round(18 * Math.max(0, Math.min(1, r - 4)));
      const pts = [9, 29, 49, 69, 89].map((x) => '<polygon fill="#fff" points="' + [[0, -7], [2, -2], [7, -2], [3, 1.5], [4.5, 7], [0, 3.8], [-4.5, 7], [-3, 1.5], [-7, -2], [-2, -2]].map((p) => (x + p[0]) + ',' + (9 + p[1])).join(' ') + '"/>').join('');
      return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 98 18" role="img" aria-label="Rated ' + r.toFixed(1) + ' out of 5" style="display:block">' +
        [0, 20, 40, 60].map((x) => '<rect x="' + x + '" width="18" height="18" fill="#00B67A"/>').join('') +
        '<rect x="80" width="18" height="18" fill="#DCDCE6"/><rect x="80" width="' + last + '" height="18" fill="#00B67A"/>' + pts + '</svg>';
    },
    tickerIcon(i) {
      const s = (d) => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
      return [
        s('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>'),
        s('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>'),
        s('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>')
      ][i];
    },
    badgeIcon(i) {
      return [
        BADGE('<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z"/><path d="M5 19l8-8"/>'),
        BADGE('<path d="M12 21V7"/><path d="M12 8c-2-1-3-3-3-5 2 1 3 3 3 5Z"/><path d="M12 8c2-1 3-3 3-5-2 1-3 3-3 5Z"/><path d="M12 13c-2-1-3-3-3-5 2 1 3 3 3 5Z"/><path d="M12 13c2-1 3-3 3-5-2 1-3 3-3 5Z"/><path d="M12 18c-2-1-3-3-3-5 2 1 3 3 3 5Z"/><path d="M12 18c2-1 3-3 3-5-2 1-3 3-3 5Z"/>'),
        BADGE('<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/>')
      ][i];
    },
    packs(n) {
      return Array.from({ length: n }, (_, k) => {
        const off = k - (n - 1) / 2;
        const big = n === 1 ? 1.35 : (Math.abs(off) < 0.6 ? 1.1 : 0.92);
        return 'width:' + Math.round(48 * big) + 'px;height:' + Math.round(64 * big) + 'px;margin:0 -' + (n > 1 ? 8 : 0) + 'px;z-index:' + (10 - Math.round(Math.abs(off) * 2)) + ';transform:rotate(' + (off * 5) + 'deg)';
      });
    },
    addToCart(id) {
      const b = BUNDLES.find((x) => x.id === id) || BUNDLES[1];
      this.bundle = b.id;
      this.cart += b.qty;
      this.toastQty = b.qty;
      this.toast = true;
      clearTimeout(this._t);
      this._t = setTimeout(() => { this.toast = false; }, 2600);
      // TODO: hook up to your Shopify cart / checkout link here
    },
    whyScroll() {
      const el = this.$refs.whyTrack; const card = el.children[0];
      if (!card) return;
      const w = card.offsetWidth + 14;
      this.whyIdx = Math.max(0, Math.min(3, Math.round(el.scrollLeft / w)));
    },
    vidScroll(){ const t=this.$refs.vidTrack; if(!t) return; const c=t.querySelector('.story-video'); if(!c) return; const w=c.offsetWidth+12; this.vidIdx=Math.max(0,Math.min(3,Math.round(t.scrollLeft/w))); },
    vidGo(i){ const t=this.$refs.vidTrack; const c=t.querySelector('.story-video'); t.scrollTo({left:i*(c.offsetWidth+12),behavior:'smooth'}); },
    storyScroll() {
      const el = this.$refs.storyTrack; const c = el.children[0];
      if (!c) return;
      this.storyIdx = Math.max(0, Math.min(this.stories.length - 1, Math.round(el.scrollLeft / (c.offsetWidth + 12))));
    },
    storyGo(i) {
      const el = this.$refs.storyTrack; const c = el.children[0];
      i = Math.max(0, Math.min(this.stories.length - 1, i));
      el.scrollTo({ left: i * (c.offsetWidth + 12), behavior: 'smooth' });
      this.storyIdx = i;
    },
    whyGo(i) {
      const el = this.$refs.whyTrack; const card = el.children[0];
      i = Math.max(0, Math.min(3, i));
      el.scrollTo({ left: i * (card.offsetWidth + 14), behavior: 'smooth' });
      this.whyIdx = i;
    },
    statText(i) {
      const st = this.reportStats[i];
      return st.value == null ? '[XX]%' : Math.round(this.statShown[i]) + '%';
    },
    countUp() {
      const dur = 2200, t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const ease = 1 - Math.pow(1 - k, 3);
        this.statShown = this.reportStats.map((s) => (s.value || 0) * ease);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    measure() {
      this.wide = window.innerWidth > 900;
      const el = this.$refs.timeline;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const lineH = Math.max(1, r.height - 26);
      let p = (window.innerHeight * 0.6 - (r.top + 26)) / lineH;
      p = Math.max(0, Math.min(1, p));
      this.tlP = p;
      const fillPx = 26 + p * lineH;
      let act = 0;
      el.querySelectorAll('.tl-item').forEach((li) => { if (li.offsetTop + 25 <= fillPx + 1) act++; });
      this.tlAct = act;
    },
    init() {
      setInterval(() => { this.now = Date.now(); }, 1000);
      const io = new IntersectionObserver((entries) => {
        const e = entries[entries.length - 1];
        this.sticky = !e.isIntersecting && e.boundingClientRect.top < 0;
      });
      io.observe(this.$refs.hero);
      const io2 = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io2.disconnect(); this.countUp(); }
      }, { threshold: 0.35 });
      io2.observe(this.$refs.report);
      let raf = null;
      const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = null; this.measure(); }); };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      this.$nextTick(() => this.measure());
    }
  };
}
