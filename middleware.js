// sageleaf.justjenny.com → de Sage Leaf-salespagina (map /sage) op de root van dat domein.
// Alle andere domeinen (cannella.getjustjenny.com …) blijven ongewijzigd.
export const config = { matcher: ['/', '/editor', '/editor/', '/listicle', '/listicle/', '/listicle/editor', '/listicle/editor/', '/listicle/sales', '/listicle/sales/'] };

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get('host') || '').toLowerCase();
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
