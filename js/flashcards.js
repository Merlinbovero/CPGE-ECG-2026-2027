/* ============================================================
   ECG1 2026-2027 — Moteur de flashcards, mode livre
   Aucun niveau de maîtrise, aucune répétition espacée persistante,
   aucune progression sauvegardée. Chaque paquet est librement rejouable.
   ============================================================ */

(function () {
  "use strict";

  var app = document.getElementById("flashcards-app");
  if (!app || typeof FLASHCARDS === "undefined" || !FLASHCARDS.length) return;

  var hasMetadata = FLASHCARDS.some(function (c) { return c.code || c.type || c.tier; });
  var GROUPS = (typeof FLASHCARD_GROUPS !== "undefined") ? FLASHCARD_GROUPS : {};
  var motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var motionEnabled = !(motionQuery && motionQuery.matches);

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

  /* ---------- Paquets simples : anglais, italien, maths ---------- */
  function runSimpleDeck() {
    var order = shuffle(FLASHCARDS.map(function (_, i) { return i; }));
    var pos = 0;
    var revealed = false;
    var counter = document.getElementById("flashcards-counter");

    if (counter) counter.textContent = FLASHCARDS.length + " cartes disponibles · ordre mélangé à chaque session.";

    function render() {
      if (pos >= order.length) {
        app.innerHTML = '<div class="box thm"><span class="box-title">Fin du paquet</span><p>Tu as parcouru les ' + order.length + ' cartes. Le paquet peut être recommencé immédiatement, sans notion de carte acquise ou terminée.</p><button id="fc-restart" class="btn" type="button">Recommencer le paquet</button></div>';
        var restart = document.getElementById("fc-restart");
        if (restart) restart.addEventListener("click", function () {
          order = shuffle(FLASHCARDS.map(function (_, i) { return i; }));
          pos = 0;
          revealed = false;
          render();
        });
        return;
      }

      var card = FLASHCARDS[order[pos]];
      app.innerHTML =
        '<div class="box def" style="min-height:7rem">' +
          '<span class="box-title">Carte ' + (pos + 1) + ' / ' + order.length + '</span>' +
          '<p style="font-size:1.05rem">' + card.q + '</p>' +
          (revealed ? '<div class="corrige" style="margin-top:.8rem">' + card.a + '</div>' : '') +
        '</div>' +
        (revealed
          ? '<p><button id="fc-next" class="btn" type="button">Carte suivante</button></p>'
          : '<p><button id="fc-reveal" class="btn" type="button">Voir la réponse</button></p>');

      typesetMath();

      var reveal = document.getElementById("fc-reveal");
      if (reveal) reveal.addEventListener("click", function () {
        revealed = true;
        render();
      });

      var next = document.getElementById("fc-next");
      if (next) next.addEventListener("click", function () {
        pos++;
        revealed = false;
        render();
      });
    }

    render();
  }

  if (!hasMetadata) {
    runSimpleDeck();
    return;
  }

  /* ---------- ESH : cartes portrait et accès ciblé par chapitre ---------- */
  var params = new URLSearchParams(window.location.search);
  var codes = (params.get("codes") || "").split(",").map(function (v) { return v.trim(); }).filter(Boolean);
  var codeSet = {};
  codes.forEach(function (code) { codeSet[code] = true; });
  var from = safeLocalReturn(params.get("from"));
  var order = [];
  var pos = 0;
  var revealed = false;
  var transitionLocked = false;

  function safeLocalReturn(value) {
    if (!value) return "";
    return /^[A-Za-z0-9._-]+\.html(?:#[A-Za-z0-9_-]+)?$/.test(value) ? value : "";
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
      copy.textContent = selectionTotal() + " cartes du chapitre. Retourne chaque carte librement et reprends ce paquet autant de fois que nécessaire.";
    } else if (codes.length > 1) {
      kicker.textContent = "Flashcards du chapitre";
      title.textContent = "Révision ciblée";
      copy.textContent = selectionTotal() + " cartes · " + codes.join(" · ") + ". Aucun état de maîtrise n’est enregistré.";
    } else {
      kicker.textContent = "Programme officiel ECG1";
      title.textContent = "Les flashcards ESH";
      copy.textContent = "Révision générale de l’ESH : parcours libre, sans jauge ni statut de maîtrise.";
    }
  }

  function updateCounter() {
    var counter = document.getElementById("flashcards-counter");
    if (!counter) return;
    counter.textContent = selectionTotal() + " carte(s) disponibles dans ce paquet.";
  }

  function courseHref(card) {
    if (from) return from;
    return card.code && GROUPS[card.code] && GROUPS[card.code].href ? GROUPS[card.code].href : "index.html";
  }

  function cardHtml(i) {
    var card = FLASHCARDS[i];
    var chapter = groupLabel(card.code);
    var href = courseHref(card);

    return '<div class="fc-deck-stage">' +
        '<div id="fc-scene" class="fc-card-scene' + (revealed ? ' is-flipped' : '') + '" tabindex="0" role="button" aria-pressed="' + (revealed ? 'true' : 'false') + '" aria-label="Retourner la carte">' +
          '<div class="fc-card-rotator">' +
            '<article class="fc-face fc-face-front" aria-hidden="' + (revealed ? 'true' : 'false') + '">' +
              '<div class="fc-card-head"><span class="fc-card-code">' + esc(card.code || "ESH") + '</span><span class="fc-card-kind"><strong>' + esc(labelType(card.type)) + '</strong>' + esc(labelTier(card.tier)) + '</span></div>' +
              '<div class="fc-card-main"><p class="fc-card-chapter">' + esc(chapter) + '</p><p class="fc-question">' + card.q + '</p></div>' +
              '<div class="fc-card-foot"><span class="fc-flip-hint"><span class="fc-flip-icon">↻</span> Touchez pour retourner</span><span>Carte ' + (pos + 1) + ' / ' + order.length + '</span></div>' +
            '</article>' +
            '<article class="fc-face fc-face-back" aria-hidden="' + (revealed ? 'false' : 'true') + '">' +
              '<div class="fc-card-head"><span class="fc-card-code">' + esc(card.code || "ESH") + '</span><span class="fc-card-kind"><strong>Réponse</strong>' + esc(labelType(card.type)) + '</span></div>' +
              '<div class="fc-card-main"><p class="fc-answer-label">Réponse</p><div class="fc-answer">' + card.a + '</div></div>' +
              '<div class="fc-card-foot"><span class="fc-flip-hint"><span class="fc-flip-icon">↻</span> Touchez pour revenir</span><a class="fc-course-link" href="' + esc(href) + '">Retour au cours ↗</a></div>' +
            '</article>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="fc-actions" class="fc-actions"><button id="fc-next" class="btn" type="button">Carte suivante</button></div>';
  }

  function returnLinkHtml() {
    var href = from || "index.html";
    var text = from ? "Retour au chapitre" : "Retour au programme";
    return '<a class="btn" href="' + esc(href) + '">' + text + '</a>';
  }

  function finishHtml() {
    return '<div class="box thm fc-finish"><span class="box-title">Fin du paquet</span><p>Les ' + order.length + ' cartes ont été parcourues. Rien n’est marqué comme acquis : tu peux recommencer immédiatement.</p><div class="fc-finish-actions"><button id="fc-restart" class="btn" type="button">Recommencer ce paquet</button>' + returnLinkHtml() + '</div></div>';
  }

  function emptyHtml() {
    return '<div class="box thm fc-empty"><span class="box-title">Aucune carte</span><p>Ce paquet ne contient aucune carte.</p><div class="fc-finish-actions">' + returnLinkHtml() + '</div></div>';
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
      buildOrder();
      renderStage();
    });
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

  /* Une éventuelle ancienne mémoire Leitner est supprimée une fois pour toutes. */
  try { localStorage.removeItem("ecg-flashcards"); } catch (e) {}

  buildOrder();
  updatePageContext();
  renderStage();
})();
