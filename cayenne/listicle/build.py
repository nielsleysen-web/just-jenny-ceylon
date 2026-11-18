# Genereert cayenne/listicle/index.html + editor/index.html (listicle voor de cayenne-launch; knoppen → salespagina)
# Structuur naar het aangeleverde voorbeeld; eigen teksten. Foto's zijn invulplekken (bewerkbaar in /cayenne/listicle/editor).
import os, os.path, re
base = os.path.dirname(os.path.abspath(__file__)) + '/'
A = '/cayenne/assets/'
CTA = 'Check Availability'

def pic(cls, img, label, pos='center'):
    st = f' style="background-image:url({A}{img});background-position:{pos}"' if img else ''
    return f'<div class="ed-pic {cls}{" has-img" if img else ""}"{st}><span class="slot-label">{label}</span></div>'

YES = '<span class="t-y">✅ Yes</span>'; NO = '<span class="t-n">❌ No</span>'; MAY = '<span class="t-m">⚠️ Maybe</span>'
table = [
    ('Brings blood back to your feet', YES, '<span class="t-m">⚠️ While worn</span>', NO),
    ('Targets circulation, not just sugar', YES, NO, NO),
    ('Helps the feeling return', YES, NO, MAY),
    ('Gentle on the stomach', YES, YES, MAY),
    ('Results', '<b>Build week by week</b>', 'Gone when you take them off', 'Little to nothing'),
]
TABLE_HEAD = ('Socks &amp; Heating Pads', 'Cinnamon, Berberine &amp; ALA')

items = [
  ('The first formula that goes after the real reason your feet go numb: <span class="hl">circulation, not sugar.</span>', 'benefit-1.webp', 'center', '🩸 Circulation, Not Just The Number.',
   ['Your doctor checks your A1C, nods, and tells you you\'re doing fine.',
    'So why are your feet still cold, numb and burning at night?',
    'Because <b>years of high blood sugar stiffen and narrow the tiny blood vessels that feed your feet.</b> Your number can look perfect while those vessels stay half closed, and the nerves in your toes slowly starve for oxygen.',
    '<b>Capsaicin from high-Scoville cayenne</b> helps those small vessels relax and open again, and beetroot gives your body the nitrates it turns into nitric oxide. So blood can travel all the way down to your toes again.']),
  ('Wakes up numb toes and helps bring the feeling back.', 'benefit-2.webp', 'center', '✨ Feeling Returns.',
   ['If you can\'t feel the floor under your feet anymore…',
    'If you check your socks for blood because you wouldn\'t notice a cut…',
    'That\'s not your age. <b>That\'s nerves starved of blood.</b>',
    'Your nerves need a steady supply of oxygen-rich blood to work. When circulation reaches your feet again, many customers notice a light tingling around weeks 2 to 4, as the feeling starts to return.']),
  ('Warm feet in bed again. No more sleeping in socks.', 'timeline-2.webp', 'center 40%', '🔥 No More Ice-Cold Feet At Night.',
   ['Two pairs of socks, a hot-water bottle, the heating on full… and your feet are still ice cold at 2 am.',
    'That isn\'t the temperature in your bedroom. <b>That\'s blood not making it all the way down.</b>',
    'Most people feel a gentle warmth in their hands and feet within the first few days.',
    'Ruby F.: <i>"I used to sleep with socks because my feet became so cold during the night. Over the last few weeks I stopped wearing them in bed."</i>']),
  ('Liquid cayenne in oil, not powder. Here\'s why the cayenne you tried before did nothing.', 'benefit-3.webp', 'center', '💧 Oil, Not Powder.',
   ['Most cayenne capsules are dry powder. <b>Capsaicin dissolves in fat, not water.</b> So most of that powder passes straight through you, and the rest burns your stomach on the way.',
    'Just Jenny uses a <b>concentrated 12:1 liquid cayenne extract suspended in MCT oil</b>, a 3,000 mg cayenne equivalent in every serving.',
    'Then we add <b>black pepper</b>, which helps your body absorb the other botanicals, so more of every softgel is actually put to work.',
    'No burning. No reflux. No spicy burps hours later.']),
  ('It\'s not your fault, and it\'s not too late.', 'problem-2.webp', 'center 45%', '🙏 Not Your Fault. Not Too Late.',
   ['Maybe you were told it runs in the family. Maybe you blame yourself for years of eating the wrong things.',
    'Here\'s what nobody told you: <b>you could do everything right with your sugar and still lose circulation in your feet</b>, because nobody was looking after the small vessels.',
    'That\'s not a failure on your part. It\'s a gap in how diabetes gets managed.',
    'And whether you\'re 55 or 75, <b>it\'s never too late to start giving your circulation the support it\'s been missing.</b>']),
  ('Designed to fit right into your daily routine.', 'support.webp', 'center', '✅ Two Softgels A Day.',
   ['Already taking a handful of pills every morning? Just Jenny isn\'t another prescription. <b>It\'s a food-based supplement made from cayenne pepper extract and 6 natural botanicals.</b>',
    'Cayenne, beetroot, hawthorn berry, turmeric, Panax ginseng, black pepper and grape seed extract. No stimulants. No harsh powders.',
    'Just two softgels a day with a glass of water.',
    '<b>As always, check with your doctor before starting any new supplement</b>, especially if you take medication for diabetes, blood pressure or blood thinning. Just Jenny does not replace your medication.']),
  ('Stay on your own two feet, and off your family\'s worry list.', 'timeline-3.webp', 'center 35%', '👣 Keep Walking. Stay Independent.',
   ['Walking the dog. Standing through Sunday service. Chasing the grandkids round the garden.',
    'What you really want isn\'t a better number. <b>It\'s to keep doing all of it on your own, for as long as you can.</b>',
    'Warm feet that you can feel make every step more sure. And you can stop worrying about becoming a burden to the people you love.',
    'Rob G.: <i>"Around the two-week mark I noticed that I stopped wearing socks in bed and my hands got their feeling back."</i>']),
  ('Try it for 90 days, or get every penny back.', 'guarantee.webp', 'center 30%', '🔒 Completely Risk Free.',
   ['We know you\'ve been burned before. Cinnamon. Berberine. Foot creams. Thermal socks. Lots of promises, same cold feet.',
    'That\'s why every order comes with our unbreakable <b>90-Day Money-Back Guarantee.</b>',
    'If your feet aren\'t warmer… if the feeling isn\'t coming back… if you\'re not completely happy for any reason…',
    '<b>You get every penny back.</b> No questions asked.']),
]
N = len(items)

def item_html(i, it):
    h, img, pos, cap, ps = it
    return (f'<article class="ls-item"><h2><span class="ls-n">{i}.</span> {h}</h2>'
            f'<figure class="ls-fig">{pic("ls-img", img, f"Photo reason {i}", pos)}<p class="ls-cap">{cap}</p></figure>'
            + ''.join(f'<p>{p}</p>' for p in ps) + '</article>')
MID_BTN = f'<div class="ls-mid"><a class="ls-btn" href="/cayenne/">{CTA} <span aria-hidden="true">→</span></a></div>'

html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{N} Reasons Why Diabetics Over 55 Are Switching To Just Jenny Cayenne Pepper Softgels</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/cayenne/listicle/listicle.css?v=10">
<!--HEAD-EXTRA-->
</head>
<body>
<div class="bar"><div class="bar-in"><div class="bar-t"><b>🔥 Early Black Friday Sale 🔥</b><span>Up to 70% off + free gifts</span></div>
<div class="timer" aria-label="Offer countdown"><div><b id="t-h">01</b><i>HRS</i></div><div><b id="t-m">30</b><i>MINS</i></div><div><b id="t-s">00</b><i>SEC</i></div></div></div></div>

<main class="wrap">
<h1>{N} Reasons Why Diabetics Over 55 Are Switching To Just Jenny Cayenne Pepper Softgels In 2026</h1>
<div class="by"><figure class="by-av"><span class="ed-pic by-img has-img" style="background-image:url(/cayenne/assets/uploads/ed-pic-9.webp)"><span class="slot-label">Photo</span></span><span class="by-vf"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#2F7BEA"/><path d="M7 12.3l3.3 3.3L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></figure><div><b>Dr. Wasim Hanif | Diabetologist</b><span>Last updated Nov 17, 2026</span></div></div>
<p class="callout"><b>Read this BEFORE</b> you blame another numb toe on "just your sugar".</p>

<div class="cmp"><table>
<thead><tr><th></th><th class="us">Just Jenny</th><th>{TABLE_HEAD[0]}</th><th>{TABLE_HEAD[1]}</th></tr></thead>
<tbody>{''.join(f'<tr><td class="lb">{r[0]}</td><td class="us">{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>' for r in table)}</tbody>
</table></div>
<p class="tldr"><b>TL;DR:</b> Two Just Jenny softgels a day bring {N} life-changing benefits for diabetics with cold, numb feet 👇</p>

{''.join(item_html(i + 1, it) + (MID_BTN if i + 1 == (len(items) + 1) // 2 else '') for i, it in enumerate(items))}
</main>

<section class="end"><div class="wrap">
<h2>Over 20,000 people already trust Just Jenny, and more diabetics are getting warm feet and their feeling back every single day.</h2>
<p>From diabetics who were told numb feet just come with the disease, to those who tried every cream, cinnamon pill and pair of thermal socks out there. <b>Just Jenny is the one they wish they\'d found sooner.</b></p>
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
<script src="/cayenne/listicle/listicle.js?v=3"></script>
</body>
</html>
'''

CFG = 'window.JJ_NO_ALPINE=true;window.JJ_IMG_SEL=".ed-pic";window.JJ_BG_SEL=".no-bg";window.JJ_CONTENT_URL="/cayenne/listicle/content.json";window.JJ_ASSET_BASE="/cayenne/listicle/";'
LIVE_HEAD = f'<script>{CFG}</script>\n<script defer src="/apply-content.js?v=sg2"></script>'
ED_HEAD = (f'<script>{CFG}window.JJ_NO_APPLY=true;window.JJ_REPO_PREFIX="cayenne/listicle/";window.JJ_LIVE_URL=location.origin+"/cayenne/listicle";window.JJ_READY_SEL=".ls-item";window.JJ_EDITOR=true;</script>\n'
           '<script defer src="/apply-content.js?v=sg2"></script>\n<link rel="stylesheet" href="/editor/editor.css">\n<script defer src="/editor/editor.js?v=sg4"></script>')
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
