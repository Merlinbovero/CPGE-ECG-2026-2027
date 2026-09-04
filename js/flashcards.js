/* ============================================================
   ECG1 2026-2027 — Moteur de flashcards à répétition espacée
   Vanilla JS, sans dépendance. Leitner à 5 boîtes.
   - Paquets historiques [{q,a}] : fonctionnement classique.
   - Paquet ESH enrichi [{id,q,a,code,type,tier}] : cartes portrait,
     lancement direct depuis le chapitre et vrai retournement 3D.
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

  /* ---------- ESH : session ciblée ou révision générale ---------- */
  var params = new URLSearchParams(window.location.search);
  var codes = (params.get("codes") || "").split(",").map(function (v) { return v.trim(); }).filter(Boolean);
  var codeSet = {};
  codes.forEach(function (code) { codeSet[code] = true; });
  var requestedMode = params.get("mode");
  var mode = requestedMode === "all" ? "all" : requestedMode === "due" ? "due" : (codes.length ? "all" : "due");
  var from = safeLocalReturn(params.get("from"));
  var order = [];
  var pos = 0;
  var revealed = false;
  var doneCount = 0;
  var wrongCount = 0;
  var transitionLocked = false;

  function safeLocalReturn(value) {
    if (!value) return "";
    try { value = decodeURIComponent(value); } catch (e) {}
    return /^[A-Za-z0-9._-]+\.html(?:#[A-Za-z0-9_-]+)?$/.test(value) ? value : "";
  }

  function matchesTarget(i, dueOnly) {
    var card = FLASHCARDS[i];
    if (codes.length && !codeSet[card.code]) return false;
    if (dueOnly && stateFor(i).due > Date.now()) return false;
    return true;
  }
  function matchingIndices(dueOnly) {
    return FLASHCARDS.map(function (_, i) { return i; }).filter(function (i) { return matchesTarget(i, dueOnly); });
  }
  function buildOrder() {
    order = shuffle(matchingIndices(mode === "due"));
    pos = 0;
    revealed = false;
    doneCount = 0;
    wrongCount = 0;
  }
  function selectionTotal() {
    return matchingIndices(false).length;
  }
  function selectionMastered() {
    return matchingIndices(false).filter(function (i) { return stateFor(i).box >= 3; }).length;
  }
  function selectionDue() {
    return matchingIndices(false).filter(function (i) { return stateFor(i).due <= Date.now(); }).length;
  }

  function updatePageContext() {
    var kicker = document.getElementById("fc-context-kicker");
    var title = document.getElementById("fc-context-title");
    var copy = document.getElementById("fc-context-copy");
    if (!kicker || !title || !copy) return;

    if (codes.length === 1) {
      kicker.textContent = "Programme officiel · " + codes[0];
      title.textContent = groupLabel(codes[0]);
      copy.textContent = selectionTotal() + " cartes du chapitre. Retourne chaque carte, puis indique si tu savais répondre.";
    } else if (codes.length > 1) {
      kicker.textContent = "Flashcards du chapitre";
      title.textContent = "Révision ciblée";
      copy.textContent = selectionTotal() + " cartes · " + codes.join(" · ") + ". Le paquet a été ouvert directement depuis ton cours.";
    } else if (mode === "all") {
      kicker.textContent = "Programme officiel ECG1";
      title.textContent = "Les 102 flashcards ESH";
      copy.textContent = "Révision générale de tout le programme, sans filtre intermédiaire.";
    } else {
      kicker.textContent = "Répétition espacée";
      title.textContent = "Révision du jour";
      copy.textContent = "Les cartes arrivées à échéance aujourd’hui sont sélectionnées automatiquement.";
    }
  }

  function updateCounter() {
    var counter = document.getElementById("flashcards-counter");
    if (!counter) return;
    counter.textContent = selectionDue() + " à revoir aujourd’hui · " + selectionMastered() + " maîtrisées · " + selectionTotal() + " dans ce paquet.";
  }

  function progressHtml() {
    if (!order.length || pos >= order.length) return "";
    var pct = Math.round((pos / order.length) * 100);
    return '<div class="fc-session-bar"><span>' + (pos + 1) + ' / ' + order.length + '</span><span>' + Math.round(pct) + ' %</span></div><div class="fc-progress" aria-label="Progression"><span style="width:' + pct + '%"></span></div>';
  }

  function courseHref(card) {
    if (from) return from;
    return card.code && GROUPS[card.code] && GROUPS[card.code].href ? GROUPS[card.code].href : "index.html";
  }

  function cardHtml(i) {
    var card = FLASHCARDS[i];
    var st = stateFor(i);
    var chapter = groupLabel(card.code);
    var href = courseHref(card);
    return progressHtml() +
      '<div class="fc-deck-stage">' +
        '<div id="fc-scene" class="fc-card-scene' + (revealed ? ' is-flipped' : '') + '" tabindex="0" role="button" aria-label="' + (revealed ? 'Réponse affichée' : 'Retourner la carte pour afficher la réponse') + '">' +
          '<div class="fc-card-rotator">' +
            '<article class="fc-face fc-face-front" aria-hidden="' + (revealed ? 'true' : 'false') + '">' +
              '<div class="fc-card-head"><span class="fc-card-code">' + esc(card.code || "ESH") + '</span><span class="fc-card-kind"><strong>' + esc(labelType(card.type)) + '</strong>' + esc(labelTier(card.tier)) + '</span></div>' +
              '<div class="fc-card-main"><p class="fc-card-chapter">' + esc(chapter) + '</p><p class="fc-question">' + card.q + '</p></div>' +
              '<div class="fc-card-foot"><span class="fc-flip-hint"><span class="fc-flip-icon">↻</span> Touchez pour retourner</span><span>Boîte ' + (st.box + 1) + '/5</span></div>' +
            '</article>' +
            '<article class="fc-face fc-face-back" aria-hidden="' + (revealed ? 'false' : 'true') + '">' +
              '<div class="fc-card-head"><span class="fc-card-code">' + esc(card.code || "ESH") + '</span><span class="fc-card-kind"><strong>Réponse</strong>' + esc(labelType(card.type)) + '</span></div>' +
              '<div class="fc-card-main"><p class="fc-answer-label">Réponse attendue</p><div class="fc-answer">' + card.a + '</div></div>' +
              '<div class="fc-card-foot"><span>' + esc(labelTier(card.tier)) + '</span><a class="fc-course-link" href="' + esc(href) + '">Retour au cours ↗</a></div>' +
            '</article>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="fc-actions" class="fc-actions">' + actionButtonsHtml() + '</div>';
  }

  function actionButtonsHtml() {
    if (revealed) {
      return '<button id="fc-again" class="btn fc-again" type="button">Je ne savais pas</button><button id="fc-good" class="btn" type="button">Je savais</button>';
    }
    return '<button id="fc-reveal" class="btn fc-reveal" type="button">Retourner la carte</button>';
  }

  function emptyHtml() {
    var total = selectionTotal();
    if (mode === "due" && total) {
      return '<div class="box thm fc-empty"><span class="box-title">Rien à revoir aujourd’hui</span><p>Toutes les cartes de ce paquet sont à jour dans le système de répétition espacée.</p><div class="fc-finish-actions"><a class="btn" href="flashcards.html' + (codes.length ? '?codes=' + encodeURIComponent(codes.join(",")) + '&mode=all' + (from ? '&from=' + encodeURIComponent(from) : '') : '?mode=all') + '">Revoir quand même</a>' + returnLinkHtml() + '</div></div>';
    }
    return '<div class="box thm fc-empty"><span class="box-title">Aucune carte</span><p>Ce paquet ne contient aucune carte.</p><div class="fc-finish-actions">' + returnLinkHtml() + '</div></div>';
  }

  function returnLinkHtml() {
    var href = from || "index.html";
    var text = from ? "Retour au chapitre" : "Retour au programme";
    return '<a class="btn" href="' + esc(href) + '">' + text + '</a>';
  }

  function finishHtml() {
    return '<div class="box thm fc-finish"><span class="box-title">Session terminée</span><p><strong>' + doneCount + '</strong> carte(s) travaillée(s), dont <strong>' + wrongCount + '</strong> à reprendre.</p><p class="small muted">' + selectionMastered() + ' cartes maîtrisées dans ce paquet.</p><div class="fc-finish-actions"><button id="fc-restart" class="btn" type="button">Recommencer ce paquet</button>' + returnLinkHtml() + '</div></div>';
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

  function revealAnswer() {
    if (transitionLocked || revealed || pos >= order.length) return;
    revealed = true;
    var scene = document.getElementById("fc-scene");
    if (scene) {
      scene.classList.add("is-flipped");
      scene.setAttribute("aria-label", "Réponse affichée");
      var faces = scene.querySelectorAll(".fc-face");
      if (faces.length === 2) {
        faces[0].setAttribute("aria-hidden", "true");
        faces[1].setAttribute("aria-hidden", "false");
      }
    }
    var actions = document.getElementById("fc-actions");
    if (actions) actions.innerHTML = actionButtonsHtml();
    bindActionButtons();
    window.setTimeout(typesetMath, motionEnabled ? 340 : 0);
  }

  function animateAnswer(knewIt) {
    if (transitionLocked || !revealed || pos >= order.length) return;
    transitionLocked = true;
    var scene = document.getElementById("fc-scene");
    var buttons = app.querySelectorAll(".fc-actions button");
    Array.prototype.forEach.call(buttons, function (button) { button.disabled = true; });
    if (scene && motionEnabled) scene.classList.add(knewIt ? "is-exit-good" : "is-exit-again");
    window.setTimeout(function () {
      commitAnswer(knewIt);
      transitionLocked = false;
    }, motionEnabled ? 310 : 0);
  }

  function commitAnswer(knewIt) {
    if (pos >= order.length) return;
    var i = order[pos];
    var st = stateFor(i);
    var newBox = knewIt ? Math.min(st.box + 1, INTERVALS.length - 1) : 0;
    setState(i, newBox, Date.now() + INTERVALS[newBox] * DAY, knewIt);
    doneCount++;
    if (!knewIt) {
      wrongCount++;
      var reinsertAt = Math.min(order.length, pos + 4);
      order.splice(reinsertAt, 0, i);
    }
    pos++;
    revealed = false;
    renderStage();
  }

  function bindActionButtons() {
    var reveal = document.getElementById("fc-reveal");
    if (reveal) reveal.addEventListener("click", revealAnswer);
    var good = document.getElementById("fc-good");
    var again = document.getElementById("fc-again");
    if (good) good.addEventListener("click", function () { animateAnswer(true); });
    if (again) again.addEventListener("click", function () { animateAnswer(false); });
  }

  function bindStage() {
    var scene = document.getElementById("fc-scene");
    if (scene) {
      scene.addEventListener("click", function (event) {
        if (event.target.closest && event.target.closest("a")) return;
        revealAnswer();
      });
      scene.addEventListener("keydown", function (event) {
        if ((event.key === "Enter" || event.key === " ") && !revealed) {
          event.preventDefault();
          revealAnswer();
        }
      });
    }
    bindActionButtons();
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
