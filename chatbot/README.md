# Chatbot "Flora"

## Op een pagina zetten
Plak dit vlak voor `</body>` van je pagina (in de hoofdmap van het project):

```html
<link rel="stylesheet" href="chatbot/chatbot.css">
<script src="chatbot/chatbot.js" defer></script>
```

Staat je pagina in een submap? Gebruik dan `../chatbot/...`.

## Antwoorden aanpassen
Alles staat in `faq.js`. Voeg een blok toe aan `entries` met `keywords` en een `answer`.
Test op http://localhost:8000.

## Bestanden
- `chatbot.js` – knop, venster en de logica (niet nodig om aan te passen)
- `chatbot.css` – huisstijl, alle klassen beginnen met `nf-chat`
- `faq.js` – vragen en antwoorden
