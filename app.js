// Just Jenny – Ceylon Cinnamon product page logic (Alpine.js)
function page() {
  // Checkout: elke "Aggiungi al carrello"-knop stuurt direct door naar deze URL,
  // met ?bundle=<id>&qty=<aantal>. Pas dit pad aan zodra de custom checkout klaar is.
  const CHECKOUT_URL = 'https://checkout.getjustjenny.com/ceylon'; // Stripe/PayPal-checkout (jjb-profit-dashboard, product 'ceylon')
  const META_PIXEL_ID = '1514819433466204'; // Meta Pixel-ID (zelfde als META_PIXEL_ID op de checkout). Leeg = geen pixel-events vanaf deze pagina.
  const PRODUCT_ID = '10700016156938'; // Shopify-product "Cannella di Ceylon" (content_ids, zelfde als op de checkout)
  // Tracking-parameters (fbclid, ad_id, utm's…) die jjb-track.js in localStorage bewaart, meesturen naar de checkout
  function trackedCheckoutUrl(qty) {
    const url = new URL(CHECKOUT_URL); url.searchParams.set('b', qty);
    try {
      const d = JSON.parse(localStorage.getItem('jjb_track') || '{}');
      ['ad_id', 'adset_id', 'campaign_id', 'fbclid', 'fbc', 'fbp', 'vid', 'utm_source', 'utm_campaign', 'utm_content', 'first_touch', 'host', 'path', 'pgs'].forEach((k) => { if (d[k]) url.searchParams.set(k, d[k]); });
      const q = new URLSearchParams(location.search);
      ['fbclid', 'ad_id', 'adset_id', 'campaign_id', 'utm_source', 'utm_campaign', 'utm_content'].forEach((k) => { if (q.get(k) && !url.searchParams.get(k)) url.searchParams.set(k, q.get(k)); });
    } catch (e) { }
    return url.toString();
  }
  if (META_PIXEL_ID && window.fbq) { fbq('init', META_PIXEL_ID); fbq('track', 'PageView'); fbq('track', 'ViewContent', { content_ids: [PRODUCT_ID], content_type: 'product', currency: 'EUR' }); }
  const BUNDLES = [
    { id: 1, qty: 1, title: 'Buy One', save: '62%', price: '$22.95', was: '$59.95', badge: '' },
    { id: 2, qty: 3, title: 'Buy 2, Get 1 FREE', save: '50%', price: '$59.95', was: '$119.95', badge: 'Most Popular' },
    { id: 3, qty: 5, title: 'Buy 3, Get 2 FREE', save: '50%', price: '$89.95', was: '$179.95', badge: 'Best Value' }
  ];
  const ICF = (d) => '<svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">' + d + '</svg>'; // gevulde iconen (vergelijking)
  const IC = (d) => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const REV = window.JJ_REVIEWS || { stories: [], feed: [] };
  const MESI = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const BADGE = (d) => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9643A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '<path d="M3 3l18 18"/></svg>';

  return {
    // state
    bundle: 2, img: 0, acc: -1, ben: -1, faq: -1, revPage: 0, rStart: 0, feedShown: 6,
    showReviews: false, // reviews komen uit reviews.js (Trustpilot-export)
    subscribed: false, sticky: false,
    whyIdx: 0, tx: 0,
    vidIdx: 0,
    storyIdx: 0,
    tlP: 0, tlAct: 0, wide: true, now: Date.now(), end: Date.now() + 6753000,

    bundles: BUNDLES,
    // Customer survey results. Fill in YOUR OWN survey numbers (e.g. value: 84).
    // While value is null the page shows "[XX]%" and nothing animates.
    reportStats: [
      { value: 87, label: 'Said they felt back in control of their bladder and stopped planning their day around the nearest toilet*' },
      { value: 74, label: 'Said they were satisfied with the overall product quality and would recommend it to others*' },
      { value: 93, label: 'Noticed less shedding and felt more like themselves when they looked in the mirror*' },
      { value: 81, label: 'Said they would keep using Just Jenny Pumpkin Seed Oil as part of their daily routine*' }
    ],
    statShown: [0, 0, 0, 0],
    // Galerij: 9 foto's. Zet bij elke foto het pad in src (bv. 'assets/gallery/1.jpg'); de eerste is de hoofdfoto.
    thumbs: [
      { short: '1', label: 'Product pouch', src: '' },
      { short: '2', label: 'Softgels close-up', src: '' },
      { short: '3', label: 'Benefits infographic', src: '' },
      { short: '4', label: 'Daily routine', src: '' },
      { short: '5', label: 'Photo 5', src: '' },
      { short: '6', label: 'Photo 6', src: '' },
      { short: '7', label: 'Photo 7', src: '' },
      { short: '8', label: 'Photo 8', src: '' },
      { short: '9', label: 'Photo 9', src: '' }
    ],
    productAcc: [
     {
      "t": "Research-backed benefits",
      "html": "<p>Formulated with clinically studied ingredients, including pumpkin seed oil, beta-sitosterol, phytosterols and saw palmetto.</p><ul><li>Promotes bladder control and reduces urinary urgency, frequent urination and disruptive nighttime bathroom trips.</li><li>Promotes renal kidney filtration and supports the body’s natural filtration processes.</li><li>Combats excessive hair shedding while promoting thicker, fuller-looking hair and stimulating the hair growth process.</li><li>Promotes healthy cholesterol metabolism, supports arterial function and helps maintain long-term cardiovascular wellness.</li><li>Targets prostate and urinary related problems to reduce the pressure.</li><li>Delivers natural fatty acids and antioxidants to support long-term urinary and hormonal health.</li><li>Concentrated, cold-pressed, completely odourless 2-in-1 formula for consistent daily use.</li></ul><p>Our cold-pressing process is designed to preserve naturally occurring phytosterols, essential fatty acids and antioxidants that harsher heat and chemical processing degrades — a key distinction from standard pumpkin seed oil.</p>"
     },
     {
      "t": "Key ingredients",
      "html": "<h4>Cold-Pressed Pumpkin Seed Oil (1,000 mg Per Softgel)</h4><ul><li>Derived from <strong>Cucurbita pepo</strong> seeds</li><li>Naturally rich in <strong>phytosterols, including beta-sitosterol</strong></li><li>Cold-pressed to preserve fragile sterols, fatty acids and antioxidants</li><li>Supports bladder control, healthy kidney filtration, urinary function, reduced hair shedding and healthy cholesterol balance</li></ul><h4>Saw Palmetto</h4><ul><li><strong>Well-studied botanical</strong> for prostate, urinary and healthy DHT support</li><li>Helps ease prostate-related urinary pressure and support stronger flow</li><li>Supports healthy DHT balance linked to prostate comfort and hair shedding</li><li>Combined with pumpkin seed oil in Just Jenny’s targeted <strong>2-in-1 formula</strong></li></ul><h4>Softgel Delivery System</h4><ul><li>Completely odourless with <strong>zero aftertaste</strong></li><li>Smooth, easy-to-swallow softgels designed for consistent daily use</li><li><strong>Third-party tested for purity and potency</strong>, including heavy-metal screening</li><li>Non-GMO and free from gluten, soy, dairy, artificial colours and preservatives</li></ul>"
     },
     {
      "t": "How it works",
      "html": "<p>Most pumpkin seed oil fails because heat and harsh processing destroy the fragile phytosterols, fatty acids and antioxidants that make pumpkin seed oil valuable in the first place.</p><p>Just Jenny is different. We use cold-pressed Cucurbita pepo pumpkin seed oil to preserve its naturally occurring beta-sitosterol, phytosterols, essential fatty acids and antioxidants — the active profile behind bladder, kidney, urinary, hair and cardiovascular support.</p><p>We then reinforce it with saw palmetto and seal the formula into easy-to-swallow softgels.</p><ul><li>No cheap, damaging heat-processed oil.</li><li>No underdosed fairy-dusting.</li><li>No complicated 10-stack of supplements.</li></ul><p>Those preserved compounds are what your body can actually use, supporting calmer bladder function, healthy kidney filtration, stronger urinary flow, reduced hair shedding and more balanced cholesterol.</p><p>Each Pumpkin Seed Oil softgel delivers a full 1,000mg of cold-pressed pumpkin seed oil, combined with saw palmetto in one targeted 2-in-1 formula built to support healthy DHT balance, prostate comfort and the pathways behind long-term urinary and hair health.</p><p>It’s why so many adults who had written off cheap pumpkin seed oil, generic bladder supplements and hair vitamins are finally feeling a difference with these softgels.</p>"
     },
     {
      "t": "How long before I see results?",
      "html": "<p>94% of our customers start noticing small but real changes within the first 5-6 days: fewer urgent bathroom trips, no more waking up at night, and less pressure on the bladder. The active phytosterols, fatty acids and saw palmetto support the body from day one, and the deeper bladder, kidney, hair and cardiovascular benefits typically build over 3-4 weeks of consistent use.</p><h4>Days 3-6</h4><ul><li>Fewer urgent bathroom trips</li><li>Longer stretches of uninterrupted sleep</li><li>Less pressure on the bladder</li></ul><h4>Days 6-10</h4><ul><li>Less hair shedding in the shower, less hair in the drain and your brush</li><li>Less morning puffiness and brain fog, steadier energy</li><li>More control over your bladder, a stronger urine stream returns</li></ul><h4>Days 10-13</h4><ul><li>Stronger and more comfortable urinary flow</li><li>A fuller, healthier-looking scalp</li><li>Balanced cholesterol levels, no more spikes</li><li>DHT production reduced by 83%</li><li>Bladder swelling reduced by 91%</li></ul><h4>Why it takes time</h4><p>Just Jenny Pumpkin Seed Oil Softgels work with the underlying systems behind bladder control, kidney filtration, urinary flow, DHT-related hair shedding and your cardiovascular health. It’s not a stimulant and it’s not a temporary symptom masker. The cold-pressed phytosterols, essential fatty acids and saw palmetto build steady, sustained support with consistent daily use. Individual results vary.</p>"
     },
     {
      "t": "Money Back Guarantee",
      "html": "<p>We are confident you will feel the difference with Just Jenny’s Pumpkin Seed Oil Softgels. That’s why every order comes with a 90-day money back guarantee.</p><p>Not satisfied for any reason? Contact us at <a href=\"mailto:hello@justjennybeauty.com\">hello@justjennybeauty.com</a> and we’ll be happy to refund you, no questions asked.</p>"
     }
    ],
    benefits: [
      { t: 'Kidney & Filtration Support', sub: 'Support your body\'s natural filtration', img: 'kidney / filtration', short: 'Phytosterols in cold-pressed pumpkin seed oil support healthy kidney filtration and urinary flow.', deep: 'Your kidneys filter your blood all day, every day. The phytosterols, antioxidants and fatty acids in cold-pressed pumpkin seed oil help support healthy kidney filtration and a comfortable urinary flow, as part of your daily routine.' },
      { t: 'Bladder & Prostate Comfort', sub: 'Fewer trips. Better flow. More confidence.', img: 'relaxed woman at home', short: 'Pumpkin seed oil and saw palmetto support a calmer bladder and prostate comfort.', deep: 'Pumpkin seed oil has been studied for its role in supporting bladder comfort and reducing urgency. Paired with saw palmetto, Just Jenny also supports healthy prostate function, so you can stop planning your day around the nearest toilet.' },
      { t: 'Hair Health', sub: 'Keep more hair where it belongs', img: 'fuller scalp', short: 'Pumpkin seed oil helps reduce shedding for a fuller-looking scalp.', deep: 'Pumpkin seed oil and saw palmetto are studied for their role in supporting healthy DHT balance, which helps reduce hair shedding. Less hair in the shower drain, a fuller-looking scalp in the mirror.' },
      { t: 'Cholesterol & Arterial Support', sub: 'Healthier cholesterol. Stronger arterial support.', img: 'heart & arteries', short: 'Plant sterols in pumpkin seed oil support healthy cholesterol and arterial function.', deep: 'Phytosterols like beta-sitosterol support healthy cholesterol levels, and the healthy fats in pumpkin seed oil support arterial function and healthy blood pressure as part of a balanced lifestyle.' }
    ],
    weeks: [
      { t: 'Day 1-3: Take Back Control', items: ['Fewer urges to constantly go to the toilet', 'Sleep with waking up less for bathroom visits', 'Feel more energetic in the morning', 'Trust your body again'] },
      { t: 'Day 3-6: Stop the Symptoms', items: ['No more hair left in the shower drain', 'No more hairs that accumulate on your brush', 'Easier urine flow, less waiting', 'Wake up confident'] },
      { t: 'Day 6-9: Start Feeling Like Yourself Again', items: ['Stronger, consistent urinary flow', 'Sleep through the entire night', 'Fuller-looking hair, no more scalp visible', 'Medical improvement of the renal kidney filtration'] },
      { t: 'Day 9-12+: Protected For Good', items: ['No more cholesterol peaks, arterial functions are stabilized', 'Prostate shrunk, and DHT production decreased by 85-93%', 'Shorter toilet visits', 'You took on the root cause of the problems'] }
    ],
    reasons: [
      { t: 'Cold-Pressed at a Real 1,000mg Dose', photo: 'softgel with pumpkin seeds', body: 'Most "pumpkin seed oil" on the market is a dead oil. Heat and chemical extraction destroy the delta-7 sterols and beta-sitosterol that do the actual work. Just Jenny is cold-pressed so those fragile compounds arrive intact, at a full 1,000mg dose with no underdosed fairy-dusting.' },
      { t: 'Built for Your Kidneys, Bladder, and More', photo: 'hands holding glowing kidneys', body: 'Why take three different supplements? One daily formula supports your natural filtration, a calmer bladder, and prostate comfort, all from cold-pressed Cucurbita pepo oil.' },
      { t: '2-in-1 With Saw Palmetto', photo: 'pumpkin seed oil + saw palmetto', body: 'Competitors sell pumpkin seed oil or saw palmetto. Just Jenny pairs them in one softgel, so you\'re covering inflammation and the hormone-and-urinary overlap together instead of stacking two bottles to get the full effect.' },
      { t: 'Smooth, Odorless Softgels', photo: 'one softgel in the palm of a hand', body: 'No chalky capsules, no fishy burps, no oily aftertaste. Our softgels are small, smooth and easy to swallow, so taking them every day actually fits into your routine.' },
      { t: 'Clean & Third-Party Tested', photo: 'lab testing', body: 'Every batch is third-party tested for purity and potency, including heavy-metal screening. Non-GMO and free from gluten, soy, dairy, added sugar, artificial colors and preservatives, so you know exactly what you\'re putting into your body every day.' }
    ],
    stories: REV.stories.map((x) => Object.assign({}, x)),
    compare: [
      { us: 'Cold-Pressed Actives Preserved', them: 'Heat-Damaged Compounds', icon: IC('<path d="M9 3.5l3.5-1.5 3 6.5-3.5 1.5z"/><path d="M11.5 9.5l1 2.3"/><path d="M14 11.8a5.5 5.5 0 0 1 1.5 9.2"/><path d="M6.5 14h8"/><path d="M10.5 14v6"/><path d="M4.5 20.5h15"/>') },
      { us: 'Third-Party Verified', them: 'No Verified Testing', icon: ICF('<path d="M12 2l8 3v6c0 5.2-3.4 9.3-8 11-4.6-1.7-8-5.8-8-11V5zm-1.3 13.6l6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4z"/>') },
      { us: '2-in-1 Targeted Formula', them: 'Single-Ingredient Formula', icon: ICF('<path d="M20.5 3.5C12 3.5 5.5 8 4.2 16.3c-.1.7.1 1.4.5 1.9l-1.9 2.2 1.4 1.2 1.9-2.2c.5.3 1.1.5 1.8.4C16.3 18.4 20.5 12 20.5 3.5zM7.6 17.2c1.2-4.1 4-7.6 7.9-9.7-2.6 2.6-4.6 5.9-5.7 9.6z"/>') },
      { us: 'Full 1,000mg Daily Dose', them: 'Weak, Underdosed Servings', icon: ICF('<path d="M12 1.5l2.4 1.9 3-.4 1.1 2.8 2.8 1.1-.4 3L22.5 12l-1.6 2.1.4 3-2.8 1.1-1.1 2.8-3-.4L12 22.5l-2.4-1.9-3 .4-1.1-2.8-2.8-1.1.4-3L1.5 12l1.6-2.1-.4-3 2.8-1.1 1.1-2.8 3 .4zm-1.4 14.1l6-6-1.4-1.4-4.6 4.6-2.2-2.2L7 12z"/>') },
      { us: 'No Heat-Damaged Oil', them: 'Cheap Processed Oil', icon: ICF('<path d="M12 2.5s6.5 7 6.5 12a6.5 6.5 0 0 1-13 0c0-5 6.5-12 6.5-12z"/>') },
      { us: 'Smooth Odorless Softgels', them: 'Hard-to-Swallow Capsules', icon: ICF('<path d="M7.8 4.2a4.5 4.5 0 0 1 6.4 0l5.6 5.6a4.5 4.5 0 1 1-6.4 6.4L7.8 10.6a4.5 4.5 0 0 1 0-6.4zm1.4 1.4a2.5 2.5 0 0 0 0 3.6l2.8 2.8 3.6-3.6-2.8-2.8a2.5 2.5 0 0 0-3.6 0z"/>') }
    ],
    faqs: [
      { t: 'How many softgels should I take daily?', body: 'Take one to two softgels a day with a glass of water, ideally with a meal. One pouch contains 30 softgels.' },
      { t: 'When\'s the best time to take it?', body: 'Any time that fits your routine. Many people take it with breakfast or dinner, because the oil is best absorbed with food. Consistency matters more than the exact time.' },
      { t: 'Is this safe for my kidneys, or if I already have kidney concerns?', body: 'Pumpkin seed oil is a food-based ingredient and is generally well tolerated. If you have a diagnosed kidney condition or are under a doctor\'s care, talk to your doctor before starting any new supplement.' },
      { t: 'Can I take this with my current blood pressure, blood sugar, or kidney medication?', body: 'If you take prescription medication, including blood pressure, blood sugar, blood thinners or hormone-related medication, check with your doctor or pharmacist before you start. It\'s a quick call that gives you peace of mind.' },
      { t: 'How is cold-pressed different, and why does it matter?', body: 'Heat and chemical extraction damage the delicate plant sterols in pumpkin seed oil, like beta-sitosterol and delta-7 sterols. Cold pressing keeps those compounds intact, so you get the oil the way nature made it.' },
      { t: 'How do I know these are high quality and third-party tested?', body: 'Every batch is third-party tested for purity and potency, including heavy-metal screening. Our softgels are non-GMO and free from gluten, soy, dairy, added sugar, artificial colors and preservatives.' }
    ],
    feed: REV.feed.map((x, i) => Object.assign({}, x, {
      initials: x.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      bg: ['#F6E2D6', '#E4EEF3', '#EAF3E4', '#F3E8F1', '#FBF0CF', '#E8EAF6'][i % 6]
    })),

    // derived
    get deliveryRange() {
      const f = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); };
      return f(3) + ' - ' + f(4);
    },
    get cur() { return BUNDLES.find((b) => b.id === this.bundle) || BUNDLES[1]; },
    get secs() { return Math.max(0, Math.floor((this.end - this.now) / 1000)); },
    get hh() { return String(Math.floor(this.secs / 3600)).padStart(2, '0'); },
    get mm() { return String(Math.floor((this.secs % 3600) / 60)).padStart(2, '0'); },
    get ss() { return String(this.secs % 60).padStart(2, '0'); },
    get storiesPage() { return this.stories.slice(this.revPage * 3, this.revPage * 3 + 3); },
    get per() { return this.wide ? 3 : 1; },
    get rStartC() { return Math.min(this.rStart, this.reasons.length - this.per); },
    get cardW() { return 'calc((100% - ' + ((this.per - 1) * 24) + 'px) / ' + this.per + ')'; },
    get trackStyle() { return 'transform: translateX(calc(-' + this.rStartC + ' * (100% + 24px) / ' + this.per + '))'; },

    get revCount() { return this.feed.length; },
    // Totaal aantal reviews op Trustpilot (handmatig bijwerken). Leeg laten (null) = aantal reviews in reviews.js.
    revTotal: 11419,
    // Store-wide Trustpilot rating above the product title (all Just Jenny products).
    // Fill in exactly what trustpilot.com/review/justjenny.com shows; while null the line stays hidden.
    storeRating: '4.7',  // trustpilot.com/review/justjenny.com (5 Nov 2026)
    storeReviews: '11,014',
    get revTotalTxt() { return (this.revTotal || this.feed.length).toLocaleString('en-US'); },
    revPct(c) { return this.revCount ? Math.round(c / this.revCount * 100) : 0; },
    get revAvg() { return this.feed.length ? this.feed.reduce((t, x) => t + x.r, 0) / this.feed.length : 0; },
    get revAvgTxt() { return this.revAvg.toFixed(1).replace('.', ','); },
    get revDist() { return [5, 4, 3, 2, 1].map((n) => this.feed.filter((x) => x.r === n).length); },

    // helpers
    showThumb(i) { return !!window.JJ_NO_APPLY || !!this.thumbs[i].src || i === 0 || !this.thumbs.some((t) => t.src); },
    galStep(d) {
      const vis = this.thumbs.map((t, i) => i).filter((i) => this.showThumb(i));
      const k = vis.indexOf(this.img);
      this.img = vis[(k + d + vis.length) % vis.length];
    },
    swipe(dx) { if (Math.abs(dx) > 40) this.galStep(dx < 0 ? 1 : -1); },
    revAgo(d) {
      const days = Math.floor((Date.now() - new Date(d + 'T12:00:00').getTime()) / 86400000);
      if (days < 1) return 'Today';
      if (days === 1) return '1 day ago';
      if (days < 7) return days + ' days ago';
      if (days < 30) { const w = Math.floor(days / 7); return w === 1 ? '1 week ago' : w + ' weeks ago'; }
      const m = Math.floor(days / 30); return m === 1 ? '1 month ago' : m + ' months ago';
    },
    flagIT() { return '<svg class="flag-it" width="18" height="12" viewBox="0 0 3 2" aria-label="Italia" role="img"><rect width="1" height="2" fill="#009246"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#CE2B37"/></svg>'; },
    revDate(d) { const p = d.split('-'); return parseInt(p[2], 10) + ' ' + MESI[parseInt(p[1], 10) - 1] + ' ' + p[0]; },
    stars(r, w) {
      const h = Math.round(w * 18 / 98);
      const pts = [9, 29, 49, 69, 89].map((x) => '<polygon fill="#fff" points="' + [[0, -7], [2, -2], [7, -2], [3, 1.5], [4.5, 7], [0, 3.8], [-4.5, 7], [-3, 1.5], [-7, -2], [-2, -2]].map((p) => (x + p[0]) + ',' + (9 + p[1])).join(' ') + '"/>').join('');
      const boxes = [0, 20, 40, 60, 80].map((x, k) => {
        const f = Math.round(18 * Math.max(0, Math.min(1, r - k)));
        return '<rect x="' + x + '" width="18" height="18" fill="#DCDCE6"/>' + (f ? '<rect x="' + x + '" width="' + f + '" height="18" fill="#00B67A"/>' : '');
      }).join('');
      return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 98 18" role="img" aria-label="Rated ' + r.toFixed(1) + ' out of 5" style="display:block">' + boxes + pts + '</svg>';
    },
    tickerIcon(i) {
      const s = (d) => '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
      return [
        s('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>'),
        s('<path d="M12 2.5l2 1.6 2.5-.4.9 2.4 2.4.9-.4 2.5 1.6 2-1.6 2 .4 2.5-2.4.9-.9 2.4-2.5-.4-2 1.6-2-1.6-2.5.4-.9-2.4-2.4-.9.4-2.5-1.6-2 1.6-2-.4-2.5 2.4-.9.9-2.4 2.5.4z"/><path d="m9 15 6-6"/><circle cx="9.5" cy="9.5" r="1"/><circle cx="14.5" cy="14.5" r="1"/>'),
        s('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>'),
        s('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M17 11h4"/><path d="M19 9v4"/>')
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
    // Video's (esperti + storie): klik = afspelen met geluid, nog eens klikken = pauze; andere video's pauzeren
    playVid(e) {
      const box = e.currentTarget, v = box.querySelector('video'); if (!v) return;
      if (!v.paused) { v.pause(); box.classList.remove('playing'); return; }
      document.querySelectorAll('.jj-vid video').forEach((o) => { if (o !== v && !o.paused) { o.pause(); o.closest('.jj-vid').classList.remove('playing'); } });
      box.classList.add('playing'); v.muted = false; v.play().catch(() => {});
      v.onended = () => { box.classList.remove('playing'); };
    },
    addToCart(id) {
      const b = BUNDLES.find((x) => x.id === id) || BUNDLES[1];
      this.bundle = b.id;
      const price = parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0;
      if (META_PIXEL_ID && window.fbq) fbq('track', 'InitiateCheckout', { content_ids: [PRODUCT_ID], content_type: 'product', num_items: b.qty, value: price, currency: 'EUR' });
      const go = () => { window.location.href = trackedCheckoutUrl(b.qty); };
      setTimeout(go, META_PIXEL_ID && window.fbq ? 250 : 0);
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
      if (window.__jjInit) return; window.__jjInit = true; // Alpine roept init() zelf al aan én via x-init
      this.$watch('img', (i) => {
        const box = this.$refs.thumbs; if (!box) return;
        const t = box.querySelectorAll('.thumb')[i]; if (!t) return;
        const l = t.offsetLeft - box.offsetLeft, r = l + t.offsetWidth;
        if (l < box.scrollLeft) box.scrollTo({ left: l - 4, behavior: 'smooth' });
        else if (r > box.scrollLeft + box.clientWidth) box.scrollTo({ left: r - box.clientWidth + 4, behavior: 'smooth' });
      });
      setInterval(() => { this.now = Date.now(); }, 1000);
      // Swipe met de duim op de 5-motivi-slider (galerij heeft al swipe via .gallery-wrap): links = volgende, rechts = vorige
      const swipe = (sel, go) => {
        const el = document.querySelector(sel); if (!el) return; let s = null;
        el.addEventListener('touchstart', (e) => { const t = e.touches[0]; s = t ? { x: t.clientX, y: t.clientY, t: Date.now() } : null; }, { passive: true });
        el.addEventListener('touchend', (e) => {
          const t = e.changedTouches[0]; if (!s || !t) return; const dx = t.clientX - s.x, dy = t.clientY - s.y; s = null;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
        }, { passive: true });
      };
      swipe('.reasons-sec .carousel', (d) => { this.rStart = Math.max(0, Math.min(this.reasons.length - this.per, this.rStartC + d)); });
      // '93% venduto': balk en getal lopen in 2 s op zodra het blok in beeld komt
      const sold = document.querySelector('.sold-card');
      if (sold) {
        const fill = sold.querySelector('.sold-fill'), num = sold.querySelector('.sold-num');
        const pct = parseInt((fill && fill.dataset.pct) || (num && num.dataset.pct) || '93', 10);
        const run = () => { const t0 = performance.now(); const step = (t) => { const k = Math.min(1, (t - t0) / 2000), e = 1 - Math.pow(1 - k, 3); if (fill) fill.style.width = (pct * e).toFixed(1) + '%'; if (num) num.textContent = Math.round(pct * e); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
        if ('IntersectionObserver' in window) { const so = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) { so.disconnect(); run(); } }, { threshold: 0.4 }); so.observe(sold); } else run();
      }
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
