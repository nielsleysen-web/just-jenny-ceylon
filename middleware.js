// sageleaf.justjenny.com → de Sage Leaf-salespagina (map /sage) op de root van dat domein.
// Alle andere domeinen (cannella.getjustjenny.com …) blijven ongewijzigd.
export const config = { matcher: ['/', '/editor', '/editor/'] };

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get('host') || '').toLowerCase();
  // cayenne.getjustjenny.com → /cayenne (zelfde patroon voor elk nieuw product: <product>.getjustjenny.com)
  const dir = host.startsWith('sageleaf.') ? '/sage' : host.startsWith('cayenne.') ? '/cayenne' : null;
  if (!dir) return; // niets doen
  url.pathname = url.pathname.startsWith('/editor') ? dir + '/editor' : dir;
  return new Response(null, { headers: { 'x-middleware-rewrite': url.toString() } });
}
