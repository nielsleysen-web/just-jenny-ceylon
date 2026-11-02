# Just Jenny – Ceylon Cinnamon productpagina

Statische site (HTML + CSS + Alpine.js via CDN). Geen build-stap nodig.

## Deployen op Vercel via GitHub
1. Maak een nieuwe repo op GitHub en upload deze map (index.html, app.js, reviews.js, styles.css, assets/).
2. Ga naar vercel.com → Add New → Project → importeer de repo.
3. Framework preset: **Other**. Build command: leeg. Output directory: leeg (root).
4. Deploy. Elke push naar `main` zet automatisch een nieuwe versie live.

## Nog in te vullen voor livegang
- Alle `[placeholders]`: foto's, video's, cijfers, support-e-mail, telefoonuren.
- `CHECKOUT_URL` bovenaan app.js op de URL van de custom checkout zetten (nu `/checkout`); elke koopknop stuurt daarheen met `?bundle=<id>&qty=<aantal>`.
- Ratings/"Verified by Trustpilot" alleen tonen als ze van je echte Trustpilot-profiel komen.

## Reviews
Alle Trustpilot-reviews staan in `reviews.js` (`stories` = 6 uitgelichte kaarten, `feed` = alle reviews). Gemiddelde, aantal en sterrenverdeling worden automatisch uit `feed` berekend.
