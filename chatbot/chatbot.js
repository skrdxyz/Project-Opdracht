/* Nora's Flora chatbot
 * Voeg dit toe aan een pagina (vlak voor </body>):
 *   <link rel="stylesheet" href="chatbot/chatbot.css">
 *   <script src="chatbot/chatbot.js" defer></script>
 * De rest (knop, venster, kennisbank) laadt dit script zelf.
 */
(function () {
  "use strict";
  if (window.__nfChatLoaded) return;
  window.__nfChatLoaded = true;

  // Map van dit script bepalen, zodat faq.js ook werkt vanuit elke pagina/submap.
  var me = document.currentScript || document.querySelector('script[src*="chatbot.js"]');
  var base = me && me.src ? me.src.replace(/[^\/]*$/, "") : "chatbot/";

  var STORE_KEY = "nf-chat-v1";

  function start() {
    if (window.NF_CHATBOT_FAQ) return init(window.NF_CHATBOT_FAQ);
    var s = document.createElement("script");
    s.src = base + "faq.js";
    s.onload = function () { init(window.NF_CHATBOT_FAQ); };
    s.onerror = function () { console.error("[chatbot] faq.js niet gevonden op " + s.src); };
    document.head.appendChild(s);
  }

  /* ---------------- matching ---------------- */

  function normalize(t) {
    return " " + String(t).toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ").trim() + " ";
  }

  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  function findAnswer(input, faq) {
    var text = normalize(input);
    var words = text.trim().split(" ");
    var best = null, bestScore = 0;

    faq.entries.forEach(function (entry) {
      var score = 0;
      entry.keywords.forEach(function (kw) {
        var k = normalize(kw);
        var kt = k.trim();
        if (kt.indexOf(" ") > -1) {
          // zinsdeel: moet er letterlijk in staan
          if (text.indexOf(k) > -1) score += 3;
        } else if (text.indexOf(k) > -1) {
          score += 2; // exact woord
        } else if (kt.length >= 4 && words.some(function (w) { return w.length >= 4 && (w.indexOf(kt) === 0 || kt.indexOf(w) === 0); })) {
          score += 1.5; // meervoud / verkleinwoord / begin van woord
        } else if (kt.length >= 5 && words.some(function (w) { return w.length >= 5 && lev(w, kt) <= 1; })) {
          score += 1; // typfout
        }
      });
      if (score > 0) score += (entry.priority || 0) * 0.1;
      if (score > bestScore) { bestScore = score; best = entry; }
    });

    return bestScore >= 1 ? best : null;
  }

  /* ---------------- UI ---------------- */

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function init(faq) {
    var root = el("div", "nf-chat");
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Chat met " + faq.botName);

    root.innerHTML =
      '<div class="nf-chat__panel" id="nf-chat-panel" role="dialog" aria-label="Chat met ' + faq.botName + '">' +
        '<div class="nf-chat__header">' +
          '<div class="nf-chat__avatar" aria-hidden="true">🌷</div>' +
          '<div><p class="nf-chat__title">' + faq.botName + '</p><p class="nf-chat__subtitle">AI-assistent van Nora\'s Flora</p></div>' +
          '<button class="nf-chat__reset" type="button" aria-label="Chat resetten" title="Chat resetten">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6.5 12 11V8a5 5 0 1 1-5 5H5a7 7 0 1 0 7-8z"/></svg>' +
          '</button>' +
          '<button class="nf-chat__close" type="button" aria-label="Chat sluiten">×</button>' +
        '</div>' +
        '<div class="nf-chat__messages" aria-live="polite"></div>' +
        '<div class="nf-chat__chips"></div>' +
        '<form class="nf-chat__form" autocomplete="off">' +
          '<input class="nf-chat__input" type="text" maxlength="300" placeholder="' + faq.placeholder + '" aria-label="Typ je vraag">' +
          '<button class="nf-chat__send" type="submit" aria-label="Verstuur">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>' +
          '</button>' +
        '</form>' +
        '<div class="nf-chat__disclaimer">' + faq.disclaimer + '</div>' +
      '</div>' +
      '<button class="nf-chat__toggle" type="button" aria-expanded="false" aria-controls="nf-chat-panel" aria-label="Open chat">' +
        '<svg class="nf-chat__icon-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 1-2zm3 6v2h10V9H7zm0 4v2h7v-2H7z"/></svg>' +
        '<svg class="nf-chat__icon-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"/></svg>' +
        '<span class="nf-chat__badge" aria-hidden="true"></span>' +
      '</button>';

    document.body.appendChild(root);

    var toggle = root.querySelector(".nf-chat__toggle");
    var closeBtn = root.querySelector(".nf-chat__close");
    var resetBtn = root.querySelector(".nf-chat__reset");
    var box = root.querySelector(".nf-chat__messages");
    var chipsBox = root.querySelector(".nf-chat__chips");
    var form = root.querySelector(".nf-chat__form");
    var input = root.querySelector(".nf-chat__input");

    var history = load();

    function load() {
      try { return JSON.parse(sessionStorage.getItem(STORE_KEY)) || { msgs: [], open: false }; }
      catch (e) { return { msgs: [], open: false }; }
    }
    function save() {
      try { sessionStorage.setItem(STORE_KEY, JSON.stringify(history)); } catch (e) {}
    }

    function scroll() { box.scrollTop = box.scrollHeight; }

    function addMsg(who, html, store) {
      var m = el("div", "nf-chat__msg nf-chat__msg--" + who);
      if (who === "user") m.textContent = html; else m.innerHTML = html;
      box.appendChild(m);
      scroll();
      if (store !== false) { history.msgs.push({ who: who, html: html }); save(); }
    }

    function botReply(html) {
      var typing = el("div", "nf-chat__msg nf-chat__msg--bot nf-chat__typing", "<span></span><span></span><span></span>");
      box.appendChild(typing);
      scroll();
      setTimeout(function () {
        typing.remove();
        addMsg("bot", html);
      }, 450 + Math.min(html.length * 4, 600));
    }

    function localReply(text) {
      var hit = findAnswer(text, faq);
      botReply(hit ? hit.answer : faq.fallback);
    }

    // veilig opmaken van AI-tekst: HTML escapen, **vet**, regelovergangen en links
    function formatAi(t) {
      var s = String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      s = s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
      s = s.replace(/\b(contact@noraflora\.com)\b/g, '<a href="mailto:$1">$1</a>');
      s = s.replace(/\b(06 ?12345678)\b/g, function (m) { return '<a href="tel:0612345678">' + m + "</a>"; });
      return s.replace(/\n/g, "<br>");
    }

    function plain(html) {
      var d = document.createElement("div");
      d.innerHTML = html.replace(/<br\s*\/?>/gi, "\n");
      return d.textContent;
    }

    var busy = false;

    function ask(text) {
      text = text.trim();
      if (!text || busy) return;
      addMsg("user", text);

      if (!faq.apiUrl) return localReply(text);

      busy = true;
      var typing = el("div", "nf-chat__msg nf-chat__msg--bot nf-chat__typing", "<span></span><span></span><span></span>");
      box.appendChild(typing);
      scroll();

      var messages = history.msgs.slice(-10).map(function (m) {
        return { role: m.who === "user" ? "user" : "assistant", content: plain(m.html) };
      });

      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, 20000);

      fetch(faq.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages }),
        signal: ctrl.signal,
      })
        .then(function (r) {
          if (r.status === 429) {
            return r.json().catch(function () { return {}; }).then(function (d) {
              var e = new Error("limit");
              e.limit = d.reason === "daily" ? "daily" : "hourly";
              throw e;
            });
          }
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (d) {
          if (!d.reply) throw new Error("leeg");
          typing.remove();
          addMsg("bot", formatAi(d.reply));
        })
        .catch(function (e) {
          typing.remove();
          if (e && e.limit) {
            // limiet bereikt: nette melding, geen FAQ-antwoord
            addMsg("bot", e.limit === "daily" ? faq.limitDaily : faq.limitHourly);
          } else {
            // AI niet bereikbaar: val terug op de FAQ
            localReply(text);
          }
        })
        .then(function () { clearTimeout(timer); busy = false; });
    }

    function setOpen(open, focus) {
      root.classList.toggle("nf-chat--open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Sluit chat" : "Open chat");
      history.open = open;
      if (open) { root.classList.add("nf-chat--seen"); history.seen = true; }
      save();
      if (open) {
        scroll();
        if (focus !== false) setTimeout(function () { input.focus(); }, 220);
      }
    }

    // snelkeuzeknoppen
    faq.entries.filter(function (e) { return e.chip; }).forEach(function (e) {
      var b = el("button", "nf-chat__chip");
      b.type = "button";
      b.textContent = e.chip;
      b.addEventListener("click", function () { ask(e.chip); });
      chipsBox.appendChild(b);
    });

    // gesprek herstellen of begroeten
    if (history.msgs.length) {
      history.msgs.forEach(function (m) { addMsg(m.who, m.html, false); });
    } else {
      addMsg("bot", faq.welcome);
    }
    if (history.seen) root.classList.add("nf-chat--seen");

    resetBtn.addEventListener("click", function () {
      history.msgs = [];
      save();
      box.innerHTML = "";
      addMsg("bot", faq.welcome);
      input.value = "";
      input.focus();
    });
    toggle.addEventListener("click", function () { setOpen(!root.classList.contains("nf-chat--open")); });
    closeBtn.addEventListener("click", function () { setOpen(false); toggle.focus(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("nf-chat--open")) { setOpen(false); toggle.focus(); }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = "";
      ask(v);
    });

    if (history.open) setOpen(true, false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
