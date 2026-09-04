/* ============================================================
   ECG1 2026-2027 — Moteur de flashcards
   - Paquets historiques [{q,a}] : Leitner historique inchangé.
   - Paquet ESH enrichi [{id,q,a,code,type,tier}] : cartes portrait,
     accès direct depuis les chapitres, flip 3D réversible et bouton Suivant.
   ============================================================ */

(function () {
  "use strict";

  var app = document.getElementById("flashcards-app");
  if (!app || typeof FLASHCARDS === "undefined" || !FLASHCARDS.length) return;

  var body = document.body;
  var DECK_ID = body.getAttribute("data-page-id") || "deck";
  var KEY = "ecg-flashcards";
  var DAY = 24 * 60 * 60 * 1000;
  var INTERVALS = [0, 1, 3, 7, 14];
  var hasMetadata = FLASHCARDS.some(function (c) { return c.code || c.type || c.tier; });
  var GROUPS = (typeof FLASHCARD_GROUPS !== "undefined") ? FLASHCARD_GROUPS : {};
  var motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var motionEnabled = !(motionQuery && motionQuery.matches);

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveAll(all) {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {}
  }

  var all = loadAll();
  var deck = all[DECK_ID] || {};

  function keyFor(i) {
    var card = FLASHCARDS[i];
    return card && card.id != null ? String(card.id) : String(i);
  }
  function stateFor(i) {
    return deck[keyFor(i)] || { box: 0, due: 0, seen: 0, correct: 0 };
  }
  function setState(i, box, due, knewIt) {
    var old = stateFor(i);
    deck[keyFor(i)] = {
      box: box,
      due: due,
      seen: (old.seen || 0) + 1,
      correct: (old.correct || 0) + (knewIt ? 1 : 0)
    };
    all[DECK_ID] = deck;
    saveAll(all);
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function shuffle(arr) {
    for (var k = arr.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var tmp = arr[k]; arr[k] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }
  function labelType(type) {
    var map = {
      essentiel: "Essentiel", definition: "Définition", auteur: "Auteur",
      mecanisme: "Mécanisme", repere: "Repère", application: "Application"
    };
    return map[type] || type || "Carte";
  }
  function labelTier(tier) {
    return tier === "indispensable" ? "Indispensable" : tier === "consolidation" ? "Consolidation" : (tier || "");
  }
  function groupLabel(code) {
    return GROUPS[code] ? GROUPS[code].title : code;
  }
  function typesetMath() {
    if (typeof renderMathInElement === "function") {
      try {
        renderMathInElement(app, {
          delimiters: [
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false }
          ],
          throwOnError: false
        });
      } catch (e) {}
    }
  }

  /* ---------- Compatibilité des anciens paquets ---------- */
  function runLegacy() {
    var now = Date.now();
    var order = shuffle(FLASHCARDS.map(function (_, i) { return i; }).filter(function (i) {
      return stateFor(i).due <= now;
    }));
    var pos = 0;
    var revealed = false;
    var done = 0;

    function render() {
      if (pos >= order.length) {
        app.innerHTML = '<div class="box thm"><span class="box-title">Session terminée</span><p>' + done + ' carte(s) révisée(s).</p><button id="fc-restart" class="btn" type="button">Recommencer</button></div>';
        var restart = document.getElementById("fc-restart");
        if (restart) restart.addEventListener("click", function () { location.reload(); });
        return;
      }
      var i = order[pos];
      var card = FLASHCARDS[i];
      var st = stateFor(i);
      app.innerHTML = '<div class="box def" style="min-height:7rem"><span class="box-title">Carte ' + (pos + 1) + ' / ' + order.length + ' <span class="muted small">(boîte ' + (st.box + 1) + '/5)</span></span><p style="font-size:1.05rem">' + card.q + '</p>' + (revealed ? '<div class="corrige" style="margin-top:.8rem">' + card.a + '</div>' : '') + '</div>' + (revealed ? '<p><button id="fc-again" class="btn" type="button">Je ne savais pas</button> <button id="fc-good" class="btn" type="button">Je savais</button></p>' : '<p><button id="fc-reveal" class="btn" type="button">Voir la réponse</button></p>');
      typesetMath();
      var reveal = document.getElementById("fc-reveal");
      if (reveal) reveal.addEventListener("click", function () { revealed = true; render(); });
      var good = document.getElementById("fc-good");
      var again = document.getElementById("fc-again");
      if (good) good.addEventListener("click", function () { answer(i, true); });
      if (again) again.addEventListener("click", function () { answer(i, false); });
    }

    function answer(i, knewIt) {
      var st = stateFor(i);
      var newBox = knewIt ? Math.min(st.box + 1, INTERVALS.length - 1) : 0;
      setState(i, newBox, Date.now() + INTERVALS[newBox] * DAY, knewIt);
      done++;
      pos++;
      revealed = false;
      render();
    }

    var legacyCounter = document.getElementById("flashcards-counter");
    if (legacyCounter) legacyCounter.textContent = order.length + " carte(s) à réviser aujourd’hui sur " + FLASHCARDS.length + ".";
    render();
  }

  if (!hasMetadata) {
    runLegacy();
    return;
  }

  /* ---------- ESH : paquet simple, sans notation ---------- */
  var params = new URLSearchParams(window.location.search);
  var codes = (params.get("codes") || "").split(",").map(function (v) { return v.trim(); }).filter(Boolean);
  var codeSet = {};
  codes.forEach(function (code) { codeSet[code] = true; });
  var from = safeLocalReturn(params.get("from"));
  var order = [];
  var pos = 0;
  var revealed = false;
  var doneCount = 0;
  var transitionLocked = false;

  function safeLocalReturn(value) {
    if (!value) return "";
    return /^[A-Za-z0-9._-]+\.html(?:#[A-Za-z0-9_-]+)?$/.test(value) ? value : "";
  }

  function matchesTarget(i) {
    var card = FLASHCARDS[i];
    return !codes.length || !!codeSet[card.code];
  }
  function matchingIndices() {
    return FLASHCARDS.map(function (_, i) { return i; }).filter(matchesTarget);
  }
  function buildOrder() {
    order = shuffle(matchingIndices());
    pos = 0;
    revealed = false;
    doneCount = 0;
  }
  function selectionTotal() {
    return matchingIndices().length;
  }

  function updatePageContext() {
    var kicker = document.getElementById("fc-context-kicker");
    var title = document.getElementById("fc-context-title");
    var copy = document.getElementById("fc-context-copy");
    if (!kicker || !title || !copy) return;

    if (codes.length === 1) {
      kicker.textContent = "Programme officiel · " + codes[0];
      title.textContent = groupLabel(codes[0]);
      copy.textContent = selectionTotal() + " cartes du chapitre. Touchez la carte pour voir la réponse, puis touchez-la encore pour revenir à la question.";
    } else if (codes.length > 1) {
      kicker.textContent = "Flashcards du chapitre";
      title.textContent = "Révision ciblée";
      copy.textContent = selectionTotal() + " cartes · " + codes.join(" · ") + ". Chaque carte peut être retournée autant de fois que nécessaire.";
    } else {
      kicker.textContent = "Programme officiel ECG1";
      title.textContent = "Les 102 flashcards ESH";
      copy.textContent = "Révision générale de l’ESH : retourne librement chaque carte, puis passe à la suivante.";
    }
  }

  function updateCounter() {
    var counter = document.getElementById("flashcards-counter");
    if (!counter) return;
    counter.textContent = selectionTotal() + " carte(s) dans ce paquet.";
  }

  function progressHtml() {
    if (!order.length || pos >= order.length) return "";
    var pct = Math.round((pos / order.length) * 100);
    return '<div class="fc-session-bar"><span>' + (pos + 1) + ' / ' + order.length + '</span><span>' + pct + ' %</span></div><div class="fc-progress" aria-label="Progression"><span style="width:' + pct + '%"></span></div>';
  }

  function courseHref(card) {
    if (from) return from;
    return card.code && GROUPS[card.code] && GROUPS[card.code].href ? GROUPS[card.code].href : "index.html";
  }

  function cardHtml(i) {
    var card = FLASHCARDS[i];
    var chapter = groupLabel(card.code);
    var href = courseHref(card);
    return progressHtml() +
      '<div class="fc-deck-stage">' +
        '<div id="fc-scene" class="fc-card-scene' + (revealed ? ' is-flipped' : '') + '" tabindex="0" role="button" aria-pressed="' + (revealed ? 'true' : 'false') + '" aria-label="Retourner la carte">' +
          '<div class="fc-card-rotator">' +
            '<article class="fc-face fc-face-front" aria-hidden="' + (revealed ? 'true' : 'false') + '">' +
              '<div class="fc-card-head"><span class="fc-card-code">' + esc(card.code || "ESH") + '</span><span class="fc-card-kind"><strong>' + esc(labelType(card.type)) + '</strong>' + esc(labelTier(card.tier)) + '</span></div>' +
              '<div class="fc-card-main"><p class="fc-card-chapter">' + esc(chapter) + '</p><p class="fc-question">' + card.q + '</p></div>' +
              '<div class="fc-card-foot"><span class="fc-flip-hint"><span class="fc-flip-icon">↻</span> Touchez pour retourner</span><span>Question</span></div>' +
            '</article>' +
            '<article class="fc-face fc-face-back" aria-hidden="' + (revealed ? 'false' : 'true') + '">' +
              '<div class="fc-card-head"><span class="fc-card-code">' + esc(card.code || "ESH") + '</span><span class="fc-card-kind"><strong>Réponse</strong>' + esc(labelType(card.type)) + '</span></div>' +
              '<div class="fc-card-main"><p class="fc-answer-label">Réponse attendue</p><div class="fc-answer">' + card.a + '</div></div>' +
              '<div class="fc-card-foot"><span class="fc-flip-hint"><span class="fc-flip-icon">↻</span> Touchez pour revenir</span><a class="fc-course-link" href="' + esc(href) + '">Retour au cours ↗</a></div>' +
            '</article>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="fc-actions" class="fc-actions"><button id="fc-next" class="btn" type="button">Suivant</button></div>';
  }

  function returnLinkHtml() {
    var href = from || "index.html";
    var text = from ? "Retour au chapitre" : "Retour au programme";
    return '<a class="btn" href="' + esc(href) + '">' + text + '</a>';
  }

  function emptyHtml() {
    return '<div class="box thm fc-empty"><span class="box-title">Aucune carte</span><p>Ce paquet ne contient aucune carte.</p><div class="fc-finish-actions">' + returnLinkHtml() + '</div></div>';
  }

  function finishHtml() {
    return '<div class="box thm fc-finish"><span class="box-title">Paquet terminé</span><p><strong>' + doneCount + '</strong> carte(s) parcourue(s).</p><div class="fc-finish-actions"><button id="fc-restart" class="btn" type="button">Recommencer ce paquet</button>' + returnLinkHtml() + '</div></div>';
  }

  function renderStage() {
    if (!order.length) {
      app.innerHTML = '<section class="fc-session">' + emptyHtml() + '</section>';
      bindStage();
      updateCounter();
      return;
    }
    if (pos >= order.length) {
      app.innerHTML = '<section class="fc-session">' + finishHtml() + '</section>';
      bindStage();
      updateCounter();
      return;
    }
    app.innerHTML = '<section class="fc-session">' + cardHtml(order[pos]) + '</section>';
    bindStage();
    typesetMath();
    updateCounter();
  }

  function syncFaceAccessibility(scene) {
    if (!scene) return;
    var faces = scene.querySelectorAll(".fc-face");
    if (faces.length !== 2) return;
    faces[0].setAttribute("aria-hidden", revealed ? "true" : "false");
    faces[1].setAttribute("aria-hidden", revealed ? "false" : "true");
    scene.setAttribute("aria-pressed", revealed ? "true" : "false");
  }

  function toggleFlip() {
    if (transitionLocked || pos >= order.length) return;
    revealed = !revealed;
    var scene = document.getElementById("fc-scene");
    if (!scene) return;
    scene.classList.toggle("is-flipped", revealed);
    syncFaceAccessibility(scene);
    window.setTimeout(typesetMath, motionEnabled ? 360 : 0);
  }

  function nextCard() {
    if (transitionLocked || pos >= order.length) return;
    transitionLocked = true;
    var scene = document.getElementById("fc-scene");
    var next = document.getElementById("fc-next");
    if (next) next.disabled = true;
    if (scene && motionEnabled) scene.classList.add("is-exit-next");
    window.setTimeout(function () {
      doneCount++;
      pos++;
      revealed = false;
      transitionLocked = false;
      renderStage();
    }, motionEnabled ? 280 : 0);
  }

  function bindStage() {
    var scene = document.getElementById("fc-scene");
    if (scene) {
      scene.addEventListener("click", function (event) {
        if (event.target.closest && event.target.closest("a")) return;
        toggleFlip();
      });
      scene.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleFlip();
        }
      });
    }

    var next = document.getElementById("fc-next");
    if (next) next.addEventListener("click", nextCard);

    var restart = document.getElementById("fc-restart");
    if (restart) restart.addEventListener("click", function () {
      if (transitionLocked) return;
      buildOrder();
      renderStage();
    });
  }

  if (motionQuery && motionQuery.addEventListener) {
    motionQuery.addEventListener("change", function (event) { motionEnabled = !event.matches; });
  }

  updatePageContext();
  buildOrder();
  renderStage();
})();
