/* ============================================================
   ECG1 2026-2027 — Script commun
   Thème clair/sombre, rendu KaTeX, corrigés dépliables,
   mode livre sans suivi d'avancement, recherche globale, QCM.
   ============================================================ */

(function () {
  "use strict";

  var body = document.body;
  var ROOT = body.getAttribute("data-root") || ".";
  var PAGE_ID = body.getAttribute("data-page-id") || "";

  /* ---------- Mode livre : supprimer l'ancien suivi ---------- */
  function removeNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  function enableBookMode() {
    try {
      localStorage.removeItem("ecg-chapitres");
      localStorage.removeItem("ecg-exercices");
    } catch (e) {}

    document.querySelectorAll(".chapter-done, .ex-done, .done-mark, .maths-progress-panel, .home-progress-io").forEach(removeNode);

    document.querySelectorAll('input[data-progress="chapter"], input[data-progress="exercise"]').forEach(function (input) {
      var label = input.closest ? input.closest("label") : null;
      if (label) removeNode(label); else removeNode(input);
    });

    document.querySelectorAll("[data-progress-matiere]").forEach(function (el) {
      el.removeAttribute("data-progress-matiere");
      el.querySelectorAll(".progress-bar, .progress-label").forEach(removeNode);
      if (!el.textContent.trim() && !el.querySelector("img, svg, a, button")) removeNode(el);
    });

    document.querySelectorAll(".chapter-list li.is-done").forEach(function (li) {
      li.classList.remove("is-done");
    });

    if (PAGE_ID === "accueil") {
      var heroLead = document.querySelector(".home-hero .lead");
      if (heroLead) {
        heroLead.textContent = "Cours, exercices, flashcards et méthodes réunis dans un seul espace de travail. La priorité reste simple : retrouver rapidement le bon contenu, revenir sur les notions autant de fois que nécessaire et garder une structure claire toute l’année.";
      }

      var subjectIntro = document.querySelector("#matieres .home-section-head p");
      if (subjectIntro) {
        subjectIntro.textContent = "Chaque matière garde sa propre couleur, ses cours et ses ressources. Les cartes ci-dessous servent simplement de sommaire général pour circuler dans le site.";
      }

      document.querySelectorAll(".home-subject-meta").forEach(function (meta) {
        meta.innerHTML = '<div class="home-subject-meta-row"><span>Ouvrir la matière</span><span class="home-subject-arrow">→</span></div>';
      });
    }

    if (PAGE_ID === "maths-index") {
      var mathsIntro = document.querySelector("#programme .maths-section-head p");
      if (mathsIntro) {
        mathsIntro.textContent = "Les 17 chapitres couvrent les fondements, l’algèbre, l’analyse, les probabilités, les graphes et les statistiques. Chaque chapitre mène du cours aux exercices corrigés et peut être repris librement tout au long de l’année.";
      }
    }

    if (PAGE_ID === "mon-espace") {
      document.querySelectorAll(".box.met").forEach(function (box) {
        if (box.textContent.toLowerCase().indexOf("progression") !== -1) {
          box.innerHTML = '<span class="box-title">Données locales</span><p>Ton emploi du temps et tes notes sont enregistrés uniquement dans ce navigateur. Si tu changes d’appareil ou effaces les données du site, pense à les recopier auparavant.</p>';
        }
      });
    }

    document.querySelectorAll(".card p").forEach(function (p) {
      if (p.textContent.toLowerCase().indexOf("progression") !== -1) {
        p.textContent = "Cartes de révision à utiliser librement pour revenir régulièrement sur le vocabulaire, les notions et les repères importants.";
      }
    });
  }

  enableBookMode();

  /* ---------- Navigation : Cours prépa ---------- */
  (function injectCoursPrepaNav() {
    document.querySelectorAll(".main-nav").forEach(function (nav) {
      if (nav.querySelector("[data-prepa-link]")) return;
      var link = document.createElement("a");
      link.href = ROOT + "/cours-prepa/index.html";
      link.textContent = "Cours prépa";
      link.setAttribute("data-prepa-link", "true");
      if (PAGE_ID.indexOf("cours-prepa") === 0) link.setAttribute("aria-current", "true");

      var methodo = null;
      nav.querySelectorAll("a").forEach(function (candidate) {
        if (!methodo && /methodologie\/index\.html(?:$|[?#])/.test(candidate.getAttribute("href") || "")) methodo = candidate;
      });
      if (methodo) nav.insertBefore(link, methodo);
      else nav.appendChild(link);
    });

    if (PAGE_ID === "accueil") {
      var actions = document.querySelector(".home-hero-actions");
      if (actions && !actions.querySelector("[data-prepa-hero]")) {
        var heroLink = document.createElement("a");
        heroLink.className = "home-action";
        heroLink.href = ROOT + "/cours-prepa/index.html";
        heroLink.setAttribute("data-prepa-hero", "true");
        heroLink.innerHTML = '<span>Cours prépa</span><span aria-hidden="true">→</span>';
        actions.appendChild(heroLink);
      }
    }
  })();

  /* ---------- Navigation : flèches sobres ---------- */
  function replaceDecorativeArrows(root) {
    var targets = [];
    if (root && root.matches && root.matches("a, button")) targets.push(root);
    if (root && root.querySelectorAll) {
      root.querySelectorAll("a, button").forEach(function (el) { targets.push(el); });
    }
    targets.forEach(function (el) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.indexOf("↗") !== -1) {
          node.nodeValue = node.nodeValue.replace(/↗[\uFE0E\uFE0F]?/g, "→");
        }
      }
    });
  }
  replaceDecorativeArrows(document);
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) replaceDecorativeArrows(node);
          else if (node.nodeType === 3 && node.parentElement) replaceDecorativeArrows(node.parentElement);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

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
    function toggleBackToTop() {
      if (window.scrollY > 600) btn.classList.add("show");
      else btn.classList.remove("show");
    }
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    toggleBackToTop();
  })();

  /* ---------- Service worker (installable + hors-ligne) ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      var root = (document.body && document.body.dataset.root) || ".";
      navigator.serviceWorker.register(root + "/sw.js").catch(function () {});
    });
  }
})();
