/* ============================================================
   ECG1 2026-2027 — Script commun
   Thème clair/sombre, rendu KaTeX, corrigés dépliables,
   suivi de progression (localStorage), recherche globale, QCM.
   ============================================================ */

(function () {
  "use strict";

  var body = document.body;
  var ROOT = body.getAttribute("data-root") || ".";
  var PAGE_ID = body.getAttribute("data-page-id") || "";

  /* ---------- Stockage ---------- */
  function loadStore(key) {
    try { return JSON.parse(localStorage.getItem(key)) || {}; }
    catch (e) { return {}; }
  }
  function saveStore(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
  }
  var KEY_CH = "ecg-chapitres";   // { pageId: true }
  var KEY_EX = "ecg-exercices";   // { "pageId:exId": true }

  /* ---------- Thème ---------- */
  var toggle = document.getElementById("theme-toggle");
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    if (toggle) toggle.textContent = t === "dark" ? "☀️" : "🌙";
  }
  applyTheme(localStorage.getItem("ecg-theme") ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  if (toggle) {
    toggle.addEventListener("click", function () {
      var t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem("ecg-theme", t);
      applyTheme(t);
    });
  }

  /* ---------- Rendu KaTeX ---------- */
  function renderMath() {
    if (typeof renderMathInElement === "function") {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    }
  }
  if (document.readyState === "complete") { renderMath(); }
  else { window.addEventListener("load", renderMath); }

  /* ---------- Boutons « Voir le corrigé » ---------- */
  document.querySelectorAll(".btn-corrige").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.parentElement.querySelector(".corrige");
      if (!target) return;
      var hidden = target.classList.toggle("hidden");
      btn.textContent = hidden ? "Voir le corrigé" : "Masquer le corrigé";
    });
  });

  /* ---------- Progression : chapitre terminé ---------- */
  var chStore = loadStore(KEY_CH);
  var chBox = document.querySelector('input[data-progress="chapter"]');
  if (chBox && PAGE_ID) {
    chBox.checked = !!chStore[PAGE_ID];
    chBox.addEventListener("change", function () {
      chStore = loadStore(KEY_CH);
      if (chBox.checked) chStore[PAGE_ID] = true; else delete chStore[PAGE_ID];
      saveStore(KEY_CH, chStore);
    });
  }

  /* ---------- Progression : exercices réussis ---------- */
  var exStore = loadStore(KEY_EX);
  document.querySelectorAll('input[data-progress="exercise"]').forEach(function (box) {
    var exId = PAGE_ID + ":" + (box.getAttribute("data-ex") || "");
    box.checked = !!exStore[exId];
    box.addEventListener("change", function () {
      exStore = loadStore(KEY_EX);
      if (box.checked) exStore[exId] = true; else delete exStore[exId];
      saveStore(KEY_EX, exStore);
    });
  });

  /* ---------- Barres de progression (accueil) ---------- */
  if (typeof SITE_DATA !== "undefined") {
    document.querySelectorAll("[data-progress-matiere]").forEach(function (el) {
      var m = el.getAttribute("data-progress-matiere");
      var pages = SITE_DATA.pages.filter(function (p) { return p.m === m && !p.r; });
      var done = pages.filter(function (p) { return chStore[p.id]; }).length;
      var pct = pages.length ? Math.round(100 * done / pages.length) : 0;
      var fill = el.querySelector(".progress-fill");
      if (fill) fill.style.width = pct + "%";
      var label = el.querySelector(".progress-label");
      if (label) label.textContent = done + " / " + pages.length + " chapitres terminés (" + pct + " %)";
    });

    /* Coche ✓ dans les sommaires de matière */
    document.querySelectorAll(".chapter-list li[data-page]").forEach(function (li) {
      if (chStore[li.getAttribute("data-page")]) li.classList.add("is-done");
    });
  }

  /* ---------- ESH : lancer les flashcards depuis le chapitre ---------- */
  (function () {
    if (body.getAttribute("data-matiere") !== "esh" || !PAGE_ID) return;

    var ESH_FLASHCARDS_BY_PAGE = {
      "esh-ch01": ["1.1.3"],
      "esh-ch02": ["1.3.1", "1.3.2"],
      "esh-ch03": ["1.2.2", "1.2.3"],
      "esh-ch04": ["1.1.2"],
      "esh-ch05": ["1.1.1"],
      "esh-ch06": ["2.2.2"],
      "esh-ch07": ["2.1.1"],
      "esh-ch08": ["2.1.1"],
      "esh-ch09": ["2.1.2", "2.1.3"],
      "esh-ch10": ["2.2.1", "2.2.2", "2.2.3"],
      "esh-ch11": ["2.3.1", "2.3.3"],
      "esh-off-111": ["1.1.3"],
      "esh-off-121": ["1.2.1"],
      "esh-off-212": ["2.1.2"],
      "esh-off-221": ["2.2.1"],
      "esh-off-222": ["2.2.2"],
      "esh-off-232": ["2.3.2"],
      "esh-off-233": ["2.3.3"]
    };

    var codes = ESH_FLASHCARDS_BY_PAGE[PAGE_ID];
    if (!codes || !codes.length) return;
    var meta = document.querySelector(".chapter-meta");
    if (!meta || meta.querySelector(".esh-chapter-flashcards")) return;

    var currentFile = (window.location.pathname.split("/").pop() || "").replace(/[^A-Za-z0-9._-]/g, "");
    var href = ROOT + "/esh/flashcards.html?codes=" + encodeURIComponent(codes.join(",")) + "&mode=all";
    if (currentFile) href += "&from=" + encodeURIComponent(currentFile + window.location.hash);

    var link = document.createElement("a");
    link.className = "btn esh-chapter-flashcards";
    link.href = href;
    link.textContent = "Flashcards du chapitre";
    link.setAttribute("aria-label", "Lancer les flashcards de ce chapitre");
    meta.appendChild(link);
  })();

  /* ---------- Recherche globale ---------- */
  var input = document.getElementById("search");
  var results = document.getElementById("search-results");
  if (input && results && typeof SITE_DATA !== "undefined") {
    function normalize(s) {
      return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }
    function doSearch() {
      var q = normalize(input.value.trim());
      if (q.length < 2) { results.hidden = true; results.innerHTML = ""; return; }
      var out = [];
      SITE_DATA.pages.forEach(function (p) {
        var matSec = null;
        var inTitle = normalize(p.t).indexOf(q) !== -1;
        if (!inTitle) {
          for (var i = 0; i < p.s.length; i++) {
            if (normalize(p.s[i]).indexOf(q) !== -1) { matSec = p.s[i]; break; }
          }
        }
        if (inTitle || matSec) out.push({ p: p, sec: matSec });
      });
      if (!out.length) {
        results.innerHTML = '<div class="sr-empty">Aucun résultat.</div>';
        results.hidden = false;
        return;
      }
      results.innerHTML = out.slice(0, 12).map(function (r) {
        var mat = SITE_DATA.matieres[r.p.m];
        return '<a href="' + ROOT + "/" + r.p.u + '">' +
          '<span class="sr-matiere" style="color:' + mat.color + '">' + mat.name + "</span><br>" +
          r.p.t +
          (r.sec ? '<span class="sr-section">→ ' + r.sec + "</span>" : "") +
          "</a>";
      }).join("");
      results.hidden = false;
    }
    input.addEventListener("input", doSearch);
    input.addEventListener("focus", doSearch);
    document.addEventListener("click", function (e) {
      if (!input.contains(e.target) && !results.contains(e.target)) results.hidden = true;
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { results.hidden = true; input.blur(); }
    });
  }

  /* ---------- Export / import de la progression ---------- */
  var exportBtn = document.getElementById("progress-export");
  var importBtn = document.getElementById("progress-import-btn");
  var importFile = document.getElementById("progress-import-file");
  var ioMsg = document.getElementById("progress-io-msg");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      var data = {
        type: "ecg-progression",
        exportedAt: new Date().toISOString(),
        chapitres: loadStore(KEY_CH),
        exercices: loadStore(KEY_EX)
      };
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "ecg-progression-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      if (ioMsg) ioMsg.textContent = "Progression exportée.";
    });
  }
  if (importBtn && importFile) {
    importBtn.addEventListener("click", function () { importFile.click(); });
    importFile.addEventListener("change", function () {
      var file = importFile.files && importFile.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          if (!data || data.type !== "ecg-progression") throw new Error("format");
          saveStore(KEY_CH, data.chapitres || {});
          saveStore(KEY_EX, data.exercices || {});
          if (ioMsg) ioMsg.textContent = "Progression importée — rechargement…";
          setTimeout(function () { location.reload(); }, 600);
        } catch (e) {
          if (ioMsg) ioMsg.textContent = "Fichier invalide : ce n'est pas un export de progression ECG1.";
        }
      };
      reader.readAsText(file);
      importFile.value = "";
    });
  }

  /* ---------- QCM auto-corrigés ---------- */
  document.querySelectorAll(".qcm-q").forEach(function (q) {
    q.querySelectorAll("input[type=radio]").forEach(function (radio) {
      radio.addEventListener("change", function () {
        q.classList.add("answered");
        q.querySelectorAll("label").forEach(function (lab) {
          lab.classList.remove("correct", "incorrect");
          var inp = lab.querySelector("input");
          if (!inp) return;
          if (inp.hasAttribute("data-correct")) lab.classList.add("correct");
          else if (inp.checked) lab.classList.add("incorrect");
        });
      });
    });
  });

  /* ---------- Bouton « retour en haut » ---------- */
  (function () {
    var btn = document.createElement("button");
    btn.id = "back-to-top";
    btn.type = "button";
    btn.setAttribute("aria-label", "Retour en haut de la page");
    btn.textContent = "↑";
    document.body.appendChild(btn);
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function toggle() {
      if (window.scrollY > 600) btn.classList.add("show");
      else btn.classList.remove("show");
    }
    window.addEventListener("scroll", toggle, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    toggle();
  })();

  /* ---------- Service worker (installable + hors-ligne) ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      var root = (document.body && document.body.dataset.root) || ".";
      navigator.serviceWorker.register(root + "/sw.js").catch(function () {});
    });
  }
})();
