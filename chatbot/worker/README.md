# Worker uitrollen (Cloudflare, gratis)

Je hebt Node.js nodig (https://nodejs.org) en een gratis Cloudflare-account (https://dash.cloudflare.com/sign-up).

```bash
cd chatbot/worker
npx wrangler login      # opent de browser, log in bij Cloudflare
npx wrangler deploy     # zet de Worker online
```

Aan het eind staat er een URL, bijvoorbeeld `https://noras-flora-chatbot.<jouw-naam>.workers.dev`.

Zet die URL in `chatbot/faq.js`:

```js
apiUrl: "https://noras-flora-chatbot.<jouw-naam>.workers.dev",
```

Ververs de site met Ctrl+Shift+R en de bot gebruikt nu de AI.

## Testen zonder website
```bash
curl -X POST <worker-url> \
  -H "Origin: http://localhost:8000" -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Zit je ook in Amersfoort?"}]}'
```

## Limieten
Bovenin `index.js`: `DAILY_LIMIT` (1000 verzoeken per dag voor de hele site) en `HOURLY_LIMIT_PER_USER` (20 per bezoeker per uur).
De tellers staan in een Durable Object (`Limiter`). IP-adressen worden alleen als hash bewaard en na het uur verwijderd.
Bij het eerste `npx wrangler deploy` na deze wijziging maakt Cloudflare het Durable Object automatisch aan.

## Aanpassen
- **Winkelinfo of regels:** `SYSTEM_PROMPT` in `index.js`. Daarna opnieuw `npx wrangler deploy`.
- **Andere website toestaan:** voeg de URL toe aan `ALLOWED_ORIGINS`.
- **Ander model:** pas `MODEL` aan (lijst in het Cloudflare-dashboard bij Workers AI).

Er is geen API-key en dus geen geheim om te lekken. Zonder `apiUrl` of als de Worker faalt, valt de chatbot terug op `faq.js`.
