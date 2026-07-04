/* ============================================================
   ECG1 2026-2027 — Moteur de flashcards à répétition espacée
   Vanilla JS, sans dépendance. Système de Leitner à 5 boîtes.
   Attend un tableau global FLASHCARDS = [{q, a}, ...] et un
   conteneur <div id="flashcards-app"> défini par la page hôte.
   ============================================================ */

(function () {
  "use strict";

  var app = document.getElementById("flashcards-app");
  if (!app || typeof FLASHCARDS === "undefined" || !FLASHCARDS.length) return;

  var body = document.body;
  var DECK_ID = body.getAttribute("data-page-id") || "deck";
  var KEY = "ecg-flashcards";
  var DAY = 24 * 60 * 60 * 1000;
  var INTERVALS = [0, 1, 3, 7, 14]; // jours avant relecture selon la boîte (0 = boîte 1)

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveAll(all) {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {}
  }
  var all = loadAll();
  var deck = all[DECK_ID] || {};

  function stateFor(i) {
    return deck[i] || { box: 0, due: 0 };
  }
  function setState(i, box, due) {
    deck[i] = { box: box, due: due };
    all[DECK_ID] = deck;
    saveAll(all);
  }

  var now = Date.now();
  var order = FLASHCARDS.map(function (_, i) { return i; })
    .filter(function (i) { return stateFor(i).due <= now; });
  // Mélange léger pour ne pas réviser toujours dans le même ordre
  for (var k = order.length - 1; k > 0; k--) {
    var j = Math.floor(Math.random() * (k + 1));
    var tmp = order[k]; order[k] = order[j]; order[j] = tmp;
  }

  var pos = 0;
  var revealed = false;
  var doneCount = 0;

  function totalDueToday() { return order.length; }

  function render() {
    if (pos >= order.length) {
      var doneNb = FLASHCARDS.length - dueRemainingAfterSession();
      app.innerHTML =
        '<div class="box thm">' +
        '<span class="box-title">Session terminée</span>' +
        "<p>" + doneCount + " carte(s) révisée(s). " +
        (dueRemainingAfterSession() > 0
          ? dueRemainingAfterSession() + " carte(s) restent à revoir aujourd'hui."
          : "Aucune carte à revoir aujourd'hui — bravo !") +
        "</p>" +
        '<button id="fc-restart" class="btn" type="button">Recommencer une session</button>' +
        "</div>";
      var restart = document.getElementById("fc-restart");
      if (restart) restart.addEventListener("click", function () { location.reload(); });
      return;
    }
    var i = order[pos];
    var card = FLASHCARDS[i];
    var st = stateFor(i);
    app.innerHTML =
      '<div class="box def" style="min-height:7rem">' +
      '<span class="box-title">Carte ' + (pos + 1) + " / " + order.length +
      ' <span class="muted small">(boîte ' + (st.box + 1) + '/5)</span></span>' +
      '<p style="font-size:1.05rem">' + card.q + "</p>" +
      (revealed ? '<div class="corrige" style="margin-top:.8rem">' + card.a + "</div>" : "") +
      "</div>" +
      (revealed
        ? '<p><button id="fc-again" class="btn" type="button" style="background:var(--box-warn-border)">Je ne savais pas</button>' +
          '<button id="fc-good" class="btn" type="button">Je savais</button></p>'
        : '<p><button id="fc-reveal" class="btn" type="button">Voir la réponse</button></p>');

    var revealBtn = document.getElementById("fc-reveal");
    if (revealBtn) revealBtn.addEventListener("click", function () { revealed = true; render(); });
    var goodBtn = document.getElementById("fc-good");
    var againBtn = document.getElementById("fc-again");
    if (goodBtn) goodBtn.addEventListener("click", function () { answer(i, true); });
    if (againBtn) againBtn.addEventListener("click", function () { answer(i, false); });
  }

  function dueRemainingAfterSession() {
    var t = Date.now();
    return FLASHCARDS.filter(function (_, i) { return stateFor(i).due <= t; }).length;
  }

  function answer(i, knewIt) {
    var st = stateFor(i);
    var newBox = knewIt ? Math.min(st.box + 1, INTERVALS.length - 1) : 0;
    var due = Date.now() + INTERVALS[newBox] * DAY;
    setState(i, newBox, due);
    doneCount++;
    pos++;
    revealed = false;
    render();
  }

  var counter = document.getElementById("flashcards-counter");
  if (counter) {
    counter.textContent = totalDueToday() + " carte(s) à réviser aujourd'hui sur " + FLASHCARDS.length + " au total.";
  }

  render();
})();
