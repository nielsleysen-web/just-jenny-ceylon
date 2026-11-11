// sageleaf.justjenny.com → de Sage Leaf-salespagina (map /sage) op de root van dat domein.
// Alle andere domeinen (cannella.getjustjenny.com …) blijven ongewijzigd.
export const config = { matcher: ['/', '/editor', '/editor/'] };

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get('host') || '').toLowerCase();
  if (!host.startsWith('sageleaf.')) return; // niets doen
  url.pathname = url.pathname.startsWith('/editor') ? '/sage/editor/index.html' : '/sage/index.html';
  return new Response(null, { headers: { 'x-middleware-rewrite': url.toString() } });
}
