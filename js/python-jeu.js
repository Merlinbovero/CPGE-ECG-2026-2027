/* Jeu Python — 70 niveaux, exécution réelle via Pyodide, progression locale.
   Dépend de la variable globale NIVEAUX (js/python-niveaux.js). */
(function () {
  "use strict";

  var STORE = "ecg-python-jeu";
  var CODESTORE = "ecg-python-jeu-code";

  var pyWorker = null;
  var pyLoading = null;
  var rejectLoading = null;
  var pendingRun = null;
  var loadingTimer = null;
  var current = null;
  var runInProgress = false;
  var runToken = 0;
  var WORKER_URL = new URL((document.body.dataset.root || ".") + "/js/python-worker.js", document.baseURI).href;

  // ---- progression ----
  function loadProg() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; }
    catch (e) { return {}; }
  }
  function saveProg(p) { try { localStorage.setItem(STORE, JSON.stringify(p)); } catch (e) {} }
  function completed(n) { var p = loadProg(); return !!(p.done && p.done.indexOf(n) !== -1); }
  function unlockedMax() { var p = loadProg(); return p.unlocked || 1; }
  function markDone(n) {
    var p = loadProg();
    p.done = p.done || [];
    if (p.done.indexOf(n) === -1) p.done.push(n);
    p.unlocked = Math.max(p.unlocked || 1, Math.min(n + 1, NIVEAUX.length));
    saveProg(p);
  }
  function loadCode(n) {
    try { return (JSON.parse(localStorage.getItem(CODESTORE)) || {})[n]; } catch (e) { return null; }
  }
  function saveCode(n, code) {
    var m; try { m = JSON.parse(localStorage.getItem(CODESTORE)) || {}; } catch (e) { m = {}; }
    m[n] = code;
    try { localStorage.setItem(CODESTORE, JSON.stringify(m)); } catch (e) {}
  }

  function niveau(n) { for (var i = 0; i < NIVEAUX.length; i++) if (NIVEAUX[i].n === n) return NIVEAUX[i]; return null; }

  // ---- Python dans un worker interrompable ----
  function stopPython(message) {
    if (pyWorker) pyWorker.terminate();
    pyWorker = null;
    clearTimeout(loadingTimer);
    var error = new Error(message || "Exécution arrêtée. Tu peux corriger le code et réessayer.");
    if (rejectLoading) rejectLoading(error);
    rejectLoading = null;
    pyLoading = null;
    if (pendingRun) {
      clearTimeout(pendingRun.timer);
      pendingRun.reject(error);
      pendingRun = null;
    }
  }

  function ensurePyodide(onStatus) {
    if (pyLoading) return pyLoading;
    if (typeof Worker === "undefined") return Promise.reject(new Error("Ce navigateur ne prend pas en charge l’exécution Python."));
    onStatus("Chargement de Python (connexion internet requise)…");
    pyLoading = new Promise(function (resolve, reject) {
      rejectLoading = reject;
      try { pyWorker = new Worker(WORKER_URL); }
      catch (error) { rejectLoading = null; reject(error); return; }
      var worker = pyWorker;
      loadingTimer = setTimeout(function () {
        stopPython("Le chargement de Python a pris trop de temps. Vérifie la connexion puis réessaie.");
      }, 90000);
      worker.onmessage = function (event) {
        if (worker !== pyWorker) return;
        if (event.data.type === "ready") {
          clearTimeout(loadingTimer);
          rejectLoading = null;
          resolve(worker);
        } else if (event.data.type === "error") {
          stopPython(event.data.message);
        } else if (event.data.type === "results" && pendingRun) {
          var pending = pendingRun;
          pendingRun = null;
          clearTimeout(pending.timer);
          pending.resolve(event.data.results);
        }
      };
      worker.onerror = function () {
        if (worker === pyWorker) stopPython("Python a rencontré une erreur. Tu peux relancer les tests.");
      };
    });
    pyLoading = pyLoading.catch(function (error) { pyLoading = null; throw error; });
    return pyLoading;
  }

  function runTests(code, tests, onStatus) {
    return ensurePyodide(onStatus).then(function (worker) {
      onStatus("Exécution des tests…");
      return new Promise(function (resolve, reject) {
        pendingRun = { resolve: resolve, reject: reject, timer: setTimeout(function () {
          stopPython("Exécution interrompue après 8 secondes. Vérifie notamment la condition d’arrêt de tes boucles.");
        }, 8000) };
        worker.postMessage({ type: "run", code: code, tests: tests });
      });
    });
  }

  // ---- UI ----
  function palierInfo(n) {
    if (n <= 19) return { nom: "Découverte", cls: "pal-1" };
    if (n <= 49) return { nom: "Renforcement", cls: "pal-2" };
    return { nom: "Concret", cls: "pal-3" };
  }

  function renderMap() {
    var wrap = document.getElementById("pj-map");
    if (!wrap) return;
    var umax = unlockedMax();
    var html = "";
    var lastPal = "";
    for (var i = 0; i < NIVEAUX.length; i++) {
      var lv = NIVEAUX[i], pal = palierInfo(lv.n);
      if (pal.nom !== lastPal) {
        if (lastPal !== "") html += "</div>";
        html += '<div class="pj-pal-title ' + pal.cls + '">Palier ' + (lv.n <= 19 ? "1" : lv.n <= 49 ? "2" : "3") +
          " — " + pal.nom + (lv.n <= 19 ? " (bases)" : lv.n <= 49 ? " (formules)" : " (problèmes)") + '</div><div class="pj-grid">';
        lastPal = pal.nom;
      }
      var st = completed(lv.n) ? "done" : (lv.n <= umax ? "open" : "lock");
      html += '<button class="pj-chip ' + pal.cls + " " + st + '"' + (st === "lock" ? " disabled" : "") +
        ' data-n="' + lv.n + '" title="' + (lv.titre || "").replace(/"/g, "&quot;") + '">' +
        (st === "done" ? "★" : st === "lock" ? "🔒" : lv.n) + '<span class="pj-chip-n">' + lv.n + "</span></button>";
    }
    html += "</div>";
    wrap.innerHTML = html;
    var chips = wrap.querySelectorAll(".pj-chip");
    for (var k = 0; k < chips.length; k++) {
      chips[k].addEventListener("click", function () {
        if (this.classList.contains("lock")) return;
        selectLevel(parseInt(this.getAttribute("data-n"), 10));
      });
    }
    // compteur
    var done = (loadProg().done || []).length;
    var cnt = document.getElementById("pj-count");
    if (cnt) cnt.textContent = done + " / " + NIVEAUX.length + " niveaux validés";
  }

  function selectLevel(n) {
    if (runInProgress) stopPython();
    runToken++;
    runInProgress = false;
    current = n;
    var lv = niveau(n), pal = palierInfo(n);
    var el = document.getElementById("pj-detail");
    if (!lv || !el) return;
    var starter = loadCode(n) || lv.starter || "";
    el.innerHTML =
      '<div class="pj-detail-head"><span class="pj-badge ' + pal.cls + '">Niveau ' + n + " · " + pal.nom + '</span>' +
      "<h3>" + lv.titre + "</h3></div>" +
      '<div class="pj-enonce">' + lv.enonce + "</div>" +
      '<label class="pj-lab" for="pj-code">Ton code :</label>' +
      '<textarea id="pj-code" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>' +
      '<div class="pj-actions">' +
      '<button id="pj-run" class="btn">▶ Exécuter les tests</button>' +
      '<button id="pj-stop" class="btn" type="button" hidden>Arrêter</button>' +
      '<button id="pj-hint" class="btn-corrige" type="button">💡 Indice</button>' +
      '<button id="pj-sol" class="btn-corrige" type="button">Voir le corrigé</button>' +
      "</div>" +
      '<div id="pj-status" class="pj-status" role="status" aria-live="polite"></div>' +
      '<div id="pj-results" class="pj-results"></div>' +
      '<div id="pj-extra"></div>';
    var ta = document.getElementById("pj-code");
    ta.value = starter;
    ta.addEventListener("keydown", tabHandler);
    ta.addEventListener("input", function () { saveCode(n, ta.value); });
    document.getElementById("pj-stop").addEventListener("click", function () { stopPython(); });
    document.getElementById("pj-run").addEventListener("click", function () { runLevel(n); });
    document.getElementById("pj-hint").addEventListener("click", function () {
      document.getElementById("pj-extra").innerHTML = '<div class="box met"><span class="box-title">Indice</span><p>' + (lv.indice || "Réfléchis à la définition du cours.") + "</p></div>";
    });
    document.getElementById("pj-sol").addEventListener("click", function () {
      document.getElementById("pj-extra").innerHTML = '<div class="box thm"><span class="box-title">Corrigé possible</span><pre><code>' +
        escapeHtml(lv.solution || "") + "</code></pre><p class=\"small muted\">Compare avec ton approche — plusieurs solutions sont valables.</p></div>";
    });
    if (window.scrollTo) document.getElementById("pj-detail").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function tabHandler(e) {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      var s = this.selectionStart, en = this.selectionEnd;
      this.value = this.value.substring(0, s) + "    " + this.value.substring(en);
      this.selectionStart = this.selectionEnd = s + 4;
      saveCode(current, this.value);
    }
  }

  function escapeHtml(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function runLevel(n) {
    if (runInProgress) return;
    runInProgress = true;
    var token = ++runToken;
    var runButton = document.getElementById("pj-run");
    var stopButton = document.getElementById("pj-stop");
    runButton.disabled = true;
    stopButton.hidden = false;
    var lv = niveau(n);
    var code = document.getElementById("pj-code").value;
    var status = document.getElementById("pj-status");
    var results = document.getElementById("pj-results");
    results.innerHTML = "";
    status.className = "pj-status loading";
    status.textContent = "Exécution…";
    runTests(code, lv.tests, function (msg) { status.textContent = msg; }).then(function (testResults) {
      if (token !== runToken) return;
      var all = true, out = "";
      for (var i = 0; i < lv.tests.length; i++) {
        var t = lv.tests[i], r = testResults[i];
        if (!r.ok) all = false;
        out += '<div class="pj-test ' + (r.ok ? "ok" : "ko") + '">' +
          (r.ok ? "✅" : "❌") + " <code>" + escapeHtml(t.call) + "</code> → attendu <code>" +
          escapeHtml(t.expect) + "</code>" + (r.ok ? "" : ", obtenu <code>" + escapeHtml(r.got) + "</code>") + "</div>";
      }
      results.innerHTML = out;
      if (all) {
        markDone(n);
        status.className = "pj-status win";
        status.innerHTML = "🎉 Niveau " + n + " validé !" + (n < NIVEAUX.length ? ' <button id="pj-next" class="btn">Niveau suivant →</button>' : " Tu as terminé tous les niveaux, bravo !");
        var nx = document.getElementById("pj-next");
        if (nx) nx.addEventListener("click", function () { selectLevel(n + 1); renderMap(); });
        renderMap();
      } else {
        status.className = "pj-status fail";
        status.textContent = "Certains tests échouent — corrige et relance.";
      }
    })["catch"](function (err) {
      if (token !== runToken) return;
      status.className = "pj-status fail";
      status.textContent = err.message || "Erreur de chargement de Python.";
    }).finally(function () {
      if (token !== runToken) return;
      runInProgress = false;
      runButton.disabled = false;
      stopButton.hidden = true;
    });
  }

  function init() {
    if (typeof NIVEAUX === "undefined" || !document.getElementById("pj-map")) return;
    renderMap();
    // ouvrir le premier niveau non terminé
    var umax = unlockedMax(), start = umax;
    for (var i = 1; i <= NIVEAUX.length; i++) { if (!completed(i)) { start = Math.min(i, umax); break; } }
    selectLevel(start);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
