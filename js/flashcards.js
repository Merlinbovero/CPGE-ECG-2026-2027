/* ============================================================
   ECG1 2026-2027 — Moteur de flashcards à répétition espacée
   Vanilla JS, sans dépendance. Leitner à 5 boîtes.
   Compatible avec les anciens paquets [{q,a}] et avec les paquets
   enrichis [{id,q,a,code,type,tier}] utilisés par l'ESH.
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
  var transitionLocked = false;

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
      .replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function uniq(values) {
    var seen = {};
    return values.filter(function (v) {
      if (!v || seen[v]) return false;
      seen[v] = true; return true;
    });
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

  var filters = { code: "all", type: "all", tier: "all", mode: "due" };
  var order = [];
  var pos = 0;
  var revealed = false;
  var doneCount = 0;
  var wrongCount = 0;

  function matches(i, includeDue) {
    var c = FLASHCARDS[i];
    if (filters.code !== "all" && c.code !== filters.code) return false;
    if (filters.type !== "all" && c.type !== filters.type) return false;
    if (filters.tier !== "all" && c.tier !== filters.tier) return false;
    if (includeDue && stateFor(i).due > Date.now()) return false;
    return true;
  }

  function matchingIndices(includeDue) {
    return FLASHCARDS.map(function (_, i) { return i; }).filter(function (i) { return matches(i, includeDue); });
  }

  function buildOrder() {
    var dueOnly = filters.mode === "due";
    order = shuffle(matchingIndices(dueOnly));
    pos = 0; revealed = false; doneCount = 0; wrongCount = 0;
  }

  function statsForCurrentFilter() {
    var allMatching = matchingIndices(false);
    var due = allMatching.filter(function (i) { return stateFor(i).due <= Date.now(); });
    var mastered = allMatching.filter(function (i) { return stateFor(i).box >= 3; });
    return { total: allMatching.length, due: due.length, mastered: mastered.length };
  }

  function optionsHtml(values, current, labelFn) {
    return ['<option value="all">Tous</option>'].concat(values.map(function (v) {
      return '<option value="' + esc(v) + '"' + (v === current ? ' selected' : '') + '>' + esc(labelFn ? labelFn(v) : v) + '</option>';
    })).join("");
  }

  function controlsHtml() {
    if (!hasMetadata) return "";
    var codes = Object.keys(GROUPS).length ? Object.keys(GROUPS) : uniq(FLASHCARDS.map(function (c) { return c.code; }));
    var types = uniq(FLASHCARDS.map(function (c) { return c.type; }));
    var tiers = uniq(FLASHCARDS.map(function (c) { return c.tier; }));
    var st = statsForCurrentFilter();
    return '<section class="fc-dashboard" aria-label="Filtres des flashcards">' +
      '<div class="fc-dashboard-head"><div><span class="fc-eyebrow">Session personnalisée</span><strong>' + st.due + ' à revoir · ' + st.mastered + ' maîtrisées · ' + st.total + ' sélectionnées</strong></div>' +
      '<button id="fc-start" class="btn" type="button">Lancer la session</button></div>' +
      '<div class="fc-filters">' +
      '<label>Sous-partie<select id="fc-code">' + optionsHtml(codes, filters.code, function (v) { return v + ' — ' + groupLabel(v); }) + '</select></label>' +
      '<label>Type<select id="fc-type">' + optionsHtml(types, filters.type, labelType) + '</select></label>' +
      '<label>Niveau<select id="fc-tier">' + optionsHtml(tiers, filters.tier, labelTier) + '</select></label>' +
      '<label>Mode<select id="fc-mode"><option value="due"' + (filters.mode === "due" ? ' selected' : '') + '>À revoir aujourd’hui</option><option value="all"' + (filters.mode === "all" ? ' selected' : '') + '>Tout le paquet</option></select></label>' +
      '</div></section>';
  }

  function bindControls() {
    if (!hasMetadata) return;
    var ids = ["code", "type", "tier", "mode"];
    ids.forEach(function (name) {
      var el = document.getElementById("fc-" + name);
      if (!el) return;
      el.addEventListener("change", function () {
        filters[name] = el.value;
        renderShell(false);
      });
    });
    var start = document.getElementById("fc-start");
    if (start) start.addEventListener("click", function () {
      if (transitionLocked) return;
      buildOrder();
      renderShell(true);
    });
  }

  function progressHtml() {
    if (!order.length || pos >= order.length) return "";
    var pct = Math.round((pos / order.length) * 100);
    return '<div class="fc-progress" aria-label="Progression"><span style="width:' + pct + '%"></span></div>';
  }

  function cardMetaHtml(card) {
    if (!hasMetadata) return "";
    var link = card.code && GROUPS[card.code] && GROUPS[card.code].href ? GROUPS[card.code].href : "";
    return '<div class="fc-meta">' +
      (card.code ? '<span class="fc-code">' + esc(card.code) + '</span>' : '') +
      (card.type ? '<span>' + esc(labelType(card.type)) + '</span>' : '') +
      (card.tier ? '<span>' + esc(labelTier(card.tier)) + '</span>' : '') +
      (link ? '<a href="' + esc(link) + '">Ouvrir le cours ↗</a>' : '') +
      '</div>';
  }

  function cardClass() {
    if (!hasMetadata || !motionEnabled) return "fc-card";
    return revealed ? "fc-card fc-card-revealed" : "fc-card fc-card-enter";
  }

  function stageHtml() {
    if (!order.length) {
      var st = statsForCurrentFilter();
      return '<div class="box thm fc-empty"><span class="box-title">' + (filters.mode === "due" && st.total ? 'Rien à revoir' : 'Aucune carte') + '</span>' +
        '<p>' + (filters.mode === "due" && st.total ? 'Toutes les cartes de cette sélection sont à jour. Passe en mode « Tout le paquet » si tu veux t’entraîner quand même.' : 'Aucune carte ne correspond à ces filtres.') + '</p></div>';
    }

    if (pos >= order.length) {
      var s = statsForCurrentFilter();
      return '<div class="box thm fc-finish"><span class="box-title">Session terminée</span>' +
        '<p><strong>' + doneCount + '</strong> carte(s) travaillée(s), dont <strong>' + wrongCount + '</strong> à reprendre.</p>' +
        '<p class="small muted">Dans cette sélection : ' + s.mastered + ' maîtrisées sur ' + s.total + ' · ' + s.due + ' actuellement dues.</p>' +
        '<button id="fc-restart" class="btn" type="button">Nouvelle session</button></div>';
    }

    var i = order[pos];
    var card = FLASHCARDS[i];
    var stc = stateFor(i);
    return progressHtml() + '<div class="fc-card-wrap"><article class="' + cardClass() + '">' +
      '<div class="fc-card-top"><span>Carte ' + (pos + 1) + ' / ' + order.length + '</span><span>Boîte ' + (stc.box + 1) + '/5</span></div>' +
      cardMetaHtml(card) +
      '<div class="fc-question">' + card.q + '</div>' +
      (revealed ? '<div class="fc-answer"><span>Réponse</span>' + card.a + '</div>' : '') +
      '</article></div>' +
      '<div class="fc-actions">' +
      (revealed
        ? '<button id="fc-again" class="btn fc-again" type="button">Je ne savais pas</button><button id="fc-good" class="btn" type="button">Je savais</button>'
        : '<button id="fc-reveal" class="btn" type="button">Voir la réponse</button>') +
      '</div>';
  }

  function renderShell(sessionActive) {
    if (!sessionActive && hasMetadata) order = [];
    app.innerHTML = controlsHtml() + '<div id="fc-stage" aria-live="polite">' + (sessionActive ? stageHtml() : '<div class="fc-ready"><p>Choisis ce que tu veux réviser puis lance la session.</p></div>') + '</div>';
    bindControls();
    bindStage();
    typesetMath();
    updateCounter();
  }

  function revealAnswer() {
    if (transitionLocked) return;
    if (!hasMetadata || !motionEnabled) {
      revealed = true;
      renderShell(true);
      return;
    }
    var card = app.querySelector(".fc-card");
    if (!card) {
      revealed = true;
      renderShell(true);
      return;
    }
    transitionLocked = true;
    card.classList.remove("fc-card-enter");
    card.classList.add("fc-card-turning");
    window.setTimeout(function () {
      revealed = true;
      transitionLocked = false;
      renderShell(true);
    }, 145);
  }

  function animateAnswer(knewIt) {
    if (transitionLocked || pos >= order.length) return;
    if (!hasMetadata || !motionEnabled) {
      commitAnswer(knewIt);
      return;
    }
    var card = app.querySelector(".fc-card");
    if (!card) {
      commitAnswer(knewIt);
      return;
    }
    transitionLocked = true;
    var buttons = app.querySelectorAll(".fc-actions button");
    Array.prototype.forEach.call(buttons, function (button) { button.disabled = true; });
    card.classList.add(knewIt ? "fc-card-exit-good" : "fc-card-exit-again");
    window.setTimeout(function () {
      commitAnswer(knewIt);
      transitionLocked = false;
    }, 260);
  }

  function bindStage() {
    var reveal = document.getElementById("fc-reveal");
    if (reveal) reveal.addEventListener("click", revealAnswer);
    var good = document.getElementById("fc-good");
    var again = document.getElementById("fc-again");
    if (good) good.addEventListener("click", function () { animateAnswer(true); });
    if (again) again.addEventListener("click", function () { animateAnswer(false); });
    var restart = document.getElementById("fc-restart");
    if (restart) restart.addEventListener("click", function () {
      if (transitionLocked) return;
      order = [];
      renderShell(false);
    });
  }

  function commitAnswer(knewIt) {
    if (pos >= order.length) return;
    var i = order[pos];
    var st = stateFor(i);
    var newBox = knewIt ? Math.min(st.box + 1, INTERVALS.length - 1) : 0;
    var due = Date.now() + INTERVALS[newBox] * DAY;
    setState(i, newBox, due, knewIt);
    doneCount++;
    if (!knewIt) {
      wrongCount++;
      /* Une carte ratée revient quelques cartes plus tard dans la même session. */
      var reinsertAt = Math.min(order.length, pos + 4);
      order.splice(reinsertAt, 0, i);
    }
    pos++;
    revealed = false;
    renderShell(true);
  }

  function updateCounter() {
    var counter = document.getElementById("flashcards-counter");
    if (!counter) return;
    var dueAll = FLASHCARDS.filter(function (_, i) { return stateFor(i).due <= Date.now(); }).length;
    var masteredAll = FLASHCARDS.filter(function (_, i) { return stateFor(i).box >= 3; }).length;
    counter.textContent = dueAll + " carte(s) à revoir aujourd’hui · " + masteredAll + " maîtrisée(s) · " + FLASHCARDS.length + " au total.";
  }

  if (motionQuery && motionQuery.addEventListener) {
    motionQuery.addEventListener("change", function (event) {
      motionEnabled = !event.matches;
    });
  }

  if (hasMetadata) {
    renderShell(false);
  } else {
    filters.mode = "due";
    buildOrder();
    renderShell(true);
  }
})();
