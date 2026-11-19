# Genereert cayenne/index.html + cayenne/editor/index.html
# Structuur/opbouw naar het aangeleverde voorbeeld; alle teksten en foto's zijn eigen invulplekken (bewerkbaar in /cayenne/editor).
import os, os.path
base = os.path.dirname(os.path.abspath(__file__)) + '/'

def slot(cls, label, extra=''):
    return f'<div class="{cls}"{extra}><span class="slot-label">{label}</span></div>'
def svg(d, cls=''):
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true">{d}</svg>'

I_DROP = svg('<path d="M12 3c3 4 5.500 6.800 5.500 10a5.500 5.500 0 01-11 0C6.500 9.800 9 7 12 3z" fill="currentColor"/>'.replace('.500', '.5'))
I_DROP_RAW = '<path d="M12 3c3 4 5.5 6.8 5.5 10a5.5 5.5 0 01-11 0C6.5 9.8 9 7 12 3z" fill="currentColor"/>'
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
    ('What does this formula support?', "Blood flow to the feet, legs and fingers, plus steady energy and your body's inflammation response."),
    ('How many do I take?', 'Take 2 softgels daily with a glass of water.'),
    ('How long before I notice something?', 'Warmth in the first few days. Feeling can return to numb extremities around weeks 2-4. Crashes ease by weeks 6-8.'),
    ('Do you offer a guarantee?', "Yes, a 90-day money-back guarantee. If you're not satisfied, email us within 90 days for a full refund."),
    ('When can I expect delivery?', 'Orders ship fast and are usually received within 4–5 business days, based on your location.'),
]
faqs = [
    ('How is this different from other cayenne supplements?', 'Many cayenne capsules are dry powder, with little said about their strength. Just Jenny uses a concentrated liquid cayenne extract (3,000 mg equivalent) in MCT oil, combined with 6 more botanicals chosen for circulation.'),
    ('Which herb does what in this formula?', "For blood flow and warmth: cayenne and beetroot. For heart and arteries: hawthorn and grape seed. For energy: ginseng. Turmeric and black pepper round out the formula, so you don't have to choose."),
    ('How do I use this product?', 'Take 2 softgels daily with a glass of water.'),
    ('How long until I notice a difference?', 'Warmth in the first few days. Feeling can return to numb extremities around weeks 2-4. Crashes ease by weeks 6-8.'),
    ('Is this product suitable for daily use?', 'Yes. Just Jenny Cayenne Pepper Softgels are made for everyday use. Taking them at the same time each day makes it an easy routine.'),
    ('Can I take this with other supplements or medication?', 'The botanicals in this formula are generally well tolerated. If you take prescription medication, especially for diabetes, blood pressure or blood thinning, talk to your doctor before starting any new supplement.'),
    ('What does each ingredient actually do?', 'Cayenne helps open the smallest vessels. Beetroot supplies nitrates your body turns into nitric oxide. Hawthorn supports the heart. Turmeric supports a healthy inflammation response. Panax ginseng supports energy. Black pepper aids absorption. Grape seed extract supports the vessel walls.'),
    ('Is it suitable for long-term daily use?', 'Yes. The formula is designed to be taken every day, month after month.'),
]
tiles = [(I_FLOW, 'Benefit<br>One'), (I_BOLT, 'Benefit<br>Two'), (I_HEART, 'Benefit<br>Three')]
L = 'fill="none" stroke="#8b8f94" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"'
A = 'fill="#E9B4A6" stroke="#C0563F" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"'
STARS5 = ''.join('<i>★</i>' for _ in range(5))
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
    (1, 'Buy One', 'Save 50%', '$29.95', '$59.95', '', None),
    (3, 'Buy 2 Get 1 Free Gift', 'Save 72%', '$49.95', '$179.85', 'Most Popular', ('FREE Bamboo Lid Glass Jar ($19.95 Value)', 'Premium softgel storage')),
    (5, 'Buy 3 Get 2 Free Gifts', 'Save 70%', '$89.95', '$299.75', 'Best Value', [('FREE Bamboo Lid Glass Jar ($19.95 Value)', 'Premium softgel storage'), ('FREE On-the-Go Softgel Case ($11.99 Value)', 'Travel-size softgel carrier')]),
]
C_POS = ['center 62%', 'center 45%', 'center 38%', 'center 30%']
circles = ["You wake up with ice-cold feet that stay numb, no matter the room temperature. Blood isn't flowing there.", "You have that heavy, tiring, dead feeling in your legs that won't change, no matter how much you rest.", "Brain fog rolls in after every meal, and by 2pm you have lost 90% of your energy.", "You stopped being aware of the numbness, because it's been there for such a long time, you start accepting it as the new normal."]
I_VEIN = '<path d="M3 20c3-1 5.5-3.5 7-7 1-2.4 1.4-5.5 1-10M10 13c2.5-.5 5-2.2 6.5-5.200M13.3 10.6c2.8 1 5.2.8 7.700-.6M6.5 17c.5 1.6.4 3-.2 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.200', '.2').replace('.700', '.7')
I_SHIELD_HEART = '<path d="M12 2.5l8 3v6c0 5-3.4 8.8-8 10-4.600-1.2-8-5-8-10v-6z" fill="currentColor"/><path d="M12 16s-3.6-2.300-3.600-4.700a2 2 0 013.600-1.200 2 2 0 013.600 1.200c0 2.400-3.600 4.700-3.600 4.700z" fill="#fff"/>'.replace('.600', '.6').replace('.300', '.3')
cards = [(I_VEIN, 'Opens Your Smallest Vessels', "Cayenne's capsaicin helps open the tiny capillaries in your feet and fingers, where blood barely gets through."),
         (I_BOLT, 'Prevents Diabetic Fatigue', 'Beetroot supplies natural nitrates your body turns into nitric oxide, for steadier energy through the day.'),
         (I_SHIELD_HEART, 'Protects Heart & Arteries', 'Hawthorn berry and grape seed extract support your heart and help keep artery walls flexible.'),
         (I_BOWL, 'Boosts Absorption', 'Black pepper helps your body take up the other botanicals, so less of the formula goes to waste.')]
reviews = [
    ('Steadier Energy, Warmer Hands', "I thought, another wonder supplement, yea right...  but around the two-week mark I noticed that I stopped wearing socks in bed and my hands got their feeling back! And I stopped drinking cups of coffee to survive my crash after 2pm. It's easy to use, I simply take 2 each morning with my coffee.", 'Rob G.', 'Nov 11, 2026'),
    ('No burning feeling!', "I just felt a slight warmth going down my throat, but no spicy taste or reflux. It's like getting the benefits from eating actual peppers, but the softgel keeps the ingredients off your taste buds.", 'Amanda S.', 'Nov 14, 2026'),
    ('I Can Finally Sleep Without Wearing Socks!!', "I used to sleep with socks because my feet became so cold during the night. But over the last few weeks I stopped wearing them in bed!! My feet and also my hands feel a lot warmer, my husband doesn't say they feel like a fridge anymore. I feel like they also have more feeling compared to a month ago... It's hard to explain but it feels like I finally got something back I felt like I lost. Love that it's without any chemicals or additives.", 'Ruby F.', 'Nov 1, 2026'),
]
rb_cards = [('Boost blood flow', 'Restores the blood flow in the veins', 'Cayenne Pepper is studied for supporting healthy glucose metabolism. Just Jenny uses a concentrated 12:1 extract with MCT oil to help your body actually absorb and use it.'), ('Nerve Health Support', 'Returns the feeling in the hands & feet', 'The Cayenne Pepper softgels are designed to reopen your smallest blood vessels, so oxygen-rich blood can flow back to your nerves.'), ('Gentle on the Stomach', 'No burning feeling or reflux', 'Just Jenny uses a liquid cayenne pepper extract suspended in MCT oil. No harsh powder. No stomach irritation. No burps hours later, no burning feeling.'), ('Enhanced Absorption', 'Easily absorbed by the stomach lining', 'Cayenne Pepper compounds are fat soluble. MCT oil acts as a carrier, helping the 3,000 mg equivalent Cayenne Pepper extract absorb efficiently instead of passing through unused.')]
CMP_CK = '<span class="ck"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>'
CMP_NO = '<span class="no"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></span>'
ING_TX = {
    'Cayenne Pepper': "Capsaicin from high-Scoville cayenne helps blood get through to the small capillaries in your feet and fingers.",
    'Beetroot': "A natural source of nitrates, which your body turns into nitric oxide to help vessels relax and carry oxygen further.",
    'Hawthorn Berry': "Traditionally used for the heart, and included here to support flexible arteries.",
    'Turmeric': "Supports your body's response to the vessel inflammation that often comes with high blood sugar.",
    'Panax Ginseng': "Included for steadier energy, to take the edge off the afternoon crash.",
    'Black Pepper': "Piperine helps your body absorb the other botanicals, so more of the formula is put to use.",
    'Grape Seed Extract': "Rich in antioxidants that help protect vessel walls from oxidative stress.",
}
ingredients = ['Cayenne Pepper', 'Beetroot', 'Hawthorn Berry', 'Turmeric', 'Panax Ginseng', 'Black Pepper', 'Grape Seed Extract']
TL_PHOTOS = {1: 'timeline-1.webp', 2: 'timeline-2.webp', 3: 'timeline-3.webp'}
TL_POS = {1: 'center 62%', 2: 'center 33%', 3: '50% 30%'}
weeks = [('Days 1–3', 'First Warmth', 'Capsaicin gets to work from the first softgels. You start to notice warmth in your hands and feet.'), ('Weeks 1–2', 'Feeling Comes Back', 'A light tingling means blood is reaching your toes again. The numb spots begin to ease.'), ('Weeks 6–8', 'Your New Baseline', 'Steadier energy, warm feet, lighter legs and a clearer head. Two softgels a day has become routine.')]
vs_rows = ['3,000mg High-Scoville Cayenne', 'Reaches Capillaries', 'Black Pepper For Better Absorption', 'Supports Heart and Arteries', 'Manages Arterial Calcium', 'Active Ingredients']
POLICY_URL = {'Terms of Service': 'https://www.getjustjenny.com/pages/terms-of-service', 'Refund Policy': 'https://www.getjustjenny.com/pages/refund-policy', 'Privacy Policy': 'https://www.getjustjenny.com/pages/privacy-policy', 'Contact Information': 'https://www.getjustjenny.com/pages/contact'}
policies = ['Terms of Service', 'Subscription Policy', 'Refund Policy', 'Privacy Policy', 'Contact Information', 'Legal Notice', 'Shipping Policy']

GIFT_CK = svg('<path d="M4.500 12.500l5 5L20 7" fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.500', '.5').replace('.600', '.6'))
B_PHOTOS = {1: 'pouch.webp', 3: 'bundle-2-jar.webp', 5: 'bundle-3-gifts.webp'}
def bundle(q, t, u, p, w, tag, gift):
    on = q == 3
    return (f'<label class="bundle{" sel" if on else ""}" data-qty="{q}">' + (f'<span class="tag">{tag}</span>' if tag else '')
            + f'<input type="radio" name="bundle" value="{q}"{" checked" if on else ""}>'
            + f'<span class="b-main">{slot("ed-pic b-img" + (" has-img" if q in B_PHOTOS else ""), "Photo", (f' style="background-image:url(/cayenne/assets/{B_PHOTOS[q]})"' if q in B_PHOTOS else ""))}<span class="b-txt"><b class="b-t">{t}</b><span class="b-u">{u}</span></span>'
            + f'<span class="b-p"><b class="per">{p}</b><s class="was">{w}</s></span></span>'
            + ''.join(f'<span class="b-gift">{GIFT_CK}<span class="b-g"><b>{g[0]}</b><i>{g[1]}</i></span></span>' for g in ([gift] if isinstance(gift, tuple) else gift or [])) + '</label>')
BUNDLES = ''.join(bundle(*b) for b in bundles)
LOCK = svg('<rect x="5" y="10.500" width="14" height="10" rx="2.200" fill="currentColor"/><path d="M8 10.500V8a4 4 0 018 0v2.500" fill="none" stroke="currentColor" stroke-width="2.200"/><circle cx="12" cy="15" r="1.400" fill="#fff"/>'.replace('.500', '.5').replace('.200', '.2').replace('.400', '.4'))
TRUCK = svg('<path d="M2 6.500h12.500v10H2z" fill="currentColor"/><path d="M14.500 9.500h4l3.500 3.500v3.500h-7.500z" fill="currentColor"/><circle cx="7" cy="17.500" r="2.300" fill="currentColor" stroke="#fff" stroke-width="1.200"/><circle cx="17.500" cy="17.500" r="2.300" fill="currentColor" stroke="#fff" stroke-width="1.200"/><text x="8.200" y="12.800" text-anchor="middle" font-size="3.600" font-weight="800" fill="#fff" font-family="Arial">FREE</text>'.replace('.500', '.5').replace('.300', '.3').replace('.200', '.2').replace('.800', '.8').replace('.600', '.6'))
def gift(level, pic, was, name):
    return f'<div class="gf" data-min="{level}"><div class="gf-pic">{pic}</div><s class="gf-was">{was}</s><b class="gf-name">{name}</b><div class="gf-lock">{LOCK}<span>Locked</span></div></div>'
GIFTS = ('<div class="gifts"><span class="gf-h">Early Black Friday Gifts Unlocked 🎁</span><div class="gf-row">'
         + gift(1, TRUCK, '$3.95', 'FREE Shipping') + '<i class="gf-plus">+</i>'
         + gift(2, slot('ed-pic gf-img has-img', 'Photo', ' style="background-image:url(/cayenne/assets/jar.webp)"'), '$19.95', 'FREE Bamboo Lid Glass Jar') + '<i class="gf-plus">+</i>'
         + gift(3, slot('ed-pic gf-img has-img', 'Photo', ' style="background-image:url(/cayenne/assets/softgel-case.webp)"'), '$11.99', 'FREE On-the-Go Softgel Case')
         + '</div></div>')
CLOCK = svg('<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 6.500V12l3.500 2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'.replace('.500', '.5'))
TH_PHOTOS = {1: 'gallery-packaging.webp', 2: 'gallery-madefor.webp', 3: 'gallery-benefits.webp', 4: 'gallery-review.webp', 5: 'gallery-vs.webp'}
BH_PHOTOS = {}
BH = '<div class="bh"><p class="bh-t">Big photo per offer (shown when the visitor selects that offer)</p><div class="bh-row">' + ''.join('<div class="bh-c">' + slot('ed-pic bh-img' + (' has-img' if q in BH_PHOTOS else ''), '', f' data-qty="{q}"' + (f' style="background-image:url(/cayenne/assets/{BH_PHOTOS[q]})"' if q in BH_PHOTOS else '')) + f'<span class="bh-l">{lbl}</span></div>' for q, lbl in ((1, 'Buy One'), (3, 'Buy 2 Get 1 Free'), (5, 'Buy 3 Get 2 Free'))) + '</div></div>'

html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Just Jenny Cayenne Pepper Softgels</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/cayenne/cayenne.css?v=97">
<!--HEAD-EXTRA-->
</head>
<body>
<div class="bar"><div class="bar-in"><div class="bar-t"><b>Early Black Friday</b><span>Up to 70% off + free gifts 🎁</span></div>
<div class="timer" aria-label="Offer countdown"><div><b id="t-h">01</b><i>HRS</i></div><em>:</em><div><b id="t-m">30</b><i>MIN</i></div><em>:</em><div><b id="t-s">00</b><i>SEC</i></div></div></div></div>

<section class="hero" id="top"><div class="wrap hero-grid">
<div class="h-left">
  <div class="gal">
    {slot('ed-img g-main has-img', 'Main product photo', ' style="background-image:url(/cayenne/assets/gallery-product-2.webp)"')}
    <div class="g-tiles">{''.join(f'<div class="tile">{svg(i)}<span>{t}</span></div>' for i, t in tiles)}</div>
    <div class="thumbs">{''.join(slot('ed-pic th' + (' has-img' if n in TH_PHOTOS else ''), f'Photo {n}', (f' style="background-image:url(/cayenne/assets/{TH_PHOTOS[n]})"' if n in TH_PHOTOS else '')) for n in range(1, 6))}</div>
  </div>
  <div class="g-nav"><button type="button" class="g-prev" aria-label="Previous photo">{svg('<path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>')}</button><button type="button" class="g-next" aria-label="Next photo">{svg('<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>')}</button></div>
  {BH}
  <div class="h-faq">{''.join(acc(q, a) for q, a in hero_faq)}</div>
</div>
<div class="h-right">
  <div class="rec"><figure class="rec-av">{slot('ed-pic rec-ph', '')}<span class="rec-vf">{svg('<circle cx="12" cy="12" r="11" fill="#2F7BEA"/><path d="M7 12.3l3.300 3.300L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'.replace('.300', '.3'))}</span></figure><p class="rec-t">Approved by <b>Dr. Wasim Hanif</b> | Certified Diabetologist</p>{svg('<g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13.4s-4.4-2.8-4.4-5.900a2.500 2.500 0 014.4-1.600 2.500 2.500 0 014.4 1.600c0 3.100-4.400 5.900-4.400 5.900z"/><path d="M12 7.300v3M10.500 8.800h3"/><path d="M2.800 11.800v4.400l3.400 3.400h3.400v-2.300c0-1-.6-1.900-1.500-2.300l-2.700-1.300"/><path d="M21.200 11.800v4.400l-3.400 3.400h-3.400v-2.300c0-1 .6-1.900 1.500-2.300l2.700-1.300"/><path d="M6.400 19.600v2.200h3v-2.200M14.600 19.600v2.200h3v-2.200"/></g>'.replace('.900', '.9').replace('.500', '.5').replace('.600', '.6').replace('.100', '.1').replace('.400', '.4').replace('.300', '.3'), 'rec-ic')}</div>
  <a class="rate tp"><b class="tp-w">Excellent</b><span class="tp-stars" aria-label="5 out of 5">{''.join('<i>★</i>' for _ in range(5))}</span><span class="tp-n">928 reviews on</span><span class="tp-b"><svg class="tp-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="#00B67A" d="M12 1.5l2.9 7.6 8.1.4-6.3 5.1 2.1 7.9L12 18l-6.8 4.5 2.1-7.9L1 9.5l8.1-.4z"/></svg>Trustpilot</span></a>
  <h1>Just Jenny™ Cayenne Pepper Softgels</h1>
  <p class="lead"><b>Just Jenny Cayenne Pepper Softgels are designed to reopen your smallest blood vessels,</b> so oxygen-rich blood can flow back to your nerves.</p>
  <ul class="bens bens-ck">{''.join(f'<li><svg class="ck" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5l5 5L19.5 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>{p}</span></li>' for p in pills)}</ul>
  <h2 class="sel">Early Black Friday Sale Live</h2>
  <div class="bundles">{BUNDLES}</div>
  {GIFTS}
  <p class="ship"><i></i><span>Order by 11:59 pm for <b>same-day shipping</b></span></p>
  <div class="atc-wrap"><a class="buy-btn" href="#"><span class="bb-1">Add To Cart <i>·</i> <span class="now">$49.95</span> <s class="bb-was">$179.85</s></span><span class="bb-2">{svg(I_SHIELD)}<span>90 Day Money-Back Guarantee</span></span></a></div>
  <ul class="pms" aria-label="Accepted payment methods"><li class="pc pc-amex"><img src="/cayenne/assets/pay/amex.svg" alt="American Express" loading="lazy"></li><li class="pc pc-applepay"><img src="/cayenne/assets/pay/applepay.svg" alt="Apple Pay" loading="lazy"></li><li class="pc pc-googlepay"><img src="/cayenne/assets/pay/googlepay.svg" alt="Google Pay" loading="lazy"></li><li class="pc pc-diners"><img src="/cayenne/assets/pay/diners.svg" alt="Diners Club" loading="lazy"></li><li class="pc pc-discover"><img src="/cayenne/assets/pay/discover.svg" alt="Discover" loading="lazy"></li><li class="pc pc-mastercard"><img src="/cayenne/assets/pay/mastercard.svg" alt="Mastercard" loading="lazy"></li><li class="pc pc-paypal"><img src="/cayenne/assets/pay/paypal.svg" alt="PayPal" loading="lazy"></li><li class="pc pc-visa"><img src="/cayenne/assets/pay/visa.svg" alt="Visa" loading="lazy"></li></ul>
  <div class="rv"><div class="rv-top"><span class="tp-stars">{STARS5}</span><span class="rv-on">Review on <b>Trustpilot</b></span></div><p class="rv-t">"I thought that nerve damage couldn't be reversed, but these capsules actually removed the tingling feeling in my feet, and made them feel warm again. It doesn't burn, taste spicy or gives me stomach issues. Been using for 2 months now and I can finally sleep without having to wear socks to bed."</p><div class="rv-by">{slot('ed-pic rv-av has-img', '', ' style="background-image:url(/cayenne/assets/review-adam.webp)"')}<span>Adam F.</span><span class="rv-date">Nov 16, 2026</span></div></div>
</div>
</div></section>

<section class="prob"><div class="wrap">
<h2 class="h-c">Diabetes Is Shutting Down Your Circulation</h2>
<p class="lead-c">Cold feet, numb hands, and constant fatigue aren't just part of having diabetes.</p>
<div class="circles">{''.join(f'<div class="circ">{slot("ed-img c-img has-img", "Photo", f' style="background-image:url(/cayenne/assets/problem-{n}.webp);background-position:{C_POS[n - 1]}"')}<span class="c-n">{n}</span><p>{c}</p></div>' for n, c in enumerate(circles, 1))}</div>
</div></section>

<section class="red"><div class="wrap">
<div class="support">
  <div class="s-l"><h2>Support Circulation</h2><p class="s-sub">7 botanicals, each chosen for what it does inside your vessels.</p>
  <div class="cards">{''.join(f'<div class="card">{svg(i)}<h3>{t}</h3><p>{p}</p></div>' for i, t, p in cards)}</div></div>
  {slot('ed-img s-img has-img', 'Product photo', ' style="background-image:url(/cayenne/assets/support.webp)"')}
  <div class="cd-dots">{'<i></i>' * len(cards)}</div>
</div>
</div></section>

<section class="ingr"><div class="wrap">
<h2 class="h-c dark">7 Botanicals. Two Daily Softgels.</h2>
<p class="lead-c dark">Every dose calculated for maximum effect and absorption.</p>
<div class="ig-grid">
  <div class="ig-list">{''.join(f'<button type="button" class="ig-tab{" on" if n == 0 else ""}" data-i="{n}"><em>0{n + 1}</em><b>{x}</b><u></u></button>' for n, x in enumerate(ingredients))}</div>
  <div class="ig-panel">{''.join(f'<div class="ig-slide{" on" if n == 0 else ""}" data-i="{n}">{slot("ed-img ig-img has-img", "Photo — " + x, f' style="background-image:url(/cayenne/assets/ingredient-{n + 1}.webp)"')}<div class="ig-tx"><h3>{x}</h3><p>{ING_TX[x]}</p></div></div>' for n, x in enumerate(ingredients))}</div>
</div>
</div></section>

<section class="sp"><div class="wrap">
<div class="sp-tp"><b class="tp-w">Excellent</b><span class="tp-stars">{''.join('<i>★</i>' for _ in range(5))}</span><span class="tp-n">928 reviews on</span><span class="tp-b"><svg class="tp-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="#00B67A" d="M12 1.5l2.9 7.6 8.1.4-6.3 5.1 2.1 7.9L12 18l-6.8 4.5 2.1-7.9L1 9.5l8.1-.4z"/></svg>Trustpilot</span></div>
<h2 class="sp-h">Verified customer reviews</h2>
<p class="sp-sub">See what our customers are saying about Just Jenny</p>
<p class="sp-note">Individual results vary.</p>
</div>
<div class="sp-strip"><div class="sp-track">{''.join(slot('ed-img sp-ph', f'Customer photo {n}') for n in range(1, 9))}</div></div>
<div class="wrap"><div class="sp-cards">{''.join(f'<div class="sp-card"><div class="sp-r"><span class="tp-stars">{STARS5}</span></div><h3>{h}</h3><p class="sp-t">"{t}"</p><p class="sp-n">{n}</p><p class="sp-d">{d} · Cayenne Pepper Softgels</p><p class="sp-src">Review on <b>Trustpilot</b></p></div>' for h, t, n, d in reviews)}</div><div class="cd-dots sp-dots">{'<i></i>' * len(reviews)}</div></div>
</section>

<section class="weeks"><div class="wrap">
<h2 class="h-c dark">What To Expect In Your First 8 Weeks</h2>
<p class="lead-c dark">Two softgels a day. Here's how it tends to unfold.</p>
<div class="tl"><div class="tl-line"><div class="tl-fill"></div></div>{''.join(f'<div class="tl-step"><div class="tl-dot">{n}</div><div class="tl-card">{slot("ed-img tl-img" + (" has-img" if n in TL_PHOTOS else ""), "Photo", (f' style="background-image:url(/cayenne/assets/{TL_PHOTOS[n]});background-position:{TL_POS.get(n, "center")}"' if n in TL_PHOTOS else ""))}<div class="tl-txt"><div class="tl-when">{w}</div><h3>{t}</h3><p>{c}</p></div></div></div>' for n, (w, t, c) in enumerate(weeks, 1))}</div>
</div></section>

<section class="rb"><div class="wrap">
<h2 class="rb-h">Real Benefits.</h2>
<p class="rb-sub">7 botanicals. Two daily softgels.</p>
<div class="rb-grid">{''.join(f'<details class="rb-card"><summary>{slot("ed-img rb-img has-img", "Photo", f' style="background-image:url(/cayenne/assets/benefit-{ {1: '1b', 3: '3b'}.get(n, n) }.webp)"')}<span class="rb-tx"><b>{h}</b><span>{t}</span></span><span class="rb-plus" aria-hidden="true"></span></summary><div class="rb-more"><p>{m}</p></div></details>' for n, (h, t, m) in enumerate(rb_cards, 1))}</div>
</div>
<div class="rb-tick"><div class="rb-track">{''.join(f'<span class="rb-it">{svg(i)}<span>{t}</span></span>' for i, t in ((I_DROP_RAW, 'Boosts blood flow'), (I_BOLT, 'Prevents diabetic fatigue'), (I_VEIN, 'Calms vessel inflammation'), (I_HEART, 'Protects Heart & Arteries')))}</div></div>
</section>

<section class="cmp-sec vs-sec"><div class="wrap">
<h2 class="h-c">So What Makes The Difference?</h2>
<p class="lead-c">Not all cayenne supplements are made the same. Here's how Just Jenny compares.</p>
<div class="cmp"><div class="cmp-col"></div>
  <div class="cmp-row cmp-head"><span></span><span class="cmp-us"><span>{slot('ed-pic vs-img cmp-img has-img', 'Photo', ' style="background-image:url(/cayenne/assets/pouch.webp)"')}<b>Just Jenny</b></span></span><span class="cmp-ot"><span><span class="cmp-gen cmp-gen-ph"></span><b>Competitors</b></span></span></div>
  <div class="cmp-body">{''.join(f'<div class="cmp-row"><span>{r}</span><span class="cmp-us">{CMP_CK.replace("<span class=", "<span style=" + chr(34) + "transition-delay:" + str(n * 90) + "ms" + chr(34) + " class=")}</span><span>{CMP_CK if n == 0 else CMP_NO}</span></div>' for n, r in enumerate(vs_rows))}</div>
</div>
</div></section>

<section class="offer2" id="offer2"><div class="wrap">
<h2 class="o2-h"><span>Stock up.</span> Save more.</h2>
<p class="o2-sub">Pick the bundle that fits you best.</p>
<div class="o2-box">
  <div class="o2-price"><b class="o2-now">$49.95</b><s class="o2-was">$179.85</s><span class="o2-save">Save $129.90</span></div>
  <div class="o2-cards"></div>
  <div class="o2-body"><p class="o2-note">The offer from the top of the page is repeated here automatically (bundles, gifts, shipping line and button).</p></div>
</div>
</div></section>

<section class="faq"><div class="wrap">
<h2 class="h-c dark faq-h">Our 8 Most Common Questions, Answered</h2>
<div class="faq-grid">{''.join(acc(q, a) for q, a in faqs)}</div>
</div></section>

<section class="gar"><div class="gar-in">
  <div class="gar-l"><p class="gar-k">90 days. No questions.</p><h2>The Just Jenny <span>Guarantee</span></h2><p class="gar-p">Try it for 90 days. If you're not satisfied, email us for a full refund.</p></div>
  <div class="gar-r">{slot('ed-img gar-img has-img', 'Photo — person holding the pouch', ' style="background-image:url(/cayenne/assets/guarantee.webp?v=2)"')}<div class="gu-seal"><b>90-DAY</b><span>Money Back Guarantee</span></div></div>
</div></section>

<footer class="ft"><div class="wrap ft-in">
<ul class="ft-links">{''.join((f'<li><a href="{POLICY_URL[p]}" target="_blank" rel="noopener">{p}</a></li>' if p in POLICY_URL else '') for p in policies)}</ul>
</div>
<div class="wrap pay"><img src="/sage/assets/payments.png" alt="Accepted payment methods" loading="lazy"></div>
</footer>
<div class="satc" id="satc"><div class="satc-in"><p class="satc-note"><span class="satc-dot"></span><b>Order by 11:59 pm</b> for same-day shipping</p><a class="buy-btn satc-btn" href="#"><span class="bb-1">Add To Cart <i>·</i> <span class="now">$49.95</span> <s class="bb-was">$179.85</s></span></a></div></div>

<div class="sticky"><a href="#offer">Add To Cart</a></div>
<script src="/cayenne/cayenne.js?v=25" defer></script>
<!--BODY-EXTRA-->
</body>
</html>
'''

CFG = 'window.JJ_NO_ALPINE=true;window.JJ_IMG_SEL=".ed-img,.ed-pic";window.JJ_BG_SEL=".no-bg";window.JJ_CONTENT_URL="/cayenne/content.json";window.JJ_ASSET_BASE="/cayenne/";'
LIVE_HEAD = f'<script>{CFG}</script>\n<script defer src="/apply-content.js?v=sg2"></script>'
ED_HEAD = (f'<script>{CFG}window.JJ_NO_APPLY=true;window.JJ_REPO_PREFIX="cayenne/";window.JJ_LIVE_URL=location.origin+"/cayenne";window.JJ_READY_SEL=".bundle";window.JJ_EDITOR=true;</script>\n'
           '<script defer src="/apply-content.js?v=sg2"></script>\n<link rel="stylesheet" href="/editor/editor.css">\n<script defer src="/editor/editor.js?v=sg4"></script>')
TRACK_HEAD = """<!-- Meta Pixel (init + events in cayenne.js) -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
</script>
<!-- JJB Track: bewaart fbclid/ad_id/utm's en geeft ze door aan de checkout (zelfde script als de andere funnels) -->
<script src="https://jjb-profit-dashboard.vercel.app/jjb-track.js" async></script>
<!-- Microsoft Clarity -->
<script type="text/javascript">
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "ukbt3fboo0");
</script>
"""
os.makedirs(base + 'editor', exist_ok=True)
os.makedirs(base + 'assets/uploads', exist_ok=True)
open(base + 'index.html', 'w').write(html.replace('<!--HEAD-EXTRA-->', LIVE_HEAD + '\n' + TRACK_HEAD).replace('<!--BODY-EXTRA-->', ''))
open(base + 'editor/index.html', 'w').write(html.replace('<title>Just Jenny Cayenne Pepper Softgels</title>', '<title>Cayenne – Edit &amp; publish</title>').replace('<meta name="robots" content="noindex">', '<meta name="robots" content="noindex,nofollow">').replace('<!--HEAD-EXTRA-->', ED_HEAD).replace('<!--BODY-EXTRA-->', ''))
if not os.path.exists(base + 'content.json'): open(base + 'content.json', 'w').write('{"texts":[],"images":[]}\n')

# Tweede versie: algemene/brede pagina (/cayenne/general) — zelfde opbouw, eigen teksten en foto's via de eigen editor (/cayenne/general/editor)
import json as _json
G = base + 'general/'
os.makedirs(G + 'editor', exist_ok=True)
os.makedirs(G + 'assets/uploads', exist_ok=True)
if not os.path.exists(G + 'content.json'):
    # start = de huidige pagina: teksten en foto's overnemen (foto's met een absoluut pad naar /cayenne/)
    c = _json.load(open(base + 'content.json'))
    for im in c.get('images', []):
        if not str(im.get('src', '')).startswith(('/', 'http', 'data:')): im['src'] = '/cayenne/' + im['src']
    open(G + 'content.json', 'w').write(_json.dumps(c, ensure_ascii=False, indent=2) + '\n')
# /general: zonder de voordelen-foto (gallery-benefits) in de hero-galerij (18 nov 2026)
GTHUMB = '<div class="ed-pic th has-img" style="background-image:url(/cayenne/assets/gallery-benefits.webp)"><span class="slot-label">Photo 3</span></div>'
assert GTHUMB in html
ghtml = html.replace(GTHUMB, '')
# /general: grotere headline (lange titel mag over 2 lijnen)
ghtml = ghtml.replace('</head>', '<style>.hero h1{font-size:37px!important;white-space:normal!important;line-height:1.05}@media(max-width:640px){.hero h1{font-size:29px!important}}</style>\n</head>', 1)
GCFG = CFG.replace('"/cayenne/content.json"', '"/cayenne/general/content.json"').replace('JJ_ASSET_BASE="/cayenne/"', 'JJ_ASSET_BASE="/cayenne/general/"')
G_LIVE = LIVE_HEAD.replace(CFG, GCFG)
G_ED = ED_HEAD.replace(CFG, GCFG).replace('JJ_REPO_PREFIX="cayenne/"', 'JJ_REPO_PREFIX="cayenne/general/"').replace('location.origin+"/cayenne"', 'location.origin+"/cayenne/general"')
assert GCFG != CFG and G_ED != ED_HEAD
open(G + 'index.html', 'w').write(ghtml.replace('<!--HEAD-EXTRA-->', G_LIVE + '\n' + TRACK_HEAD).replace('<!--BODY-EXTRA-->', ''))
open(G + 'editor/index.html', 'w').write(ghtml.replace('<title>Just Jenny Cayenne Pepper Softgels</title>', '<title>Cayenne (general) – Edit &amp; publish</title>').replace('<meta name="robots" content="noindex">', '<meta name="robots" content="noindex,nofollow">').replace('<!--HEAD-EXTRA-->', G_ED).replace('<!--BODY-EXTRA-->', ''))
print('ok')
