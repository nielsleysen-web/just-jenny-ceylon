# Genereert cayenne/listicle/index.html + editor/index.html (listicle voor de cayenne-launch; knoppen → salespagina)
# Structuur naar het aangeleverde voorbeeld; eigen teksten. Foto's zijn invulplekken (bewerkbaar in /cayenne/listicle/editor).
import os, os.path, re
base = os.path.dirname(os.path.abspath(__file__)) + '/'
A = '/cayenne/assets/'
CTA = 'Check Availability'

def pic(cls, img, label, pos='center'):
    st = f' style="background-image:url({A}{img});background-position:{pos}"' if img else ''
    return f'<div class="ed-pic {cls}{" has-img" if img else ""}"{st}><span class="slot-label">{label}</span></div>'

YES = '<span class="t-y">✅ Yes</span>'; NO = '<span class="t-n">❌ No</span>'; MAY = '<span class="t-m">⚠️ Sometimes</span>'
table = [
    ('Warms cold hands & feet', YES, '<span class="t-m">⚠️ While worn</span>', MAY),
    ('Reaches the smallest blood vessels', YES, NO, MAY),
    ('Gentle on the stomach', YES, YES, '<span class="t-n">❌ Often burns</span>'),
    ('Supports feeling in the feet', YES, NO, MAY),
    ('Results', '<b>Build up over weeks</b>', 'Gone when you take them off', 'Hard to tell'),
]

items = [
  ('Reaches the smallest blood vessels in your feet and hands.', 'benefit-1.webp', 'center', '🩸 Circulation Down To Your Toes.',
   ['High blood sugar is hard on your smallest blood vessels. Over the years they get narrower and stiffer, and the first places to notice are the ones furthest from your heart: <b>your toes and your fingertips.</b>',
    '<b>Capsaicin from high-Scoville cayenne</b> helps blood get through to those tiny capillaries again.',
    'Just Jenny packs a 3,000 mg equivalent of cayenne extract into two softgels a day, together with beetroot, a natural source of nitrates your body turns into nitric oxide.']),
  ('Warm feet in bed again. No more sleeping in socks.', 'timeline-2.webp', 'center 40%', '🔥 Warmth Comes Back.',
   ['Ice-cold feet that stay cold no matter how many blankets you pile on…',
    'That isn\'t the temperature in your bedroom. <b>That\'s blood not making it all the way down.</b>',
    'Most people notice a gentle warmth in their hands and feet within the first few days of taking two softgels in the morning.',
    'Ruby F. put it simply: <i>"I used to sleep with socks because my feet became so cold during the night. Over the last few weeks I stopped wearing them in bed."</i>']),
  ('Helps the feeling return to numb toes and fingertips.', 'benefit-2.webp', 'center', '✨ Feeling Restored.',
   ['Your nerves need oxygen-rich blood to work. When the small vessels that feed them narrow, the signal fades: first a tingle, then a numb spot that slowly gets bigger.',
    'Just Jenny is designed to reopen those small vessels, <b>so blood can flow back to your nerves.</b>',
    'Around weeks 2 to 4, many customers describe a light tingling as feeling starts to come back.']),
  ('No burning, no reflux, no spicy burps hours later.', 'benefit-3.webp', 'center', '🌿 Gentle On The Stomach.',
   ['Tried cayenne capsules before and gave up because of the heartburn? You\'re not alone.',
    'Most cayenne capsules are dry powder that hits your stomach lining all at once.',
    '<b>Just Jenny uses a liquid cayenne extract suspended in MCT oil.</b> No harsh powder, no burning feeling. Amanda S. noticed <i>"just a slight warmth going down"</i> and nothing else.',
    'The MCT oil also acts as a carrier, so the fat-soluble cayenne compounds are absorbed instead of passing through unused.']),
  ('Steadier energy, without the 2pm crash.', 'timeline-3.webp', 'center 35%', '⚡ Energy That Lasts All Day.',
   ['Brain fog after every meal. Running on empty by early afternoon. Another cup of coffee just to get through the day.',
    'When blood doesn\'t get to where it\'s needed, your whole body runs slower.',
    'Better circulation plus <b>Panax ginseng</b> for steadier energy means you get your afternoons back.',
    'Rob G.: <i>"I stopped drinking cups of coffee to survive my crash after 2pm."</i>']),
  ('7 botanicals in 2 softgels. Fits right into your morning.', 'support.webp', 'center', '💊 Easy To Fit Into Your Routine.',
   ['Cayenne, beetroot, hawthorn berry, turmeric, Panax ginseng, black pepper and grape seed extract. Each one chosen for what it does inside your vessels.',
    'No shelf full of separate bottles. <b>Just two softgels a day with a glass of water.</b>',
    'No stimulants, no harsh powders.',
    '<b>As always, check with your doctor before starting any new supplement,</b> especially if you take medication for diabetes, blood pressure or blood thinning.']),
  ('Try it for 90 days, or get every penny back.', 'guarantee.webp', 'center 30%', '🔒 Completely Risk Free.',
   ['We know you\'ve tried things before that promised a lot and changed nothing.',
    'That\'s why every order comes with our <b>90-Day Money-Back Guarantee.</b>',
    'If your feet aren\'t warmer, your hands aren\'t tingling back to life, or you\'re simply not happy for any reason, email us and you get a full refund.',
    '<b>No risk. No hassle.</b>']),
]
N = len(items)

def item_html(i, it):
    h, img, pos, cap, ps = it
    return (f'<article class="ls-item"><h2><span class="ls-n">{i}.</span> {h}</h2>'
            f'<figure class="ls-fig">{pic("ls-img", img, f"Photo reason {i}", pos)}<figcaption>{cap}</figcaption></figure>'
            + ''.join(f'<p>{p}</p>' for p in ps) +
            f'<a class="ls-btn" href="/cayenne/">{CTA} <span aria-hidden="true">→</span></a></article>')

html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{N} Reasons People With Diabetes Are Switching To Just Jenny Cayenne Pepper Softgels</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/cayenne/listicle/listicle.css?v=3">
<!--HEAD-EXTRA-->
</head>
<body>
<div class="bar"><div class="bar-in"><div class="bar-t"><b>🔥 Early Black Friday Sale 🔥</b><span>Up to 70% off + free gifts</span></div>
<div class="timer" aria-label="Offer countdown"><div><b id="t-h">01</b><i>HRS</i></div><div><b id="t-m">30</b><i>MINS</i></div><div><b id="t-s">00</b><i>SEC</i></div></div></div></div>

<main class="wrap">
<h1>{N} Reasons Why People With Diabetes Are Switching To Just Jenny Cayenne Pepper Softgels In 2026</h1>
<div class="by"><span class="by-av" aria-hidden="true">JJ</span><div><b>By the Just Jenny Team</b><span>Last updated Nov 17, 2026</span></div></div>
<p class="callout"><b>Read this BEFORE</b> you buy another pair of thermal socks.</p>

<div class="cmp"><table>
<thead><tr><th></th><th class="us">Just Jenny</th><th>Socks &amp; Heating Pads</th><th>Regular Cayenne Capsules</th></tr></thead>
<tbody>{''.join(f'<tr><td class="lb">{r[0]}</td><td class="us">{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>' for r in table)}</tbody>
</table></div>
<p class="tldr"><b>TL;DR:</b> Two Just Jenny softgels a day bring {N} real changes for people with diabetes 👇</p>

{''.join(item_html(i + 1, it) for i, it in enumerate(items))}
</main>

<section class="end"><div class="wrap">
<h2>More people are getting warm feet and their feeling back every single day.</h2>
<p>From people who were told cold feet just come with diabetes, to people who tried every sock and cream out there. <b>Just Jenny is the one they wish they had found sooner.</b></p>
<div class="offer">
  <span class="of-tag">🔥 Early Black Friday Sale 🔥</span>
  {pic("of-img", "hero-offer-3.webp", "Offer photo")}
  <div class="of-in">
    <h3>Check availability for <u>up to 70% off</u> + free gifts. <em>While stock lasts.</em></h3>
    <p>This sale is in high demand and stock keeps selling out.</p>
    <a class="ls-btn big" href="/cayenne/">{CTA} <span aria-hidden="true">→</span></a>
    <p class="of-end">DEAL ENDING IN <span class="t2"><b class="t-h">01</b> <b class="t-m">30</b> <b class="t-s">00</b></span></p>
    <p class="of-pill">Sell-Out Risk: <b>High</b> <i></i> FREE Shipping</p>
    <p class="of-g">Try it today with our 90-Day Money-Back Guarantee.</p>
  </div>
</div>
</div></section>

<footer class="ft"><div class="wrap">
<p>The information on this page is not medical advice and should not replace a consultation with a qualified healthcare provider. Always talk to your doctor before starting any new supplement, especially if you have a medical condition or take prescription medication.</p>
<p>These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary.</p>
<hr><p class="ft-c">© 2026 Just Jenny · <a href="https://www.getjustjenny.com/pages/terms-of-service">Terms of Service</a> | <a href="https://www.getjustjenny.com/pages/privacy-policy">Privacy Policy</a></p>
</div></footer>

<div class="satc" id="satc"><a class="ls-btn" href="/cayenne/">{CTA} <span aria-hidden="true">→</span></a><p>🛡️ 90-Day Money-Back Guarantee</p></div>
<!--BODY-EXTRA-->
<script src="/cayenne/listicle/listicle.js?v=1"></script>
</body>
</html>
'''

CFG = 'window.JJ_NO_ALPINE=true;window.JJ_IMG_SEL=".ed-pic";window.JJ_BG_SEL=".no-bg";window.JJ_CONTENT_URL="/cayenne/listicle/content.json";window.JJ_ASSET_BASE="/cayenne/listicle/";'
LIVE_HEAD = f'<script>{CFG}</script>\n<script defer src="/apply-content.js?v=sg2"></script>'
ED_HEAD = (f'<script>{CFG}window.JJ_NO_APPLY=true;window.JJ_REPO_PREFIX="cayenne/listicle/";window.JJ_LIVE_URL=location.origin+"/cayenne/listicle";window.JJ_READY_SEL=".ls-item";window.JJ_EDITOR=true;</script>\n'
           '<script defer src="/apply-content.js?v=sg2"></script>\n<link rel="stylesheet" href="/editor/editor.css">\n<script defer src="/editor/editor.js?v=sg2"></script>')
# tracking: zelfde blok als de salespagina
sp = open(base + '../build.py').read()
i = sp.index('TRACK_HEAD = """'); j = sp.index('"""', i + 16)
TRACK_HEAD = sp[i + 16:j].replace('init + events in cayenne.js', 'init + events in listicle.js')
os.makedirs(base + 'editor', exist_ok=True)
os.makedirs(base + 'assets/uploads', exist_ok=True)
open(base + 'index.html', 'w').write(html.replace('<!--HEAD-EXTRA-->', LIVE_HEAD + '\n' + TRACK_HEAD).replace('<!--BODY-EXTRA-->', ''))
open(base + 'editor/index.html', 'w').write(html.replace('<meta name="robots" content="noindex">', '<meta name="robots" content="noindex,nofollow">').replace('<!--HEAD-EXTRA-->', ED_HEAD).replace('<!--BODY-EXTRA-->', ''))
if not os.path.exists(base + 'content.json'): open(base + 'content.json', 'w').write('{"texts":[],"images":[]}\n')
print('ok')
