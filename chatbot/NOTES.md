# Chatbot notes

Overzicht van hoe de chatbot "Flora" werkt en welke limieten er gelden.

## Hoe het werkt
1. De bezoeker typt een vraag in het chatvenster (`chatbot.js`).
2. De vraag gaat samen met de laatste berichten naar een Cloudflare Worker (`worker/index.js`).
3. De Worker vraagt een AI-model (Cloudflare Workers AI) om een antwoord, met een systeemprompt vol winkelinfo en regels.
4. Het antwoord komt terug in de chat.

Is de Worker niet bereikbaar, of geeft hij een fout, dan antwoordt de chat met de FAQ in `faq.js`.

## Limieten

| Wat | Limiet | Waar instellen |
|---|---|---|
| Verzoeken per dag, hele site | **1000** (reset om middernacht UTC) | `DAILY_LIMIT` in `worker/index.js` |
| Verzoeken per bezoeker per uur | **20** (op basis van IP-adres) | `HOURLY_LIMIT_PER_USER` in `worker/index.js` |
| Eerdere berichten die het model meekrijgt | 10 | `MAX_MESSAGES` in `worker/index.js` |
| Lengte van één bericht | 400 tekens | `MAX_CHARS` in `worker/index.js` |
| Lengte van een antwoord | max. 500 tokens | `max_tokens` in `worker/index.js` |
| Grootte van een verzoek | max. 20 KB | `worker/index.js` |
| Wachttijd in de browser | 20 seconden, daarna FAQ-antwoord | `chatbot.js` |

Wordt een limiet bereikt, dan krijgt de bezoeker een melding met telefoon en mail (`limitHourly` en `limitDaily` in `faq.js`).

Het dagtotaal telt ook mee wanneer het model een fout geeft, want het verzoek is dan al geteld.

## Kosten
- Cloudflare Workers, Workers AI en Durable Objects draaien op het **gratis plan**. Er is geen betaalmethode gekoppeld, dus er kunnen geen kosten ontstaan zonder dat jullie zelf upgraden.
- Cloudflare heeft zelf ook een gratis dagquotum voor AI. Is dat op, dan geeft de Worker een fout en valt de chat terug op de FAQ. Controleer de actuele getallen in het Cloudflare-dashboard, want die kunnen veranderen.

## Waar de bot over mag praten
Alleen over Nora's Flora: openingstijden, adres, contact, aanbiedingen, boeketten. Bij andere vragen zegt de bot "Ik snap het verzoek niet" en verwijst hij naar telefoon en mail.

Dit staat in de systeemprompt en is **niet waterdicht**. Een slimme gebruiker kan het model soms toch overhalen. De Worker heeft geen echte inhoudscontrole.

## Veiligheid
- Er is **geen API-key of token** nodig, want Workers AI zit in de Worker zelf (binding `AI`).
- De Worker accepteert alleen verzoeken van de sites in `ALLOWED_ORIGINS` (GitHub Pages en localhost). Een andere website kan hem niet via de browser aanroepen.
- IP-adressen worden alleen als hash bewaard, voor de uurlimiet, en na het uur verwijderd.
- `.wrangler/` bevat Cloudflare-accountgegevens en staat daarom in `.gitignore`. Commit die map nooit.

## Onderhoud
- **Winkelinfo wijzigen:** pas het aan in `faq.js` én in `SYSTEM_PROMPT` in `worker/index.js`. Daarna `npx wrangler deploy` in de map `worker/`.
- **Model uitgefaseerd:** Cloudflare faseert modellen regelmatig uit. Krijgt de bot ineens alleen FAQ-antwoorden, kijk dan in https://developers.cloudflare.com/workers-ai/changelog/ welk model wordt aanbevolen en pas `MODEL` aan.
- **Andere site toestaan:** voeg de URL toe aan `ALLOWED_ORIGINS`.
- **Gesprek:** wordt bewaard in `sessionStorage`, dus alleen tijdens het bezoek aan de site. De resetknop in de chat wist het.
