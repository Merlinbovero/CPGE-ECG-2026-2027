/* Mon espace — emploi du temps (glisser-déposer + tap) et notes/moyennes.
   100% local : tout est enregistré dans le navigateur (localStorage). Aucun mot de passe. */
(function () {
  "use strict";

  var EDT_KEY = "ecg-edt";
  var NOTES_KEY = "ecg-notes";

  var JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  var HEURES = [];
  for (var h = 8; h < 19; h++) HEURES.push(h);   // créneaux 8h→9h ... 18h→19h

  // matières de l'emploi du temps (palette)
  var MATIERES = [
    { id: "maths", nom: "Maths appliquées", c: "#2563eb" },
    { id: "esh", nom: "ESH", c: "#0f8a6d" },
    { id: "cg", nom: "Culture générale", c: "#7c3aed" },
    { id: "anglais", nom: "Anglais", c: "#c0264b" },
    { id: "italien", nom: "Italien", c: "#d97706" },
    { id: "eps", nom: "EPS", c: "#0d9488" },
    { id: "colle", nom: "Colle", c: "#6366f1" },
    { id: "ds", nom: "DS", c: "#ef4444" },
    { id: "etude", nom: "Étude", c: "#64748b" },
    { id: "autre", nom: "Autre", c: "#78716c" }
  ];
  function mat(id) { for (var i = 0; i < MATIERES.length; i++) if (MATIERES[i].id === id) return MATIERES[i]; return null; }

  // matières notées
  var MAT_NOTES = [
    { id: "maths", nom: "Maths appliquées", c: "#2563eb", coef: 8 },
    { id: "esh", nom: "ESH", c: "#0f8a6d", coef: 8 },
    { id: "cg", nom: "Culture générale", c: "#7c3aed", coef: 6 },
    { id: "anglais", nom: "Anglais (LVA)", c: "#c0264b", coef: 3 },
    { id: "italien", nom: "Italien (LVB)", c: "#d97706", coef: 3 },
    { id: "eps", nom: "EPS", c: "#0d9488", coef: 1 }
  ];

  function loadJSON(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
  function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  // ============ EMPLOI DU TEMPS ============
  var edt = loadJSON(EDT_KEY, {});      // { "Lundi-8": "maths", ... }
  var selection = null;                 // matière sélectionnée (mode tap)
  var gomme = false;

  function edtInit() {
    var pal = document.getElementById("edt-palette");
    var grid = document.getElementById("edt-grid");
    if (!pal || !grid) return;

    // palette
    var ph = "";
    for (var i = 0; i < MATIERES.length; i++) {
      var m = MATIERES[i];
      ph += '<button class="edt-chip" draggable="true" data-subj="' + m.id + '" style="--c:' + m.c + '">' + m.nom + "</button>";
    }
    ph += '<button class="edt-chip edt-gomme" data-gomme="1">🧽 Gomme</button>';
    pal.innerHTML = ph;

    // grille
    var gh = '<div class="edt-cell edt-corner"></div>';
    for (var d = 0; d < JOURS.length; d++) gh += '<div class="edt-cell edt-head">' + JOURS[d] + "</div>";
    for (var hi = 0; hi < HEURES.length; hi++) {
      var hr = HEURES[hi];
      gh += '<div class="edt-cell edt-hour">' + hr + "h–" + (hr + 1) + "h</div>";
      for (var dj = 0; dj < JOURS.length; dj++) {
        gh += '<div class="edt-cell edt-slot" data-key="' + JOURS[dj] + "-" + hr + '"></div>';
      }
    }
    grid.innerHTML = gh;
    grid.style.setProperty("--cols", JOURS.length);

    // remplir
    edtRenderAll();

    // événements palette
    var chips = pal.querySelectorAll(".edt-chip");
    for (var k = 0; k < chips.length; k++) {
      chips[k].addEventListener("click", function () {
        if (this.getAttribute("data-gomme")) { gomme = true; selection = null; edtHighlight(); return; }
        gomme = false;
        selection = (selection === this.getAttribute("data-subj")) ? null : this.getAttribute("data-subj");
        edtHighlight();
      });
      chips[k].addEventListener("dragstart", function (e) {
        if (this.getAttribute("data-gomme")) { e.preventDefault(); return; }
        e.dataTransfer.setData("text/plain", this.getAttribute("data-subj"));
      });
    }

    // événements grille (délégation)
    grid.addEventListener("click", function (e) {
      var cell = e.target.closest(".edt-slot"); if (!cell) return;
      var key = cell.getAttribute("data-key");
      if (gomme) { delete edt[key]; }
      else if (selection) { edt[key] = selection; }
      else { delete edt[key]; }   // sans sélection : clic = effacer
      saveJSON(EDT_KEY, edt); edtRenderCell(cell, key);
    });
    grid.addEventListener("dragover", function (e) { if (e.target.closest(".edt-slot")) e.preventDefault(); });
    grid.addEventListener("drop", function (e) {
      var cell = e.target.closest(".edt-slot"); if (!cell) return;
      e.preventDefault();
      var subj = e.dataTransfer.getData("text/plain");
      if (subj && mat(subj)) { edt[cell.getAttribute("data-key")] = subj; saveJSON(EDT_KEY, edt); edtRenderCell(cell, cell.getAttribute("data-key")); }
    });

    document.getElementById("edt-reset").addEventListener("click", function () {
      if (confirm("Effacer tout l'emploi du temps ?")) { edt = {}; saveJSON(EDT_KEY, edt); edtRenderAll(); }
    });
  }

  function edtHighlight() {
    var chips = document.querySelectorAll("#edt-palette .edt-chip");
    for (var i = 0; i < chips.length; i++) {
      var isSel = chips[i].getAttribute("data-subj") === selection || (gomme && chips[i].getAttribute("data-gomme"));
      chips[i].classList.toggle("sel", !!isSel);
    }
    var hint = document.getElementById("edt-hint");
    if (hint) hint.textContent = gomme ? "Mode gomme : clique une case pour l'effacer."
      : selection ? "« " + mat(selection).nom + " » sélectionné : clique les cases pour le poser."
      : "Sélectionne une matière (ou fais-la glisser) puis clique une case. Clic sur une case = effacer.";
  }
  function edtRenderCell(cell, key) {
    var id = edt[key];
    if (id && mat(id)) { var m = mat(id); cell.innerHTML = '<span class="edt-item" style="background:' + m.c + '">' + m.nom + "</span>"; cell.classList.add("filled"); }
    else { cell.innerHTML = ""; cell.classList.remove("filled"); }
  }
  function edtRenderAll() {
    var cells = document.querySelectorAll(".edt-slot");
    for (var i = 0; i < cells.length; i++) edtRenderCell(cells[i], cells[i].getAttribute("data-key"));
    edtHighlight();
  }

  // ============ NOTES & MOYENNES ============
  function defaultNotes() {
    return { decoupage: "sem", period: "S1", data: {} };
  }
  var notes = loadJSON(NOTES_KEY, defaultNotes());
  if (!notes.data) notes = defaultNotes();

  function periods() { return notes.decoupage === "tri" ? ["T1", "T2", "T3"] : ["S1", "S2"]; }
  function periodLabel(p) { return { S1: "Semestre 1", S2: "Semestre 2", T1: "Trimestre 1", T2: "Trimestre 2", T3: "Trimestre 3" }[p] || p; }

  function ensurePeriod(p) {
    if (!notes.data[p]) {
      notes.data[p] = {};
      for (var i = 0; i < MAT_NOTES.length; i++) notes.data[p][MAT_NOTES[i].id] = { coef: MAT_NOTES[i].coef, notes: [] };
    }
    // compléter les matières manquantes
    for (var j = 0; j < MAT_NOTES.length; j++) {
      if (!notes.data[p][MAT_NOTES[j].id]) notes.data[p][MAT_NOTES[j].id] = { coef: MAT_NOTES[j].coef, notes: [] };
    }
    return notes.data[p];
  }

  function subjectAverage(entry) {
    var num = 0, den = 0;
    for (var i = 0; i < entry.notes.length; i++) {
      var n = entry.notes[i];
      var v = parseFloat(n.v), sur = parseFloat(n.sur), c = parseFloat(n.c);
      if (isNaN(v) || isNaN(sur) || sur <= 0) continue;
      if (isNaN(c) || c < 0) c = 1;
      num += (v / sur * 20) * c; den += c;
    }
    return den > 0 ? num / den : null;
  }

  function notesInit() {
    if (!document.getElementById("notes-app")) return;
    // sélecteur découpage
    var seg = document.getElementById("notes-decoupage");
    seg.value = notes.decoupage;
    seg.addEventListener("change", function () {
      notes.decoupage = this.value;
      var ps = periods();
      if (ps.indexOf(notes.period) === -1) notes.period = ps[0];
      saveJSON(NOTES_KEY, notes); notesRender();
    });
    notesRender();
  }

  function notesRender() {
    var app = document.getElementById("notes-app");
    var ps = periods();
    // onglets périodes
    var tabs = '<div class="notes-tabs">';
    for (var i = 0; i < ps.length; i++) {
      tabs += '<button class="notes-tab' + (ps[i] === notes.period ? " active" : "") + '" data-p="' + ps[i] + '">' + periodLabel(ps[i]) + "</button>";
    }
    tabs += "</div>";

    var data = ensurePeriod(notes.period);
    var rows = "";
    for (var m = 0; m < MAT_NOTES.length; m++) {
      var sub = MAT_NOTES[m], entry = data[sub.id];
      var moy = subjectAverage(entry);
      var notesHtml = "";
      for (var k = 0; k < entry.notes.length; k++) {
        var n = entry.notes[k];
        notesHtml += '<span class="note-row" data-sub="' + sub.id + '" data-i="' + k + '">' +
          '<input class="note-v" type="number" step="0.25" min="0" placeholder="note" value="' + (n.v != null ? n.v : "") + '">' +
          '<span class="note-sep">/</span>' +
          '<input class="note-sur" type="number" step="1" min="1" value="' + (n.sur != null ? n.sur : 20) + '">' +
          '<span class="note-x">×</span>' +
          '<input class="note-c" type="number" step="0.5" min="0" value="' + (n.c != null ? n.c : 1) + '" title="coefficient de la note">' +
          '<button class="note-del" title="Supprimer cette note">✕</button></span>';
      }
      rows += '<div class="note-subject" style="--c:' + sub.c + '">' +
        '<div class="note-subj-head"><span class="note-subj-name">' + sub.nom + "</span>" +
        '<label class="note-coef">coef. matière <input class="coef-in" type="number" step="0.5" min="0" data-sub="' + sub.id + '" value="' + entry.coef + '"></label>' +
        '<span class="note-moy">' + (moy != null ? "Moyenne : <strong>" + moy.toFixed(2) + "</strong>/20" : "—") + "</span></div>" +
        '<div class="note-list">' + notesHtml + '<button class="note-add" data-sub="' + sub.id + '">+ ajouter une note</button></div>' +
        "</div>";
    }

    // moyenne générale
    var gnum = 0, gden = 0;
    for (var g = 0; g < MAT_NOTES.length; g++) {
      var e2 = data[MAT_NOTES[g].id], a = subjectAverage(e2), co = parseFloat(e2.coef);
      if (a != null && !isNaN(co) && co > 0) { gnum += a * co; gden += co; }
    }
    var gen = gden > 0 ? (gnum / gden).toFixed(2) : "—";

    app.innerHTML = tabs +
      '<div class="notes-grid">' + rows + "</div>" +
      '<div class="notes-general"><span>Moyenne générale (' + periodLabel(notes.period) + ')</span><strong>' + gen + (gen !== "—" ? " / 20" : "") + "</strong></div>" +
      '<p class="small muted">Astuce : chaque note peut avoir son propre coefficient (×) et son barème (/20, /40…). Le coefficient « matière » pondère la moyenne générale. Tout est enregistré dans ce navigateur.</p>';

    // événements
    var tabBtns = app.querySelectorAll(".notes-tab");
    for (var t = 0; t < tabBtns.length; t++) tabBtns[t].addEventListener("click", function () {
      notes.period = this.getAttribute("data-p"); saveJSON(NOTES_KEY, notes); notesRender();
    });
    var coefs = app.querySelectorAll(".coef-in");
    for (var c2 = 0; c2 < coefs.length; c2++) coefs[c2].addEventListener("input", function () {
      ensurePeriod(notes.period)[this.getAttribute("data-sub")].coef = this.value; saveJSON(NOTES_KEY, notes); notesRecalc();
    });
    var adds = app.querySelectorAll(".note-add");
    for (var ad = 0; ad < adds.length; ad++) adds[ad].addEventListener("click", function () {
      ensurePeriod(notes.period)[this.getAttribute("data-sub")].notes.push({ v: "", sur: 20, c: 1 });
      saveJSON(NOTES_KEY, notes); notesRender();
    });
    var dels = app.querySelectorAll(".note-del");
    for (var de = 0; de < dels.length; de++) dels[de].addEventListener("click", function () {
      var row = this.closest(".note-row");
      ensurePeriod(notes.period)[row.getAttribute("data-sub")].notes.splice(parseInt(row.getAttribute("data-i"), 10), 1);
      saveJSON(NOTES_KEY, notes); notesRender();
    });
    var fields = app.querySelectorAll(".note-v, .note-sur, .note-c");
    for (var f = 0; f < fields.length; f++) fields[f].addEventListener("input", function () {
      var row = this.closest(".note-row");
      var entry = ensurePeriod(notes.period)[row.getAttribute("data-sub")];
      var n = entry.notes[parseInt(row.getAttribute("data-i"), 10)];
      if (this.classList.contains("note-v")) n.v = this.value;
      else if (this.classList.contains("note-sur")) n.sur = this.value;
      else n.c = this.value;
      saveJSON(NOTES_KEY, notes); notesRecalc();
    });
    var reset = document.getElementById("notes-reset");
    if (reset && !reset._bound) { reset._bound = true; reset.addEventListener("click", function () {
      if (confirm("Effacer toutes les notes de toutes les périodes ?")) { notes = defaultNotes(); saveJSON(NOTES_KEY, notes); notesRender(); }
    }); }
  }

  // recalcul léger des moyennes sans tout redessiner (pour ne pas perdre le focus)
  function notesRecalc() {
    var app = document.getElementById("notes-app");
    var data = ensurePeriod(notes.period);
    var subs = app.querySelectorAll(".note-subject");
    var gnum = 0, gden = 0;
    for (var m = 0; m < MAT_NOTES.length; m++) {
      var entry = data[MAT_NOTES[m].id], a = subjectAverage(entry);
      var moyEl = subs[m] ? subs[m].querySelector(".note-moy") : null;
      if (moyEl) moyEl.innerHTML = (a != null ? "Moyenne : <strong>" + a.toFixed(2) + "</strong>/20" : "—");
      var co = parseFloat(entry.coef);
      if (a != null && !isNaN(co) && co > 0) { gnum += a * co; gden += co; }
    }
    var gen = gden > 0 ? (gnum / gden).toFixed(2) : "—";
    var genEl = app.querySelector(".notes-general strong");
    if (genEl) genEl.textContent = gen + (gen !== "—" ? " / 20" : "");
  }

  function init() { edtInit(); notesInit(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
