# Genereert sage/index.html + sage/editor/index.html
CK='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
XX='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
def ic(d): return f'<span class="bi"><svg viewBox="0 0 24 24">{d}</svg></span>'
def slot(cls, label, extra=''):
    return f'<div class="{cls}"{extra}><span class="slot-label">{label}</span></div>'

def bundles(box):
    rows=[(1,'Buy 1','$1.20 / day','$26.99','$27.95','',False),
          (3,'Buy 2 Get 1 Free','$0.54 / day','$18.00','$27.95','Most Popular',True),
          (5,'Buy 3 Get 2 Free','$0.47 / day','$16.20','$27.95','',False)]
    out=['<div class="bundles">']
    for q,name,day,price,was,tag,sel in rows:
        perks=''
        if sel:
            perks='''<ul class="b-perks"><li>Covers the full 12-week clinical window</li><li>Most users see meaningful results by week 8</li><li>Free Shipping</li><li>60-day money-back guarantee</li></ul>'''
        else:
            perks='''<ul class="b-perks"><li>Free Shipping</li><li>60-day money-back guarantee</li></ul>'''
        t=f'<span class="b-tag">{tag}</span>' if tag else ''
        out.append(f'''<div class="bundle{' sel' if sel else ''}" data-qty="{q}">{t}
        <div class="b-row">{slot('b-img ed-pic','Foto '+str(q)+'x')}<span class="b-name">{name}</span><span class="b-day">{day}</span>
          <span class="b-price"><span class="per">{price}</span> <small>/Bottle</small><s class="was">{was}</s></span></div>
        </div>''')
    out.append('</div>')
    return '\n'.join(out)

def buybox(btn_text):
    return f'''<div class="batch">CURRENT BATCH — LIMITED SUPPLY</div>
      {bundles(0)}
      <div class="atc-wrap"><a class="buy-btn{' atc-big' if 'atc-l' in btn_text else ''}" href="#">{btn_text}</a></div>'''

help_cards=[('Remember Names','Greet every friend by name.'),('Stay Focused','Finish your thought, every time.'),('Find Your Things','Keys, glasses, phone – right where you left them.'),('Be Fully Present','Enjoy every moment with the people you love.')]
left=[('Sage leaf at the core:','A herb used for memory for centuries, and now studied in small human trials.'),('Vitamin B12 for your brain:','B12 supports normal brain and nerve function. It matters more after 50.'),('Zinc for clear thinking:','Zinc supports normal cognitive function – your ability to think and learn.')]
right=[('Magnesium for less tiredness:','Magnesium helps reduce tiredness, so you feel clearer through the day.'),('Third-party tested:','Every batch is checked by an independent lab.'),('Gentle and hormone-free:','Plant-based, with no hormones and no harsh stimulants. Just one easy routine.')]
vs_rows=[('Sage Leaf for Memory',1),('Vitamin B12 for Brain Function',1),('Zinc for Clear Thinking',1),('Magnesium for Less Tiredness',1),('Simple 4-Ingredient Formula',1),('Hormone-Free &amp; Plant-Based',1),('Third-Party Tested',1),('60-Day Money-Back Guarantee',1),('Artificial Colours &amp; Fillers',0),('Harsh Stimulants',0),('Crowded 20+ Ingredient Blends',0)]
faqs=[
('Can I buy Just Jenny in stores or on Amazon?','No. Just Jenny Sage Leaf Memory Support is only sold on this website. That way we can guarantee every bottle is fresh, genuine and covered by our 60-day money-back guarantee.'),
('What is in Just Jenny?','Four simple ingredients: sage leaf extract, vitamin B12, zinc and magnesium. No hormones, no harsh stimulants and no crowded blends. See the label for exact amounts.'),
('Is Just Jenny safe with my current medications?','If you take prescription medication, are pregnant or nursing, or have a medical condition, check with your doctor or pharmacist before you start any new supplement.'),
('How should I store it?','Keep the bottle closed in a cool, dry place, away from direct sunlight and out of reach of children.'),
('Will Just Jenny help me remember names and everyday things?','Just Jenny is made to support your memory every day as part of a simple routine. Everyone is different and individual results vary.'),
('How soon will I notice a difference?','Take it every day. Many people give it 8 to 12 weeks to see how it works for them. Individual results vary.'),
('How do I take it?','Take [X] capsules a day with water, ideally with a meal.'),
('How many capsules are in each bottle?','Each bottle contains 90 capsules.'),
('Are there any allergens or dietary restrictions?','Just Jenny is plant-based and hormone-free. Always check the label if you have an allergy.'),
("What if it doesn't work for me?","You're covered by our 60-day money-back guarantee. If you're not happy, email us and we'll make it right."),
('When should I see a doctor about my memory?','If memory problems come on suddenly, get worse quickly or start to affect your daily life, talk to your doctor. A supplement is not a replacement for medical advice.'),
]

ICON={
 'user':'<path d="M3 19V7M3 15h18v4M21 15v-2.5A2.5 2.5 0 0018.5 10H11v5"/><circle cx="7" cy="12" r="2"/>',
 'target':'<path d="M12 3.5s5.5 6 5.5 10.2a5.5 5.5 0 01-11 0C6.5 9.5 12 3.5 12 3.5z"/><path d="M9.6 14h4.8"/>',
 'chat':'<path d="M13 2.5L5.5 13.5h5.5L10 21.5l8-11.5h-5.5z"/>',
 'bulb':'<circle cx="12" cy="12" r="2.6"/><path d="M10.2 10.2L5.5 5.5M4 7l1.5-1.5L7 4M13.8 13.8l4.7 4.7M20 17l-1.5 1.5L17 20"/>',
 'heart':'<path d="M12 3l7 3v5.2c0 4.4-3 8.3-7 9.8-4-1.5-7-5.4-7-9.8V6z"/><path d="M9 12l2.2 2.2L15.2 10"/>',
}
def benefit(k,t): return f'<li>{ic(ICON[k])}<span>{t}</span></li>'

trust_items=['GMP CERTIFIED','MADE IN THE USA','PLANT-BASED','HORMONE-FREE','GLUTEN-FREE','3RD-PARTY TESTED']
CKW=CK.replace('<svg','<svg style="stroke:#fff;fill:none;stroke-width:2.4"')
trust=''.join('<span>'+CKW+t+'</span>' for t in trust_items*4)
ticker=''.join('<span>'+t+'</span>' for t in ['Up to 70% off','Buy 2 Get 1 Free','90 Day Money Back Guarantee']*6)

seals=[('3RD-PARTY<br>TESTED','<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/>'),('HORMONE<br>FREE','<circle cx="12" cy="5" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><path d="M12 7v4M12 11l-6 5M12 11l6 5"/>'),('NO ARTIFICIAL<br>INGREDIENTS','<circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/>'),('NON-GMO','<circle cx="12" cy="12" r="9"/><path d="M6 6l12 12M12 18V9M12 13c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 11c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z"/>')]

HELPS=''.join('<div class="help"><h3>'+t+'</h3>'+slot('ed-img','Foto: '+t)+'<p>'+p+'</p></div>' for t,p in help_cards)
html=f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Just Jenny Sage Leaf Memory Support</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon-32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
<link rel="stylesheet" href="/sage/sage.css?v=44">
<!--HEAD-EXTRA-->
</head>
<body>

<div class="ticker"><div class="ticker-track">{ticker}</div></div>

<header class="hdr"><div class="wrap-w"><a class="logo">Just Jenny</a></div></header>

<section class="hero" id="top"><div class="wrap-w"><div class="hero-grid">
  <div class="gallery">
    <div class="g-main"><span class="slot-label">Productfoto 1</span>
      <span class="g-badge"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5.2c0 4.4-3 8.3-7 9.8-4-1.5-7-5.4-7-9.8V6z"/><path d="M9 12l2.2 2.2L15.2 10"/></svg><span>90-Day Money Back Guarantee</span></span>
      <button class="g-arrow g-prev" type="button" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
      <button class="g-arrow g-next" type="button" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
    </div>
    <div class="thumbs">{''.join(slot('ed-pic'+(' active' if i==1 else ''),'Foto '+str(i)) for i in range(1,8))}</div>
    <div class="g-review">
      <div class="stars">★★★★★</div>
      <p class="g-rv-text">[Review text from a real customer – what they struggled with, what changed after using it.]</p>
      <div class="g-rv-by"><div class="rv-av"><span class="slot-label">Foto</span></div><span class="g-rv-name">[First name] [Initial]., [Country]</span></div>
    </div>
  </div>
  <div class="buy">
    <div class="rec"><figure class="rec-av">{slot('ed-img','')}<svg class="rec-vf" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#2F80ED" stroke="#fff" stroke-width="1.5"/><path d="M8 12.2l2.7 2.7L16.2 9.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></figure><p class="rec-t">Recommended By Dr. <b>Norman B. Gaylis | Rheumatologist, M.D.</b><svg class="rec-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11.2s-3.4-2.2-3.4-4.6a1.9 1.9 0 013.4-1.2 1.9 1.9 0 013.4 1.2c0 2.4-3.4 4.6-3.4 4.6z"/><path d="M10.9 7.2h2.2M12 6.1v2.2"/><path d="M2.5 13.5l2.6-.9c.8-.3 1.7-.2 2.4.3l2.4 1.6h2.6c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2H9.6"/><path d="M2.5 19.5l2.7-1.6c.5-.3 1.1-.4 1.7-.2l4.3 1.3c.6.2 1.2.1 1.7-.2l6.4-4.1c.6-.4.8-1.2.4-1.8-.4-.6-1.2-.8-1.8-.4l-3.9 2.3"/></svg></p></div>
    <h1 class="h-title">Just Jenny Sage Leaf Memory Support – Sharper Recall, Clearer Focus &amp; Everyday Brain Health</h1>
    <div class="stars-line"><span class="stars">★★★★★</span><span>Rated 4.7</span><span>•</span><span>11,014 Reviews</span></div>
    <p class="lead"><b>Made to break down the inflammatory substances in the synovial membrane,</b> the hidden root cause of waking up with stiff joints and achy muscles.</p>
    <p class="p14">One simple daily routine with sage leaf, vitamin B12, zinc and magnesium. Plant-based, hormone-free and easy to take.</p>
    <ul class="benefits">
      {benefit('user','Remember Names, Dates And Everyday Details')}
      {benefit('target','Stay Focused And Keep Your Train Of Thought')}
      {benefit('chat','Find Your Words More Easily')}
      {benefit('bulb','Feel Sharp, Clear And Confident')}
      {benefit('heart','Supports Long-Term Brain Health')}
    </ul>
    <div class="buybox">{buybox('<span class="atc-l">Add To Cart</span><span class="atc-pill" x-text="calc"><s></s><span class="now"></span><span class="atc-g"><svg viewBox="0 0 24 24"><path d="M19.5 12a7.5 7.5 0 01-12.9 5.2M4.5 12a7.5 7.5 0 0112.9-5.2"/><path d="M17.6 3.6v3.2h-3.2M6.4 20.4v-3.2h3.2"/><path d="M13.8 9.8c-.4-.6-1-.9-1.8-.9-1.1 0-1.8.6-1.8 1.4 0 1.9 3.6.9 3.6 2.8 0 .8-.7 1.4-1.8 1.4-.8 0-1.5-.4-1.8-.9M12 8v.9M12 15v.9"/></svg>90-Day Money Back Guarantee</span></span>')}
      <div class="sub-note"><span><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5"/></svg>New Bottle Ship Every 30 Days</span><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Skip or Cancel Anytime</span></div>
    </div>
  </div>
</div></div></section>

<section class="mint"><div class="wrap">
  <div class="wave"></div>
  <div class="split">
    <div>
      <h2>Why You Walk Into a Room… and Forget Why</h2>
      <p>You know the feeling. A name on the tip of your tongue. Keys gone again. A thought that slips away mid-sentence.</p>
      <p>For most of us, it comes down to three everyday things:</p>

    </div>
    <div class="brain">{slot('ed-img','Afbeelding: gezond brein vs. moe brein')}<div class="brain-tabs"><span>SUPPORTED BRAIN</span><span>TIRED BRAIN</span></div></div>
  </div>
  <div class="wave up"></div>
  <div class="wave"></div>
  <div class="split">
    <div>
      <h2>Sticky Notes Don't Fix the Real Problem</h2>
      <p>Your brain works hard all day. It needs the right nutrients to keep up.</p>
      <p>But reminders and quick fixes only cover the problem. They don't feed your brain.</p>
      <p class="x-item"><i>✕</i><b>Sticky notes and phone alarms:</b> They help you remember today. They don't help your brain do the remembering.</p>
      <p class="x-item"><i>✕</i><b>Extra coffee:</b> It gives a quick buzz, then a crash. It doesn't support your memory.</p>
      <p class="x-item"><i>✕</i><b>Crowded "brain" blends:</b> Many pack in 20+ ingredients at tiny amounts. More isn't better – the right ones are.</p>
    </div>
    <div class="split-img">{slot('ed-img photo-tall','Foto: oudere man die iets vergeten is')}</div>
  </div>
  <div class="wave"></div>
  <div class="split rev">
    <div class="split-img">{slot('ed-img photo-tall','Foto: hand met het product')}</div>
    <div>
      <h2>Simple Daily Support for a Sharper Mind</h2>
      <p>Sage has been used for memory for centuries. Today, small human studies show sage leaf may support memory and attention.</p>
      <p><b>Just Jenny pairs sage leaf with three key nutrients.</b> Vitamin B12 and zinc support normal brain function. Magnesium helps reduce tiredness.</p>
      <p>Together, they give your brain simple daily support – so you can stay sharp, present and independent.</p>
    </div>
  </div>
</div>
<div class="ticker trust"><div class="ticker-track">{trust}</div></div>
</section>

<section class="helps"><div class="wrap">
  <h2>Just Jenny Helps You…</h2>
  <div class="help-grid">{HELPS}</div>
</div></section>

<section class="six"><div class="wrap">
  <div class="eyebrow">BEFORE YOU BUY ANY MEMORY SUPPLEMENT</div>
  <h2>Check These 6 Things First.</h2>
  <p class="sub">A memory supplement only helps if it's simple, gentle and made with care. Here's what we built Just Jenny to pass.</p>
  <div class="six-grid">
    <div class="six-col">{''.join(f'<div class="thing"><b>{a}</b>{b}</div>' for i,(a,b) in enumerate(left))}</div>
    <div class="six-mid">{slot('ed-pic','Productfoto met ingrediënten')}</div>
    <div class="six-col">{''.join(f'<div class="thing"><b>{a}</b>{b}</div>' for i,(a,b) in enumerate(right))}</div>
  </div>
  <div class="badges-row"><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/></svg>Plant-based</span><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/></svg>Hormone-free</span><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/></svg>Made in the USA · GMP</span><span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/></svg>Non-GMO</span></div>
</div></section>

<section class="people"><div class="wrap">
  <h2>[X]+ People Are Remembering More and Worrying Less with Just Jenny</h2>
  <p class="sub">See how they're keeping their minds sharp, staying independent and enjoying time with family – without sticky notes everywhere.</p>
  <div class="mission">
    <div class="collage">{''.join(slot('ed-img','Foto '+str(i)) for i in range(1,10))}</div>
    <div class="mission-txt">
      <h3>Our Mission: Help 1,000,000 People Feel Sharp and Like Themselves Again</h3>
      <h4>Here's where we are right now:</h4>
      <div class="stats">
        <div class="stat"><span class="pct">[XX]%</span><span class="lbl">said they feel more confident in their memory</span></div>
        <div class="stat"><span class="pct">[XX]%</span><span class="lbl">said they feel more focused through the day</span></div>
      </div>
      <p class="foot-note">*Based on a [X]-week customer survey of [X] Just Jenny users. Individual results vary.</p>
    </div>
  </div>
</div></section>

<section class="wrap"><div class="expert">
  <div class="expert-txt">
    <div class="date">[Date]</div>
    <h2>Expert Advice from [Expert name], MD</h2>
    <p class="quote">"[Your expert's own words, with their permission, go here.]"</p>
    <a class="cta-pill buy-btn" href="#offer" style="display:flex;width:100%;box-sizing:border-box;border-radius:999px;height:48px;font-weight:800;font-size:15px;margin:0">Try Just Jenny Today</a>
    <div class="mini-trust"><span>🛡 60-Day Money-Back Guarantee</span><span>🇺🇸 Free Shipping From USA</span></div>
  </div>
  {slot('ed-img','Foto: expert met het product')}
</div></section>

<article class="m4"><div class="wrap">
  <h2>We're On A Mission To Help 10,000,000 People Finally Feel Like Themselves Again</h2>
  <p class="m4-sub">Here's where we're at right now:</p>
  <div class="m4-grid"><div class="m4-item"><div class="m4-pct">[XX]%</div><p>said they get out of bed more easily in the morning</p></div><div class="m4-item"><div class="m4-pct">[XX]%</div><p>reported less stiffness in their hands and knees</p></div><div class="m4-item"><div class="m4-pct">[XX]%</div><p>reported less daily joint pain within the first [X] weeks*</p></div><div class="m4-item"><div class="m4-pct">[XX]%</div><p>said they move more freely and feel more active*</p></div></div>
  <p class="m4-note">*Based on a [X]-week [independent customer panel] of [X] Just Jenny customers</p>
</div></article>

<section class="promise"><div class="wrap">
  <h2>Expect More From Your Supplements</h2>
  <div class="sub">The Just Jenny Promise</div>
  <div class="seals">{''.join(f'<div class="seal"><svg viewBox="0 0 24 24">{d}</svg><span>{t}</span></div>' for t,d in seals)}</div>
</div></section>

<section class="vs"><div class="wrap">
  <div class="wave" style="margin:0 0 0"></div>
  <h2>Why Just Jenny Beats Generic Memory Pills</h2>
  <div class="vs-heads">{slot('ed-pic','Ons product')}<div><div class="vs-badge">VS</div></div>{slot('ed-pic','Generiek potje')}</div>
  <div class="vs-table">
    <div class="vs-col l"><div class="vh">Just Jenny<br>Memory Support</div>{''.join(f'<div class="vs-cell"><span class="{"ck" if g else "xx"}">{CK if g else XX}</span></div>' for _,g in vs_rows)}</div>
    <div class="vs-col m"><div class="vh">What Really<br>Matters</div>{''.join(f'<div class="vs-cell">{t}</div>' for t,_ in vs_rows)}</div>
    <div class="vs-col r"><div class="vh">Generic Memory<br>Pills</div>{''.join(f'<div class="vs-cell"><span class="{"xx" if g else "ck"}">{XX if g else CK}</span></div>' for _,g in vs_rows)}</div>
  </div>
  <a class="btn-wide buy-btn" href="#offer" style="width:400px;border-radius:999px;height:42px;font-size:13px;font-weight:800;margin:34px auto 0">BUY NOW &amp; SAVE</a>
  <div class="mg">🛡 60-Day Money-Back Guarantee</div>
</div></section>

<section class="offer" id="offer"><div class="wrap">
  <div class="offer-grid">
    {slot('ed-pic','Productfoto aanbieding')}
    <div>
      <h2>Special Offer On Now!</h2>
      <p class="t1">Try Just Jenny Memory Support Today</p>
      <p class="t1"><b>Risk-Free</b> with our First Time Buyer's Offer!</p>
      <h4>Act Now and You'll Get:</h4>
      <ul class="get"><li><span class="ck sm">{CK}</span>Up to 70% OFF Your First Order</li><li><span class="ck sm">{CK}</span>FREE Shipping</li><li><span class="ck sm">{CK}</span><span>Bonus: "The Complete Joint Support Blueprint" ($100+ Value)</span></li><li><span class="ck sm">{CK}</span><span>10 Daily Habits To Protect Your Joints, and Stay Flexible ($30 Value)</span></li><li><span class="ck sm">{CK}</span><span>Bonus: TOP 10 Natural Ways To Fight Joint Stiffness ($20+ Value)</span></li></ul>
      <div class="today">TODAY ONLY: $18.00</div>
      <div class="buybox">{buybox('<span class="atc-l">Add To Cart</span><span class="atc-pill" x-text="calc"><s></s><span class="now"></span><span class="atc-g"><svg viewBox="0 0 24 24"><path d="M19.5 12a7.5 7.5 0 01-12.9 5.2M4.5 12a7.5 7.5 0 0112.9-5.2"/><path d="M17.6 3.6v3.2h-3.2M6.4 20.4v-3.2h3.2"/><path d="M13.8 9.8c-.4-.6-1-.9-1.8-.9-1.1 0-1.8.6-1.8 1.4 0 1.9 3.6.9 3.6 2.8 0 .8-.7 1.4-1.8 1.4-.8 0-1.5-.4-1.8-.9M12 8v.9M12 15v.9"/></svg>90-Day Money Back Guarantee</span></span>')}</div>
      <img class="pay-img" src="/sage/assets/payments.png?v=1" alt="PayPal, Visa, Mastercard, American Express, Discover, Google Pay, Apple Pay" width="900" height="70">
      <div class="secure"><i></i>All transactions are secure and encrypted</div>
      <p class="note"><b>Note:</b> Not available on Amazon or eBay</p>
    </div>
  </div>
</div></section>

<section class="faq"><div class="wrap">
  <h2>Frequently Asked Questions</h2>
  <div class="faq-list">{''.join(f'<details><summary><span class="q">{q}</span></summary><div class="a">{a}</div></details>' for q,a in faqs)}</div>
  <div class="faq-cta"><a class="btn-wide buy-btn" href="#offer" style="width:400px;border-radius:999px;height:42px;font-size:13px;font-weight:800;margin:0 auto">BUY NOW &amp; SAVE</a><div class="mg">🛡 Feel Sharper Or It's Free!</div></div>
</div></section>

<footer class="ftr"><div class="wrap">
  <div class="ftr-grid">
    <div><h4>Sign up for new stories and personal offers</h4><form onsubmit="return false"><input type="email" placeholder="E-mail"><button type="submit">Subscribe</button></form></div>
    <div><h4>Policies</h4><ul><li><a href="#">Privacy Policy</a></li><li><a href="#">Refund Policy</a></li><li><a href="#">Shipping Policy</a></li><li><a href="#">Subscription Policy</a></li><li><a href="#">Terms of Service</a></li><li><a href="#">Legal Notice</a></li><li><a href="#">Manage Subscription</a></li></ul></div>
  </div>
  <p class="disclaimer">*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
  <p class="copy">© 2026, Just Jenny.</p>
</div></footer>

<div class="sticky"><a class="buy-btn" href="#offer">Add To Cart</a></div>

<script src="/sage/sage.js?v=11"></script>
<!--BODY-EXTRA-->
</body>
</html>
'''
LIVE_HEAD='<script>window.JJ_NO_ALPINE=true;window.JJ_IMG_SEL=".ed-img,.ed-pic,.rv-av";window.JJ_BG_SEL=".no-bg";window.JJ_CONTENT_URL="/sage/content.json";window.JJ_ASSET_BASE="/sage/";</script>\n<script defer src="/apply-content.js?v=sg2"></script>'
ED_HEAD='<script>window.JJ_NO_ALPINE=true;window.JJ_NO_APPLY=true;window.JJ_IMG_SEL=".ed-img,.ed-pic,.rv-av";window.JJ_BG_SEL=".no-bg";window.JJ_CONTENT_URL="/sage/content.json";window.JJ_ASSET_BASE="/sage/";window.JJ_REPO_PREFIX="sage/";window.JJ_LIVE_URL=location.origin+"/sage";window.JJ_READY_SEL=".bundle";window.JJ_EDITOR=true;</script>\n<script defer src="/apply-content.js?v=sg2"></script>\n<link rel="stylesheet" href="/editor/editor.css">\n<script defer src="/editor/editor.js?v=sg2"></script>'
import os
import os.path; base=os.path.dirname(os.path.abspath(__file__))+'/'
open(base+'index.html','w').write(html.replace('<!--HEAD-EXTRA-->',LIVE_HEAD).replace('<!--BODY-EXTRA-->',''))
os.makedirs(base+'editor',exist_ok=True)
open(base+'editor/index.html','w').write(html.replace('<title>Just Jenny Sage Leaf Memory Support</title>','<title>Sage – Edit &amp; publish</title>').replace('<meta name="robots" content="noindex">','<meta name="robots" content="noindex,nofollow">').replace('<!--HEAD-EXTRA-->',ED_HEAD).replace('<!--BODY-EXTRA-->',''))
if not os.path.exists(base+'content.json'): open(base+'content.json','w').write('{"texts":[],"images":[]}\n')
print('ok')
