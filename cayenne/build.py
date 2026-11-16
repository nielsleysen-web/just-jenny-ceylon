# Genereert cayenne/index.html + cayenne/editor/index.html
# Structuur/opbouw naar het aangeleverde voorbeeld; alle teksten en foto's zijn eigen invulplekken (bewerkbaar in /cayenne/editor).
import os, os.path
base = os.path.dirname(os.path.abspath(__file__)) + '/'

def slot(cls, label, extra=''):
    return f'<div class="{cls}"{extra}><span class="slot-label">{label}</span></div>'
def svg(d, cls=''):
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true">{d}</svg>'

I_DROP = svg('<path d="M12 3c3 4 5.500 6.800 5.500 10a5.500 5.500 0 01-11 0C6.500 9.800 9 7 12 3z" fill="currentColor"/>'.replace('.500', '.5'))
I_FLOW = '<path d="M7 3v7a2 2 0 002 2v9M5 3v5M9 3v5M16 3c-2 2-2.500 5-1 8l1 1v9M19 6a2 2 0 110 4 2 2 0 010-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.500', '.5')
I_BOLT = '<path d="M13.500 2L5 13.500h5.500L9.500 22 19 10h-5.800z" fill="currentColor"/>'.replace('.500', '.5')
I_HEART = '<path d="M12 21s-8-5.200-8-11a4.600 4.600 0 018-3 4.600 4.600 0 018 3c0 5.800-8 11-8 11z" fill="currentColor"/><path d="M6.500 12h3l1.500-2.500 2 5 1.500-2.500h3" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.600', '.6').replace('.200', '.2').replace('.500', '.5')
I_SHIELD = '<path d="M12 2.500l8 3v6c0 5-3.400 8.800-8 10-4.600-1.200-8-5-8-10v-6z" fill="currentColor"/><path d="M8.500 12l2.500 2.500 4.500-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.500', '.5').replace('.400', '.4').replace('.800', '.8').replace('.600', '.6').replace('.200', '.2')
I_BOWL = '<path d="M4 13h16a8 8 0 01-16 0z" fill="currentColor"/><circle cx="9" cy="9" r="1.300" fill="currentColor"/><circle cx="15" cy="9" r="1.300" fill="currentColor"/><circle cx="12" cy="5.500" r="1.300" fill="currentColor"/><circle cx="12" cy="10.500" r="1.300" fill="currentColor"/>'.replace('.300', '.3').replace('.500', '.5')
I_CHECK = svg('<path d="M12 2l2.400 1.800 3-.2 1 2.800 2.500 1.600-.900 2.900.900 2.900-2.500 1.600-1 2.800-3-.200L12 22l-2.400-1.800-3 .2-1-2.800L3.100 16l.9-2.900L3.100 10.200 5.600 8.600l1-2.800 3 .2z" fill="currentColor"/><path d="M8.500 12l2.500 2.500 4.500-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.900', '.9').replace('.200', '.2').replace('.500', '.5'))
I_NO = svg('<circle cx="12" cy="12" r="8.500" fill="none" stroke="currentColor" stroke-width="1.800"/><path d="M6.500 17.500l11-11" stroke="currentColor" stroke-width="1.800"/>'.replace('.500', '.5').replace('.800', '.8'))
PLUS = '<span class="pm" aria-hidden="true"></span>'

def acc(q, a):
    return f'<details class="acc"><summary><span class="q">{q}</span>{PLUS}</summary><div class="a"><p>{a}</p></div></details>'

hero_faq = [
    ('What does this formula support?', '[Short answer about what the formula supports. Edit this text.]'),
    ('How many do I take?', '[How many softgels per day and when to take them.]'),
    ('How long before I notice something?', '[What to expect in the first weeks.]'),
    ('Do you offer a guarantee?', '[Explain your money-back guarantee here.]'),
    ('When can I expect delivery?', '[Dispatch and delivery times per country.]'),
]
faqs = [
    ('How is this different from other cayenne supplements?', '[Answer]'),
    ('Which herb does what in this formula?', '[Answer]'),
    ('How do I use this product?', '[Answer]'),
    ('How long until I notice a difference?', '[Answer]'),
    ('Is this product suitable for daily use?', '[Answer]'),
    ('Can I take this with other supplements or medication?', '[Answer — always advise to check with a doctor first.]'),
    ('What does each ingredient actually do?', '[Answer]'),
    ('Is it suitable for long-term daily use?', '[Answer]'),
]
tiles = [(I_FLOW, 'Benefit<br>One'), (I_BOLT, 'Benefit<br>Two'), (I_HEART, 'Benefit<br>Three')]
L = 'fill="none" stroke="#8b8f94" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"'
A = 'fill="#E9B4A6" stroke="#C0563F" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"'
B_ICONS = [
    # bloeddruppel
    '<path d="M12 2.500c3.800 4.700 6.500 8 6.500 11.500a6.500 6.500 0 01-13 0c0-3.500 2.700-6.800 6.500-11.500z" fill="#D9413A" stroke="#A8231F" stroke-width="1.200" stroke-linejoin="round"/><path d="M8.800 14.500a3.300 3.300 0 002.400 3.200" fill="none" stroke="#fff" stroke-width="1.400" stroke-linecap="round" opacity=".85"/>',
    # energieniveau: batterij met volle balkjes
    f'<rect {L} x="1.500" y="6.500" width="18.500" height="11" rx="2.500"/><path {L} d="M22.500 10v4"/><rect x="4" y="9" width="3.600" height="6" rx="1" fill="#D9413A"/><rect x="9" y="9" width="3.600" height="6" rx="1" fill="#D9413A"/><rect x="14" y="9" width="3.600" height="6" rx="1" fill="#E9B4A6"/>',
    # adertje: vertakt bloedvat
    '<path d="M3 20c3-1 5.500-3.500 7-7 1-2.400 1.400-5.500 1-10M10 13c2.500-.500 5-2.200 6.500-5.200M13.300 10.600c2.800 1 5.200.800 7.700-.600M6.500 17c.500 1.600.400 3-.200 4.500" fill="none" stroke="#D9413A" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/>',
    # klein vol rood pepertje
    '<path d="M8.500 7.500c6-.800 11 3.200 12.500 10.500.400 2-1.100 3.200-2.700 2.200C13.500 17 7.500 16.800 5 12.300 3.800 10 5.300 7.900 8.500 7.500z" fill="#D9413A"/><path d="M9.500 8c-1.200-2.300-.400-4.300 2.300-5.200" fill="none" stroke="#3E8E41" stroke-width="2" stroke-linecap="round"/><path d="M6.500 8.600c1.500-1.500 4-1.800 5.500-.800" fill="none" stroke="#3E8E41" stroke-width="1.800" stroke-linecap="round"/>',
]
B_ICONS = [x.replace('.500', '.5').replace('.800', '.8').replace('.600', '.6').replace('.700', '.7').replace('.300', '.3').replace('.200', '.2').replace('.400', '.4').replace('.100', '.1').replace('.900', '.9') for x in B_ICONS]
pills = ['Boost blood flow to numb feet and fingers', 'Prevents diabetic fatigue', 'Calms vessel inflammation', '3,000mg of high-scoville cayenne']
bundles = [
    (1, 'Buy One', '$29.95 per bag', '$29.95', '$59.95', '', None),
    (3, 'Buy 2 Get 1 Free', '$16.65 per bag', '$49.95', '$179.85', 'Most Popular', ('FREE Bamboo Lid Glass Jar ($19.95 Value)', 'Premium softgel storage')),
    (5, 'Buy 3 Get 2 Free', '$17.99 per bag', '$89.95', '$299.75', 'Best Value', ('FREE Bamboo Lid Glass Jar + On-the-Go Softgel Case', 'Both gifts included with this bundle')),
]
circles = ['[Recognisable moment 1 — what the customer feels in the morning.]', '[Recognisable moment 2 — what it feels like during the day.]', '[Recognisable moment 3 — the afternoon dip.]', '[Recognisable moment 4 — how they got used to it.]']
cards = [(I_FLOW, '[Benefit card title 1]', '[One or two sentences on how the main ingredient works.]'), (I_BOLT, '[Benefit card title 2]', '[One or two sentences on the second ingredient.]'),
         (I_SHIELD, '[Benefit card title 3]', '[One or two sentences on the third ingredient.]'), (I_BOWL, '[Benefit card title 4]', '[One or two sentences on absorption.]')]
ingredients = ['Cayenne Pepper', 'Beetroot', 'Hawthorn Berry', 'Turmeric', 'Panax Ginseng', 'Black Pepper', 'Grape Seed Extract']
weeks = [('Days<br>1-3', 'First<br>Step', '[What the customer can expect in the first days.]'), ('Weeks<br>1-2', 'Second<br>Step', '[What the customer can expect after one to two weeks.]'), ('Weeks<br>6-8', 'Your New<br>Baseline', '[What the customer can expect after six to eight weeks.]')]
vs_rows = ['[Key ingredient + dose]', '[Feature 2]', '[Feature 3]', '[Feature 4]', '[Feature 5]', '[Feature 6]']
policies = ['Terms of Service', 'Subscription Policy', 'Refund Policy', 'Privacy Policy', 'Contact Information', 'Legal Notice', 'Shipping Policy']

GIFT_CK = svg('<path d="M4.500 12.500l5 5L20 7" fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.500', '.5').replace('.600', '.6'))
def bundle(q, t, u, p, w, tag, gift):
    on = q == 3
    return (f'<label class="bundle{" sel" if on else ""}" data-qty="{q}">' + (f'<span class="tag">{tag}</span>' if tag else '')
            + f'<input type="radio" name="bundle" value="{q}"{" checked" if on else ""}>'
            + f'<span class="b-main">{slot("ed-pic b-img", "Photo")}<span class="b-txt"><b class="b-t">{t}</b><span class="b-u">{u}</span></span>'
            + f'<span class="b-p"><b class="per">{p}</b><s class="was">{w}</s></span></span>'
            + (f'<span class="b-gift">{GIFT_CK}<span class="b-g"><b>{gift[0]}</b><i>{gift[1]}</i></span></span>' if gift else '') + '</label>')
BUNDLES = ''.join(bundle(*b) for b in bundles)
LOCK = svg('<rect x="5" y="10.500" width="14" height="10" rx="2.200" fill="currentColor"/><path d="M8 10.500V8a4 4 0 018 0v2.500" fill="none" stroke="currentColor" stroke-width="2.200"/><circle cx="12" cy="15" r="1.400" fill="#fff"/>'.replace('.500', '.5').replace('.200', '.2').replace('.400', '.4'))
TRUCK = svg('<path d="M2 6.500h12.500v10H2z" fill="currentColor"/><path d="M14.500 9.500h4l3.500 3.500v3.500h-7.500z" fill="currentColor"/><circle cx="7" cy="17.500" r="2.300" fill="currentColor" stroke="#fff" stroke-width="1.200"/><circle cx="17.500" cy="17.500" r="2.300" fill="currentColor" stroke="#fff" stroke-width="1.200"/><text x="8.200" y="12.800" text-anchor="middle" font-size="3.600" font-weight="800" fill="#fff" font-family="Arial">FREE</text>'.replace('.500', '.5').replace('.300', '.3').replace('.200', '.2').replace('.800', '.8').replace('.600', '.6'))
def gift(level, pic, was, name):
    return f'<div class="gf" data-min="{level}"><div class="gf-pic">{pic}</div><s class="gf-was">{was}</s><b class="gf-name">{name}</b><div class="gf-lock">{LOCK}<span>Locked</span></div></div>'
GIFTS = ('<div class="gifts"><span class="gf-h">Gifts Unlocked</span><div class="gf-row">'
         + gift(1, TRUCK, '$3.95', 'FREE Shipping') + '<i class="gf-plus">+</i>'
         + gift(2, slot('ed-pic gf-img', 'Photo'), '$19.95', 'FREE Bamboo Lid Glass Jar') + '<i class="gf-plus">+</i>'
         + gift(3, slot('ed-pic gf-img', 'Photo'), '$[X.XX]', 'FREE On-the-Go Softgel Case')
         + '</div></div>')
CLOCK = svg('<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 6.500V12l3.500 2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'.replace('.500', '.5'))
BH = '<div class="bh"><p class="bh-t">Big photo per offer (shown when the visitor selects that offer)</p><div class="bh-row">' + ''.join('<div class="bh-c">' + slot('ed-pic bh-img', '', f' data-qty="{q}"') + f'<span class="bh-l">{lbl}</span></div>' for q, lbl in ((1, 'Buy One'), (3, 'Buy 2 Get 1 Free'), (5, 'Buy 3 Get 2 Free'))) + '</div></div>'

html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Just Jenny Cayenne Pepper Softgels</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/cayenne/cayenne.css?v=11">
<!--HEAD-EXTRA-->
</head>
<body>
<div class="bar"><div class="bar-in"><div class="bar-t"><b>Early Black Friday</b><span>Up to 70% off + free product</span></div>
<div class="timer" aria-label="Offer countdown"><div><b id="t-h">01</b><i>HRS</i></div><em>:</em><div><b id="t-m">30</b><i>MIN</i></div><em>:</em><div><b id="t-s">00</b><i>SEC</i></div></div></div></div>

<header class="hdr"><div class="wrap hdr-in">
<span class="hb" aria-hidden="true"><i></i><i></i><i></i></span>
<a class="logo">Just Jenny</a>
<span class="cart" aria-hidden="true">{svg('<path d="M6 8h12l-1 12H7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8V6.500a3 3 0 016 0V8" fill="none" stroke="currentColor" stroke-width="1.6"/>'.replace('.500', '.5'))}<b>1</b></span>
</div></header>

<section class="hero" id="top"><div class="wrap hero-grid">
<div class="h-left">
  <div class="gal">
    {slot('ed-img g-main', 'Main product photo')}
    <div class="g-tiles">{''.join(f'<div class="tile">{svg(i)}<span>{t}</span></div>' for i, t in tiles)}</div>
    <div class="thumbs">{''.join(slot('ed-pic th', f'Photo {n}') for n in range(1, 6))}</div>
  </div>
  <div class="g-nav"><button type="button" class="g-prev" aria-label="Previous photo">{svg('<path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>')}</button><button type="button" class="g-next" aria-label="Next photo">{svg('<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>')}</button></div>
  {BH}
  <div class="h-faq">{''.join(acc(q, a) for q, a in hero_faq)}</div>
</div>
<div class="h-right">
  <div class="rec"><figure class="rec-av">{slot('ed-pic rec-ph', '')}<span class="rec-vf">{svg('<circle cx="12" cy="12" r="11" fill="#2F7BEA"/><path d="M7 12.3l3.300 3.300L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.300', '.3'))}</span></figure><p class="rec-t">Recommended by <b>[Name, title]</b> | [Specialty]</p>{svg('<path d="M12 10.500s-3.200-2-3.200-4.300A1.900 1.900 0 0112 5a1.900 1.900 0 013.200 1.200c0 2.300-3.200 4.300-3.200 4.300z" fill="none" stroke="currentColor" stroke-width="1.200"/><path d="M3 13.500c2 0 3.500 1 4.500 2.500l2.500 1.500c1 .600.500 2-.800 1.700L6 18.500M21 13.500c-2 0-3.500 1-4.500 2.500L14 17.500c-1 .600-.500 2 .800 1.700l3.200-.700M3 12.500v7M21 12.500v7" fill="none" stroke="currentColor" stroke-width="1.200" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.500', '.5').replace('.200', '.2').replace('.300', '.3').replace('.900', '.9').replace('.600', '.6').replace('.800', '.8').replace('.700', '.7'), 'rec-ic')}</div>
  <div class="rate"><span class="stars">★★★★★</span><span class="rate-t">Rated [X.X] · [XXX] reviews</span></div>
  <h1>Just Jenny™ Cayenne Pepper Softgels</h1>
  <p class="lead"><b>[Product name] is designed to [main mechanism],</b> the hidden root cause of [symptom 1], [symptom 2] and [symptom 3].</p>
  <p class="lead">[One sentence on the daily dose and what it supports, from the inside out.]</p>
  <ul class="bens">{''.join(f'<li>{svg(B_ICONS[n])}<span>{p}</span></li>' for n, p in enumerate(pills))}</ul>
  <h2 class="sel">Select Your Supply</h2>
  <div class="bundles">{BUNDLES}</div>
  {GIFTS}
  <p class="dlv">{CLOCK}<span>Order now for delivery by:</span> <b class="dlv-d"></b></p>
  <div class="atc-wrap"><a class="buy-btn" href="#">Add To Cart – <span class="now">$49.95</span></a></div>
  <p class="under"><span>{svg('<path d="M4 12a8 8 0 0114-5.300M20 12a8 8 0 01-14 5.300M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.300', '.3'))}Refills every 28 days</span><em></em><span>{svg('<circle cx="12" cy="12" r="8.500" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.500V12l3 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'.replace('.500', '.5'))}Skip, pause, or cancel anytime</span></p>
  <p class="under g">{svg(I_SHIELD)}30 day money back guarantee</p>
  <div class="rv"><div class="stars">★★★★★</div><p class="rv-t">[Review text from a real customer.]</p><div class="rv-by">{slot('ed-pic rv-av', '')}<span>[Customer name]</span></div></div>
</div>
</div></section>

<section class="red"><div class="wrap">
<h2 class="h-c">[Problem headline — what is going wrong]</h2>
<p class="lead-c">[One sentence that names the symptoms the customer recognises.]</p>
<div class="circles">{''.join(f'<div class="circ">{slot("ed-img c-img", "Photo")}<p>{c}</p></div>' for c in circles)}</div>
<div class="support">
  <div class="s-l"><h2>[Solution headline]</h2><p class="s-sub">[One sentence on the formula and what each ingredient is chosen for.]</p>
  <div class="cards">{''.join(f'<div class="card">{svg(i)}<h3>{t}</h3><p>{p}</p></div>' for i, t, p in cards)}</div></div>
  {slot('ed-img s-img', 'Product photo')}
</div>
</div></section>

<section class="ingr"><div class="wrap">
<h2 class="h-c dark">7 Botanicals. Two Daily Softgels.</h2>
<p class="lead-c dark">[One sentence on dosing and absorption.]</p>
{slot('ed-pic wheel', 'Ingredient wheel image')}
<p class="click"><b>Click</b> to see how each ingredient works ↓</p>
<div class="i-box">{''.join(f'<p class="i-p{" on" if n == 0 else ""}" data-i="{n}">[What {x} does in this formula — one or two sentences.]</p>' for n, x in enumerate(ingredients))}</div>
<div class="i-tabs">{''.join(f'<button type="button" class="i-tab{" on" if n == 0 else ""}" data-i="{n}">{x}</button>' for n, x in enumerate(ingredients))}</div>
</div></section>

<section class="weeks"><div class="wrap">
<h2 class="h-c dark">What To Expect In Your First 8 Weeks</h2>
<p class="lead-c dark">Two softgels a day. Here's how it tends to unfold.</p>
<div class="w-grid">{''.join(f'<div class="wk"><div class="wk-top"><div class="wk-tile"><b>{a}</b><b>{b}</b></div>{slot("ed-img wk-img", "Photo")}</div><p>{c}</p></div>' for a, b, c in weeks)}</div>
</div></section>

<section class="red vs-sec"><div class="wrap">
<h2 class="h-c">So What Makes The Difference?</h2>
<p class="lead-c">[One sentence on how your formula compares to the usual alternatives.]</p>
<div class="vs">
  <div class="vs-head"><span></span><span class="vs-us">{slot('ed-pic vs-img', 'Product')}</span><span class="vs-ot">Others</span></div>
  {''.join(f'<div class="vs-row"><span class="vs-f">{r}</span><span class="vs-us">{I_CHECK}</span><span class="vs-ot">{I_CHECK if n == 0 else I_NO}</span></div>' for n, r in enumerate(vs_rows))}
</div>
<h2 class="h-c stats-h">[Results headline]</h2>
<p class="lead-c">[One sentence on when customers report results.]</p>
<div class="stats">
  <div class="stat"><b>[XX]%</b><p>[What this share of customers reported, and within how many weeks.]*</p><div class="prog"><i style="width:82%"></i></div></div>
  <div class="stat"><b>[XX]%</b><p>[What this share of customers reported, and by which week.]*</p><div class="prog"><i style="width:78%"></i></div></div>
</div>
<p class="foot-n">*[Source of these figures — your own customer survey, with date and number of respondents.]</p>
</div></section>

<section class="faq"><div class="wrap">
<h2 class="h-c dark faq-h">Our 8 Most Common Questions, Answered</h2>
<div class="faq-grid">{''.join(acc(q, a) for q, a in faqs)}</div>
<div class="guar"><div class="gu-l"><p class="gu-k">30 days. No questions.</p><h2>The Just Jenny <span>Guarantee</span></h2><p class="gu-p">[Explain the guarantee in two short sentences.]</p></div>
<div class="gu-seal"><b>30-DAY</b><span>Money Back Guarantee</span></div>{slot('ed-pic gu-img', 'Product photo')}</div>
</div></section>

<footer class="ft"><div class="wrap ft-in">
<div class="ft-l"><a class="logo ft-logo">Just Jenny</a><hr><h3>[Footer headline]</h3><p>Be the first to hear about offers, tips &amp; product drops.</p>
<form class="nl" onsubmit="return false"><input type="email" placeholder="Enter your email..." aria-label="Email"><button type="submit">Submit</button></form><hr></div>
<ul class="ft-links">{''.join(f'<li><a href="#">{p}</a></li>' for p in policies)}</ul>
</div>
<div class="wrap pay"><img src="/sage/assets/payments.png" alt="Accepted payment methods" loading="lazy"></div>
</footer>

<div class="sticky"><a href="#offer">Add To Cart</a></div>
<script src="/cayenne/cayenne.js?v=3" defer></script>
<!--BODY-EXTRA-->
</body>
</html>
'''

CFG = 'window.JJ_NO_ALPINE=true;window.JJ_IMG_SEL=".ed-img,.ed-pic";window.JJ_BG_SEL=".no-bg";window.JJ_CONTENT_URL="/cayenne/content.json";window.JJ_ASSET_BASE="/cayenne/";'
LIVE_HEAD = f'<script>{CFG}</script>\n<script defer src="/apply-content.js?v=sg2"></script>'
ED_HEAD = (f'<script>{CFG}window.JJ_NO_APPLY=true;window.JJ_REPO_PREFIX="cayenne/";window.JJ_LIVE_URL=location.origin+"/cayenne";window.JJ_READY_SEL=".bundle";window.JJ_EDITOR=true;</script>\n'
           '<script defer src="/apply-content.js?v=sg2"></script>\n<link rel="stylesheet" href="/editor/editor.css">\n<script defer src="/editor/editor.js?v=sg2"></script>')
os.makedirs(base + 'editor', exist_ok=True)
os.makedirs(base + 'assets/uploads', exist_ok=True)
open(base + 'index.html', 'w').write(html.replace('<!--HEAD-EXTRA-->', LIVE_HEAD).replace('<!--BODY-EXTRA-->', ''))
open(base + 'editor/index.html', 'w').write(html.replace('<title>Just Jenny Cayenne Pepper Softgels</title>', '<title>Cayenne – Edit &amp; publish</title>').replace('<meta name="robots" content="noindex">', '<meta name="robots" content="noindex,nofollow">').replace('<!--HEAD-EXTRA-->', ED_HEAD).replace('<!--BODY-EXTRA-->', ''))
if not os.path.exists(base + 'content.json'): open(base + 'content.json', 'w').write('{"texts":[],"images":[]}\n')
print('ok')
