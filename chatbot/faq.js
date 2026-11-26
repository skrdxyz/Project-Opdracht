/* Nora's Flora chatbot - kennisbank
 *
 * Hier pas je de vragen en antwoorden aan. De bot-code (chatbot.js) hoef je niet aan te raken.
 *
 * Per onderwerp:
 *   id        unieke naam
 *   keywords  woorden/zinsdelen waarop de bot reageert (kleine letters, zonder accenten)
 *   priority  (optioneel) hoger = wint bij gelijke score
 *   answer    het antwoord (HTML-tags <b>, <br>, <a> mogen)
 *   chip      (optioneel) tekst voor een snelkeuzeknop
 *
 * Alle info hieronder komt uit designs/Home.png. Controleer het met de klant!
 */
window.NF_CHATBOT_FAQ = {
  botName: "Flora",
  welcome:
    "Hoi! 🌷 Ik ben <b>Flora</b>, de <b>AI-assistent</b> van Nora's Flora. " +
    "Vraag me gerust iets over openingstijden, aanbiedingen of waar je ons vindt.",
  fallback:
    "Ik snap het verzoek niet 🤔. Ik ben een AI-assistent en kan alleen vragen over Nora's Flora beantwoorden. " +
    "Neem contact op met Nora, dan helpt zij je persoonlijk:<br>" +
    "📞 <a href=\"tel:0612345678\">06 12345678</a><br>" +
    "✉️ <a href=\"mailto:contact@noraflora.com\">contact@noraflora.com</a>",
  placeholder: "Typ je vraag…",
  disclaimer: "AI-assistent · antwoorden kunnen fouten bevatten",

  entries: [
    {
      id: "hallo",
      keywords: ["hallo", "hoi", "hey", "goedemorgen", "goedemiddag", "goedenavond", "dag", "hi"],
      answer: "Hoi! 🌸 Waar kan ik je mee helpen?",
    },
    {
      id: "openingstijden",
      chip: "Openingstijden",
      keywords: ["open", "openingstijden", "openingstijd", "dicht", "gesloten", "wanneer open", "hoe laat", "tijden", "uren", "zaterdag", "zondag", "maandag"],
      answer:
        "Onze openingstijden zijn:<br>" +
        "<b>Ma – Vr:</b> 12:00 – 17:00<br>" +
        "<b>Zaterdag:</b> 10:00 – 17:00<br>" +
        "Op zondag zijn we niet open.",
    },
    {
      id: "adres",
      chip: "Waar zitten jullie?",
      keywords: ["adres", "waar", "locatie", "zwolle", "route", "pannenkoekendijk", "winkel", "langskomen", "vinden", "plaats"],
      answer:
        "Je vindt Nora's Flora in <b>Zwolle</b>:<br>📍 Pannenkoekendijk 420 B",
    },
    {
      id: "telefoon",
      chip: "Telefoonnummer",
      keywords: ["telefoon", "telefoonnummer", "bellen", "nummer", "bel", "whatsapp"],
      answer: "Bel ons gerust: 📞 <a href=\"tel:0612345678\">06 12345678</a>",
    },
    {
      id: "email",
      keywords: ["email", "e-mail", "mail", "mailen", "mailadres", "bericht"],
      answer: "Mailen kan naar ✉️ <a href=\"mailto:contact@noraflora.com\">contact@noraflora.com</a>",
    },
    {
      id: "contact",
      chip: "Contact",
      keywords: ["contact", "bereiken", "spreken", "persoon", "medewerker", "mens", "eigenaar"],
      priority: 1,
      answer:
        "Je bereikt ons zo:<br>" +
        "📞 <a href=\"tel:0612345678\">06 12345678</a><br>" +
        "✉️ <a href=\"mailto:contact@noraflora.com\">contact@noraflora.com</a><br>" +
        "📍 Pannenkoekendijk 420 B, Zwolle",
    },
    {
      id: "aanbiedingen",
      chip: "Aanbiedingen",
      keywords: ["aanbieding", "aanbiedingen", "actie", "acties", "korting", "deal", "deze week", "goedkoop", "gratis", "folder", "prijs", "prijzen", "kosten", "kost", "euro", "duur"],
      answer:
        "Dit zijn onze aanbiedingen op dit moment 🌻<br>" +
        "• <b>Zonnebloemen:</b> € 2,- per bos (maandag)<br>" +
        "• <b>Rode tulpen:</b> € 3,- per bos (dinsdag)<br>" +
        "• <b>Cactus in pot:</b> 3 voor € 5,- (deze week)<br>" +
        "• <b>Vetbloemen:</b> 3 + 1 gratis (deze week)<br>" +
        "• <b>Paarse allium:</b> gratis extra bij een boeket<br>" +
        "• <b>Import gras uit Toronto:</b> speciaal deze maand",
    },
    {
      id: "zonnebloemen",
      keywords: ["zonnebloem", "zonnebloemen"],
      answer: "Zonnebloemen kosten <b>€ 2,- per bos</b> op maandag 🌻",
    },
    {
      id: "tulpen",
      keywords: ["tulp", "tulpen", "rode tulpen"],
      answer: "Rode tulpen zijn er voor <b>€ 3,- per bos</b> op dinsdag 🌷",
    },
    {
      id: "cactus",
      keywords: ["cactus", "cactussen", "cactus in pot"],
      answer: "Deze week: <b>3 cactussen in pot voor € 5,-</b> 🌵",
    },
    {
      id: "vetplanten",
      keywords: ["vetplant", "vetplanten", "vetbloem", "vetbloemen", "succulent"],
      answer: "Vetbloemen zijn deze week <b>3 + 1 gratis</b> 🪴",
    },
    {
      id: "allium",
      keywords: ["allium", "paars", "paarse"],
      answer: "Paarse allium-bloemen krijg je <b>gratis als extra bij een boeket</b> 💜",
    },
    {
      id: "gras",
      keywords: ["gras", "toronto", "canada", "import"],
      answer: "Deze maand hebben we speciaal <b>import gras uit Toronto, Canada</b> 🇨🇦",
    },
    {
      id: "assortiment",
      chip: "Assortiment",
      keywords: ["assortiment", "bloemen", "planten", "aanbod", "verkopen", "hebben jullie", "welke bloemen", "soorten", "producten", "collectie"],
      answer:
        "Bij ons vind je verse bloemen, planten, cactussen en vetplanten, plus persoonlijke boeketten. " +
        "Kijk op de <a href=\"assortimentpagina.html\">assortimentpagina</a> voor alles wat we hebben 🌼",
    },
    {
      id: "boeket",
      chip: "Boeket op maat",
      keywords: ["boeket", "bouquet", "boeketten", "bruiloft", "bruidsboeket", "verjaardag", "verrassen", "cadeau", "persoonlijk", "op maat", "samenstellen", "wensen"],
      answer:
        "Elk boeket wordt met de hand gemaakt en afgestemd op jouw wensen, met bloemen van lokale en duurzame kwekers 💐 " +
        "Vertel Nora wat je zoekt via telefoon of mail, dan stelt zij het voor je samen.",
    },
    {
      id: "over",
      chip: "Wie is Nora?",
      keywords: ["nora", "over jullie", "over ons", "verhaal", "wie zijn jullie", "wie is nora", "duurzaam", "lokaal", "kwekers"],
      answer:
        "Nora is de trotse eigenaresse van Nora's Flora. Ze stelt met veel zorg en passie elk boeket samen, " +
        "met oog voor kleur, vorm en seizoen. Haar motto: met bloemen wordt elke dag een beetje vrolijker! 🌸",
    },
    {
      id: "bot",
      keywords: ["wie ben jij", "wie ben je", "ben je een robot", "bot", "ai", "robot", "chatbot", "flora", "echt mens"],
      answer: "Ik ben Flora, een AI-assistent 🤖. Ik beantwoord veelgestelde vragen. Ben ik er niet uit, dan verwijs ik je door naar Nora.",
    },
    {
      id: "bedankt",
      keywords: ["bedankt", "dankjewel", "dank je", "thanks", "top", "super", "fijn"],
      answer: "Graag gedaan! 🌷 Fijne dag nog.",
    },
    {
      id: "doei",
      keywords: ["doei", "tot ziens", "dag dag", "bye", "doeg"],
      answer: "Tot ziens! Hopelijk tot snel in de winkel 🌸",
    },
  ],
};
