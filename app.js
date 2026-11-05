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
    { id: 1, qty: 1, title: 'Acquista 1', save: '50%', price: '€29.99', was: '€59.99', badge: '' },
    { id: 2, qty: 3, title: 'Acquista 2 e ricevine 1 GRATIS', save: '69%', price: '€54.95', was: '€179.97', badge: 'Più popolare' },
    { id: 3, qty: 5, title: 'Acquista 3 e ricevine 2 GRATIS', save: '73%', price: '€79.95', was: '€299.95', badge: 'Spedizione gratuita' }
  ];
  const ICF = (d) => '<svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">' + d + '</svg>'; // gevulde iconen (vergelijking)
  const IC = (d) => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const REV = window.JJ_REVIEWS || { stories: [], feed: [] };
  const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  const BADGE = (d) => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9643A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '<path d="M3 3l18 18"/></svg>';

  return {
    // state
    bundle: 2, img: 0, acc: -1, ben: -1, faq: -1, revPage: 0, rStart: 0, feedShown: 6,
    showReviews: true, // reviews komen uit reviews.js (Trustpilot-export)
    subscribed: false, sticky: false,
    whyIdx: 0, tx: 0,
    vidIdx: 0,
    storyIdx: 0,
    tlP: 0, tlAct: 0, wide: true, now: Date.now(), end: Date.now() + 6753000,

    bundles: BUNDLES,
    // Customer survey results. Fill in YOUR OWN survey numbers (e.g. value: 84).
    // While value is null the page shows "[XX]%" and nothing animates.
    reportStats: [
      { value: 86, label: 'Continuerebbe a includere Just Jenny nella propria routine quotidiana' },
      { value: 72, label: 'Ha percepito livelli di energia più stabili durante la giornata' },
      { value: 91, label: 'L\'ha trovato più delicato sullo stomaco rispetto ad altri integratori di cannella' },
      { value: 79, label: 'Lo consiglierebbe a un amico' }
    ],
    statShown: [0, 0, 0, 0],
    // Galerij: 9 foto's. Zet bij elke foto het pad in src (bv. 'assets/gallery/1.jpg'); de eerste is de hoofdfoto.
    thumbs: [
      { short: '1', label: 'Confezione del prodotto', src: '' },
      { short: '2', label: 'Capsule molli da vicino', src: '' },
      { short: '3', label: 'Infografica dei benefici', src: '' },
      { short: '4', label: 'Donna 50+ con il prodotto a colazione', src: '' },
      { short: '5', label: 'Foto 5', src: '' },
      { short: '6', label: 'Foto 6', src: '' },
      { short: '7', label: 'Foto 7', src: '' },
      { short: '8', label: 'Foto 8', src: '' },
      { short: '9', label: 'Foto 9', src: '' }
    ],
    productAcc: [
      { t: 'Benefici supportati da evidenze cliniche', body: 'Supportato da studi sulla vera cannella di Ceylon (Cinnamomum verum)\n• Aiuta a mantenere i livelli di glicemia già nella norma\n• Favorisce la sensibilità all\'insulina e l\'utilizzo efficiente del glucosio da parte dell\'organismo\n• Favorisce una circolazione sana e il normale funzionamento del metabolismo quotidiano\n• Svolge un\'azione antiossidante che aiuta a proteggere le cellule dai danni ossidativi\n• Un estratto delicato e ben tollerato, formulato per un uso quotidiano costante e prolungato\n• Cannella di Ceylon praticamente priva di cumarina: una differenza fondamentale rispetto alla comune cannella Cassia\n\nRisultati tratti da studi clinici e osservazionali sulla vera cannella di Ceylon, utilizzata regolarmente nell\'ambito di uno stile di vita sano. I risultati variano da persona a persona.' },
      { t: 'Ingredienti principali', body: 'Estratto di vera cannella di Ceylon (Cinnamomum verum)\n• Coltivata in Sri Lanka — non la varietà Cassia più economica\n• Estratto liquido concentrato 12:1\n• Ogni capsula molle fornisce l\'equivalente di 7.200 mg di cannella di Ceylon grezza\n• Naturalmente priva di cumarina. Sicura da assumere ogni giorno, anche a lungo termine\n• Favorisce livelli sani di glicemia, il corretto funzionamento del metabolismo e una buona circolazione\n\nOlio MCT (Trigliceridi a Catena Media)\n• Agisce come veicolo naturale per migliorare l\'assorbimento\n• I principi attivi della cannella sono liposolubili. L\'olio MCT ne favorisce l\'ingresso efficace nel flusso sanguigno\n• Permette all\'estratto di essere assorbito rapidamente, anziché attraversare l\'organismo senza produrre effetti\n• Delicato sull\'apparato digerente. Niente polveri aggressive, niente disturbi allo stomaco\n\nSistema di somministrazione in capsule molli\n• Capsule molli lisce e facili da deglutire\n• Niente capsule contenenti polveri dalla consistenza gessosa\n• Pensate per un\'assunzione quotidiana confortevole: basta una sola capsula molle al giorno' },
      { t: 'Come funziona', body: 'La maggior parte degli integratori di cannella non funziona perché utilizza polvere di Cassia economica, compressa in capsule rigide che lo stomaco fatica a scomporre correttamente. I principi attivi rimangono intrappolati nelle fibre e attraversano l\'organismo in gran parte senza essere assorbiti.\n\nJust Jenny segue un approccio diverso. Partiamo dalla vera cannella di Ceylon proveniente dallo Sri Lanka, la concentriamo con un rapporto di 12:1 per ottenere un estratto liquido omogeneo, poi la misceliamo con olio MCT e la racchiudiamo in capsule molli facili da deglutire.\n\nUna volta sciolta la capsula molle, l\'estratto è già sospeso nell\'olio, in una forma altamente biodisponibile che l\'organismo può assorbire in modo efficiente.\n\nNiente polveri dalla consistenza granulosa. Nessun retrogusto di cannella a distanza di ore. Nessuno spreco di principi attivi.\n\nL\'olio MCT agisce come un sistema di trasporto naturale, veicolando i principi attivi concentrati della cannella di Ceylon nel flusso sanguigno per favorire un sano metabolismo del glucosio, la circolazione e il benessere cellulare.\n\nUna sola capsula molle al giorno fornisce l\'equivalente di 7.200 mg di cannella di Ceylon. La potenza che decine di capsule tradizionali cercano di eguagliare, in una forma che il tuo organismo può davvero assorbire.\n\nEcco perché così tanti adulti sopra i 50 anni, che avevano ormai rinunciato del tutto agli integratori di cannella, stanno finalmente percependo una differenza concreta con Just Jenny.' }
    ],
    benefits: [
      { t: 'Supporto alla glicemia', sub: 'Favorisce il mantenimento di livelli sani di glicemia.', img: 'glicemia / glucosio', short: 'La cannella di Ceylon è studiata per il suo ruolo in un sano metabolismo del glucosio: una capsula molle al giorno aiuta a mantenere i livelli stabili.', deep: 'La vera cannella di Ceylon è oggetto di studi per la sua capacità di favorire un sano metabolismo del glucosio. Just Jenny utilizza un estratto concentrato 12:1 con olio MCT per aiutare l\'organismo ad assorbirlo e utilizzarlo efficacemente.' },
      { t: 'Delicato sullo stomaco', sub: 'Formulato per un\'assunzione quotidiana confortevole.', img: 'donna con stomaco sereno', short: 'Sospeso in olio MCT in una capsula molle liscia: niente bruciore, niente retrogusto amaro, delicato sullo stomaco.', deep: 'Just Jenny utilizza un estratto liquido di cannella sospeso in olio MCT. Niente polveri irritanti. Nessuna irritazione allo stomaco. Nessun rutto al sapore di cannella a distanza di ore.' },
      { t: 'Salute del fegato', sub: 'Realizzato con cannella di Ceylon priva di cumarina.', img: 'fegato sano / Ceylon vs Cassia', short: 'La vera cannella di Ceylon è naturalmente povera di cumarina, quindi adatta a un uso quotidiano a lungo termine.', deep: 'A differenza della cannella Cassia, quella di Ceylon è praticamente priva di cumarina. Questo rende Just Jenny un\'opzione più sicura per l\'assunzione quotidiana e il benessere del fegato a lungo termine.' },
      { t: 'Assorbimento potenziato', sub: 'Aiuta l\'organismo ad assorbire la cannella.', img: 'capsula molle con olio MCT', short: 'I principi attivi della cannella sono liposolubili: l\'olio MCT aiuta l\'organismo ad assorbirne di più.', deep: 'I principi attivi della cannella sono liposolubili. L\'olio MCT agisce come veicolo, favorendo l\'assorbimento efficiente dell\'estratto di Ceylon equivalente a 7.200 mg, anziché lasciarlo attraversare l\'organismo senza essere utilizzato.' }
    ],
    weeks: [
      { t: 'Settimane 1-2: Un inizio semplice', items: ['Una sola capsula molle al giorno si integra facilmente nella tua routine quotidiana.', 'Molti adulti notano un\'energia più stabile e meno cali di energia nel pomeriggio.', 'Alcuni utilizzatori avvertono una riduzione della voglia di zuccheri.', 'L\'organismo inizia a rispondere al supporto quotidiano della cannella di Ceylon.'] },
      { t: 'Settimane 3-4: Equilibrio quotidiano', items: ['Ti senti più in equilibrio durante tutta la giornata.', 'Meno sbalzi di energia rispetto a quelli che molti sperimentavano in precedenza.', 'La routine quotidiana inizia a diventare naturale e sostenibile.', 'Mantenere la costanza diventa più facile.'] },
      { t: 'Settimane 5-6: Supporto metabolico', items: ['La maggior parte delle persone nota i miglioramenti più significativi in questa fase.', 'Favorisce un sano metabolismo del glucosio quando i valori sono già nella norma.', 'Maggiore fiducia nella propria energia quotidiana e nel benessere generale.', 'I benefici diventano più evidenti con l\'uso continuativo.'] },
      { t: 'Dalla settimana 7-8 in poi: Benessere a lungo termine', items: ['Supporto metabolico e antiossidante continuativo.', 'Formulato per un\'assunzione quotidiana costante e prolungata.', 'L\'obiettivo è la stabilità, non le soluzioni rapide.', 'I risultati dipendono dalle condizioni di salute individuali, dall\'alimentazione e dallo stile di vita.'] }
    ],
    reasons: [
      { t: 'Cannella di Ceylon concentrata 12:1', photo: 'capsule molli su polvere di cannella', body: 'A differenza della cannella Cassia economica, che contiene livelli elevati di cumarina dannosa per il fegato, Just Jenny è composta al 100% da autentica cannella di Ceylon. Concentriamo l\'equivalente di 7.200 mg di cannella grezza in una sola capsula molle al giorno.' },
      { t: 'Assorbimento potenziato dall\'olio MCT', photo: 'goccia di olio MCT', body: 'I principi attivi della cannella sono liposolubili, il che significa che, senza grassi sani, attraversano l\'organismo senza essere assorbiti. Sciogliamo il nostro estratto premium in olio MCT biologico, così il tuo organismo può assorbirlo e utilizzarlo immediatamente.' },
      { t: 'Supporto antinfiammatorio e metabolico', photo: 'stecche di Ceylon e Cassia a confronto', body: 'La vera cannella di Ceylon contiene potenti antiossidanti che favoriscono il normale equilibrio della glicemia, la sensibilità all\'insulina, la funzionalità cardiovascolare e una sana circolazione renale.' },
      { t: 'Nessun retrogusto, nessun disturbo allo stomaco', photo: 'una capsula molle nel palmo della mano', body: 'A differenza delle polveri dalla consistenza gessosa, delle capsule troppo grandi o delle polveri grezze che provocano reflusso acido ed eruttazioni, le nostre capsule molli sono piccole, lisce e incredibilmente delicate sullo stomaco.' },
      { t: 'Ingredienti puri, testati da laboratori indipendenti', photo: 'test di laboratorio', body: 'Vegano, senza OGM e privo di glutine, latticini, soia, zucchero e riempitivi artificiali. Ogni singolo lotto viene sottoposto a test indipendenti per verificarne la purezza e la potenza. Prodotto negli Stati Uniti.' }
    ],
    stories: REV.stories.map((x) => Object.assign({}, x)),
    compare: [
      { us: 'Supportato scientificamente', them: 'Formule che seguono le mode', icon: IC('<path d="M9 3.5l3.5-1.5 3 6.5-3.5 1.5z"/><path d="M11.5 9.5l1 2.3"/><path d="M14 11.8a5.5 5.5 0 0 1 1.5 9.2"/><path d="M6.5 14h8"/><path d="M10.5 14v6"/><path d="M4.5 20.5h15"/>') },
      { us: 'Testato da laboratori indipendenti', them: 'Nessun test indipendente', icon: ICF('<path d="M12 2l8 3v6c0 5.2-3.4 9.3-8 11-4.6-1.7-8-5.8-8-11V5zm-1.3 13.6l6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4z"/>') },
      { us: 'Zero cumarina, formula pura', them: 'Cassia economica, ricca di cumarina', icon: ICF('<path d="M20.5 3.5C12 3.5 5.5 8 4.2 16.3c-.1.7.1 1.4.5 1.9l-1.9 2.2 1.4 1.2 1.9-2.2c.5.3 1.1.5 1.8.4C16.3 18.4 20.5 12 20.5 3.5zM7.6 17.2c1.2-4.1 4-7.6 7.9-9.7-2.6 2.6-4.6 5.9-5.7 9.6z"/>') },
      { us: 'Estratto concentrato 12:1', them: 'Dosaggi insufficienti', icon: ICF('<path d="M12 1.5l2.4 1.9 3-.4 1.1 2.8 2.8 1.1-.4 3L22.5 12l-1.6 2.1.4 3-2.8 1.1-1.1 2.8-3-.4L12 22.5l-2.4-1.9-3 .4-1.1-2.8-2.8-1.1.4-3L1.5 12l1.6-2.1-.4-3 2.8-1.1 1.1-2.8 3 .4zm-1.4 14.1l6-6-1.4-1.4-4.6 4.6-2.2-2.2L7 12z"/>') },
      { us: 'Potenziato con olio MCT', them: 'Scarso assorbimento', icon: ICF('<path d="M12 2.5s6.5 7 6.5 12a6.5 6.5 0 0 1-13 0c0-5 6.5-12 6.5-12z"/>') },
      { us: 'Capsule molli ad alto assorbimento', them: 'Capsule grandi e difficili da deglutire', icon: ICF('<path d="M7.8 4.2a4.5 4.5 0 0 1 6.4 0l5.6 5.6a4.5 4.5 0 1 1-6.4 6.4L7.8 10.6a4.5 4.5 0 0 1 0-6.4zm1.4 1.4a2.5 2.5 0 0 0 0 3.6l2.8 2.8 3.6-3.6-2.8-2.8a2.5 2.5 0 0 0-3.6 0z"/>') }
    ],
    faqs: [
      { t: 'Cosa rende la cannella di Ceylon diversa da quella utilizzata nella maggior parte degli integratori?', body: 'Quasi tutti gli integratori a base di cannella utilizzano la varietà Cassia. E la differenza è più importante di quanto molti pensino.\n\nLa cannella Cassia contiene elevate quantità di cumarina, una sostanza che, se assunta regolarmente in dosi elevate, può accumularsi nell\'organismo e affaticare il fegato.\n\nLa cannella di Ceylon, originaria dello Sri Lanka, ne contiene invece quantità molto basse. Per questo è una scelta più adatta all\'integrazione quotidiana.\n\nLa nostra formula concentrata 12:1 fornisce, in ogni capsula molle, l\'equivalente di 7.200 mg di cannella di Ceylon, in una formulazione studiata per favorirne l\'assorbimento.' },
      { t: 'Qual è la differenza tra Just Jenny e le normali capsule di cannella vendute in farmacia?', body: 'In farmacia si trovano spesso integratori a base di cannella Cassia, con dosaggi ridotti e in semplici capsule.\n\nJust Jenny è diverso. Utilizza un estratto concentrato 12:1 di cannella di Ceylon, formulato con olio MCT.\n\nOgni capsula molle contiene l\'equivalente di 7.200 mg di corteccia di cannella di Ceylon, in una formulazione pensata per favorirne l\'assorbimento da parte dell\'organismo.' },
      { t: 'Posso assumere Just Jenny insieme ai farmaci che prendo attualmente?', body: 'La cannella di Ceylon è generalmente ben tollerata. Tuttavia, se stai assumendo farmaci per controllare la glicemia, anticoagulanti o altri medicinali, parla con il tuo medico prima di iniziare.\n\nÈ una precauzione importante ogni volta che si introduce un nuovo integratore nella propria routine. Basta una telefonata per avere maggiore tranquillità.' },
      { t: 'Dopo quanto tempo posso aspettarmi di notare una differenza?', body: 'I primi cambiamenti percepiti nell\'energia e nel benessere generale vengono spesso descritti dopo 2-4 settimane di assunzione regolare.\n\nPer valutare eventuali cambiamenti misurabili della glicemia, è opportuno considerare un periodo di almeno 6-8 settimane, senza aspettarsi risultati garantiti.\n\nLa velocità con cui potresti notare una differenza dipende dalla tua situazione iniziale, dall\'alimentazione e dalle abitudini quotidiane. Gli effetti possono variare da persona a persona.' }
    ],
    feed: REV.feed.map((x, i) => Object.assign({}, x, {
      initials: x.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      bg: ['#F6E2D6', '#E4EEF3', '#EAF3E4', '#F3E8F1', '#FBF0CF', '#E8EAF6'][i % 6]
    })),

    // derived
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
    get revTotalTxt() { return (this.revTotal || this.feed.length).toLocaleString('it-IT'); },
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
      if (days < 1) return 'Oggi';
      if (days === 1) return '1 giorno fa';
      if (days < 7) return days + ' giorni fa';
      if (days < 30) { const w = Math.floor(days / 7); return w === 1 ? '1 settimana fa' : w + ' settimane fa'; }
      const m = Math.floor(days / 30); return m === 1 ? '1 mese fa' : m + ' mesi fa';
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
      return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 98 18" role="img" aria-label="Valutazione ' + r.toFixed(1) + ' su 5" style="display:block">' + boxes + pts + '</svg>';
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
