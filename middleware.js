// sageleaf.justjenny.com → de Sage Leaf-salespagina (map /sage) op de root van dat domein.
// Alle andere domeinen (cannella.getjustjenny.com …) blijven ongewijzigd, behalve de oude cayenne-adressen
// op cannella.getjustjenny.com: die sturen door naar cayenne.getjustjenny.com (één funnel in het dashboard).
export const config = { matcher: ['/', '/editor', '/editor/', '/listicle', '/listicle/', '/listicle/editor', '/listicle/editor/', '/listicle/sales', '/listicle/sales/', '/cayenne', '/cayenne/', '/cayenne/listicle', '/cayenne/listicle/'] };

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get('host') || '').toLowerCase();
  const p0 = url.pathname.replace(/\/$/, '');
  // Oude adressen cannella.getjustjenny.com/cayenne(/listicle) → cayenne.getjustjenny.com (/ of /listicle),
  // met alle tracking-parameters (fbclid, ad_id, utm's …) erbij. 302 = tijdelijk, makkelijk terug te draaien.
  if (p0 === '/cayenne' || p0 === '/cayenne/listicle') {
    if (host.startsWith('cannella.')) {
      const to = 'https://cayenne.getjustjenny.com' + (p0 === '/cayenne' ? '/' : '/listicle') + url.search;
      return new Response(null, { status: 302, headers: { Location: to, 'Cache-Control': 'no-store' } });
    }
    return; // andere domeinen (o.a. Vercel-previews): gewoon de map tonen
  }
  // cayenne.getjustjenny.com → /cayenne (zelfde patroon voor elk nieuw product: <product>.getjustjenny.com)
  const dir = host.startsWith('sageleaf.') ? '/sage' : host.startsWith('cayenne.') ? '/cayenne' : null;
  if (!dir) return; // niets doen
  // /listicle (en /listicle/editor) → de listicle van dat product (cayenne/listicle)
  const p = url.pathname.replace(/\/$/, '');
  // /listicle/sales → de salespagina, maar onder /listicle/ zodat bezoeken, checkout-kliks en sales
  // in het dashboard bij de listicle-funnel blijven (funnel = domein + eerste padsegment)
  url.pathname = p === '/listicle/sales' ? dir : p.startsWith('/listicle') ? dir + p : p.startsWith('/editor') ? dir + '/editor' : dir;
  return new Response(null, { headers: { 'x-middleware-rewrite': url.toString() } });
}
