/* Jeu Python — 70 niveaux, exécution réelle via Pyodide, progression locale.
   Dépend de la variable globale NIVEAUX (js/python-niveaux.js). */
(function () {
  "use strict";

  var STORE = "ecg-python-jeu";
  var CODESTORE = "ecg-python-jeu-code";
  var PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";

  var pyodide = null;       // instance chargée
  var pyLoading = null;     // promesse de chargement en cours
  var current = null;       // numéro de niveau affiché

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

  // ---- Pyodide ----
  function ensurePyodide(onStatus) {
    if (pyodide) return Promise.resolve(pyodide);
    if (pyLoading) return pyLoading;
    onStatus && onStatus("Chargement de Python (première fois, quelques secondes)…");
    pyLoading = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = PYODIDE_URL;
      s.onload = function () {
        window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/" })
          .then(function (py) {
            pyodide = py;
            // helper de test installé une fois
            pyodide.runPython(HELPER);
            resolve(pyodide);
          })["catch"](reject);
      };
      s.onerror = function () { reject(new Error("Impossible de charger Pyodide (connexion internet requise).")); };
      document.head.appendChild(s);
    });
    return pyLoading;
  }

  var HELPER =
    "import json\n" +
    "def _run_test(src, call, expected_src, approx):\n" +
    "    ns = {}\n" +
    "    try:\n" +
    "        exec(src, ns)\n" +
    "    except Exception as e:\n" +
    "        return json.dumps([False, 'ERREUR à l\\'exécution du code : ' + type(e).__name__ + ' : ' + str(e)])\n" +
    "    try:\n" +
    "        got = eval(call, ns)\n" +
    "    except Exception as e:\n" +
    "        return json.dumps([False, 'ERREUR : ' + type(e).__name__ + ' : ' + str(e)])\n" +
    "    try:\n" +
    "        exp = eval(expected_src, {})\n" +
    "    except Exception:\n" +
    "        exp = None\n" +
    "    try:\n" +
    "        if approx:\n" +
    "            ok = abs(got - exp) < 1e-6\n" +
    "        else:\n" +
    "            ok = (got == exp)\n" +
    "    except Exception:\n" +
    "        ok = (repr(got) == repr(exp))\n" +
    "    return json.dumps([bool(ok), repr(got)])\n";

  function runOneTest(src, test) {
    pyodide.globals.set("_SRC", src);
    pyodide.globals.set("_CALL", test.call);
    pyodide.globals.set("_EXP", test.expect);
    pyodide.globals.set("_APX", !!test.approx);
    var raw = pyodide.runPython("_run_test(_SRC, _CALL, _EXP, _APX)");
    var arr = JSON.parse(raw);
    return { ok: arr[0], got: arr[1] };
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
        html += '<div class="pj-pal-title ' + pal.cls + '">Palier ' + (lv.n <= 19 ? "1" : lv.n <= 49 ? "2" : "3") +
          " — " + pal.nom + (lv.n <= 19 ? " (bases)" : lv.n <= 49 ? " (formules)" : " (problèmes)") + '</div><div class="pj-grid">';
        if (lastPal !== "") html = html.replace('<div class="pj-grid">', '</div><div class="pj-grid">');
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
      '<button id="pj-hint" class="btn-corrige" type="button">💡 Indice</button>' +
      '<button id="pj-sol" class="btn-corrige" type="button">Voir le corrigé</button>' +
      "</div>" +
      '<div id="pj-status" class="pj-status"></div>' +
      '<div id="pj-results" class="pj-results"></div>' +
      '<div id="pj-extra"></div>';
    var ta = document.getElementById("pj-code");
    ta.value = starter;
    ta.addEventListener("keydown", tabHandler);
    ta.addEventListener("input", function () { saveCode(n, ta.value); });
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
    if (e.key === "Tab") {
      e.preventDefault();
      var s = this.selectionStart, en = this.selectionEnd;
      this.value = this.value.substring(0, s) + "    " + this.value.substring(en);
      this.selectionStart = this.selectionEnd = s + 4;
    }
  }

  function escapeHtml(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function runLevel(n) {
    var lv = niveau(n);
    var code = document.getElementById("pj-code").value;
    var status = document.getElementById("pj-status");
    var results = document.getElementById("pj-results");
    results.innerHTML = "";
    status.className = "pj-status loading";
    status.textContent = "Exécution…";
    ensurePyodide(function (msg) { status.textContent = msg; }).then(function () {
      var all = true, out = "";
      for (var i = 0; i < lv.tests.length; i++) {
        var t = lv.tests[i], r;
        try { r = runOneTest(code, t); } catch (e) { r = { ok: false, got: "ERREUR : " + e.message }; }
        if (!r.ok) all = false;
        out += '<div class="pj-test ' + (r.ok ? "ok" : "ko") + '">' +
          (r.ok ? "✅" : "❌") + " <code>" + escapeHtml(t.call) + "</code> → attendu <code>" +
          escapeHtml(t.expect) + "</code>" + (r.ok ? "" : ", obtenu <code>" + escapeHtml(r.got) + "</code>") + "</div>";
      }
      results.innerHTML = out;
      if (all) {
        var newlyDone = !completed(n);
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
      status.className = "pj-status fail";
      status.textContent = err.message || "Erreur de chargement de Python.";
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
