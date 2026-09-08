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

  /* Dernière lecture locale : une page du manifeste, jamais une URL libre. */
  (function () {
    if (typeof SITE_DATA === "undefined") return;
    var siteRoot = new URL(ROOT + "/", document.baseURI);
    var key = "ecg-last-reading:" + siteRoot.pathname;
    function readable(page) {
      return page && page.m !== "site" && !/(^|\/)index\.html$/.test(page.u) &&
        !/^cours-prepa\/[^/]+\.html$/.test(page.u);
    }
    function updateReading() {
      if (PAGE_ID !== "accueil") {
        var current = SITE_DATA.pages.find(function (page) {
          return readable(page) && new URL(page.u, siteRoot).pathname === location.pathname;
        });
        if (!current) return;
        var anchor = "";
        try {
          var id = decodeURIComponent(location.hash.slice(1));
          if (id && document.getElementById(id)) anchor = "#" + encodeURIComponent(id);
        } catch (e) {}
        try { localStorage.setItem(key, JSON.stringify({ id: current.id, anchor: anchor })); } catch (e) {}
        return;
      }
      var link = document.getElementById("resume-link");
      var empty = document.getElementById("resume-empty");
      if (!link || !empty) return;
      link.hidden = true;
      empty.hidden = false;
      try {
        var saved = JSON.parse(localStorage.getItem(key));
        if (!saved) return;
        var page = SITE_DATA.pages.find(function (entry) { return entry.id === saved.id && readable(entry); });
        if (!page) return;
        var url = new URL(page.u, siteRoot);
        if (typeof saved.anchor === "string" && /^#[^#\s]*$/.test(saved.anchor)) url.hash = saved.anchor;
        link.href = url.href;
        document.getElementById("resume-name").textContent = page.t;
        link.hidden = false;
        empty.hidden = true;
      } catch (e) {}
    }
    updateReading();
    window.addEventListener("pageshow", updateReading);
    window.addEventListener("hashchange", updateReading);
    if (PAGE_ID === "accueil") {
      window.addEventListener("storage", function (event) { if (event.key === key) updateReading(); });
    }
  })();

  /* ---------- Mode livre : masquer le suivi sans effacer les données ---------- */
  function removeNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  function enableBookMode() {
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
  function savedTheme() {
    try { return localStorage.getItem("ecg-theme"); } catch (e) { return null; }
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    if (toggle) toggle.textContent = t === "dark" ? "☀️" : "🌙";
  }
  applyTheme(savedTheme() ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  if (toggle) {
    toggle.addEventListener("click", function () {
      var t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try { localStorage.setItem("ecg-theme", t); } catch (e) {}
      applyTheme(t);
    });
  }

  /* ---------- Rendu KaTeX ---------- */
  var KATEX_BASE = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/";

  function pageContainsMath() {
    var html = document.body ? document.body.innerHTML : "";
    return html.indexOf("\\(") !== -1 || html.indexOf("\\[") !== -1;
  }

  function ensureStylesheet(href, id) {
    if (document.getElementById(id)) return;
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src, id, done) {
    var existing = document.getElementById(id);
    if (existing) {
      if (existing.getAttribute("data-loaded") === "true") done();
      else existing.addEventListener("load", done, { once: true });
      return;
    }

    var script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.addEventListener("load", function () {
      script.setAttribute("data-loaded", "true");
      done();
    }, { once: true });
    script.addEventListener("error", function () {
      console.warn("Impossible de charger KaTeX :", src);
    }, { once: true });
    document.head.appendChild(script);
  }

  function renderMath() {
    if (typeof renderMathInElement !== "function") return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false
    });
  }

  function ensureKatexAndRender() {
    if (!pageContainsMath()) return;

    ensureStylesheet(KATEX_BASE + "katex.min.css", "katex-css");

    if (typeof renderMathInElement === "function") {
      renderMath();
      return;
    }

    function loadAutoRender() {
      loadScript(KATEX_BASE + "contrib/auto-render.min.js", "katex-auto-render", renderMath);
    }

    if (typeof katex !== "undefined") loadAutoRender();
    else loadScript(KATEX_BASE + "katex.min.js", "katex-core", loadAutoRender);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureKatexAndRender, { once: true });
  } else {
    ensureKatexAndRender();
  }

  /* ---------- Boutons « Voir le corrigé » ---------- */
  document.querySelectorAll(".btn-corrige").forEach(function (btn, index) {
    var target = btn.parentElement.querySelector(".corrige");
    if (!target) return;
    if (!target.id) target.id = "corrige-" + index;
    btn.setAttribute("aria-controls", target.id);
    btn.setAttribute("aria-expanded", String(!target.classList.contains("hidden")));
    target.hidden = target.classList.contains("hidden");
    btn.addEventListener("click", function () {
      var hidden = target.classList.toggle("hidden");
      target.hidden = hidden;
      btn.setAttribute("aria-expanded", String(!hidden));
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

  /* ---------- Recherche globale, identique sur toutes les pages ---------- */
  var input = document.getElementById("search");
  var results = document.getElementById("search-results");
  if (input && results && typeof SITE_DATA !== "undefined") {
    function normalize(s) {
      return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, " ");
    }
    function escapeText(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    input.setAttribute("aria-controls", results.id);
    input.setAttribute("aria-expanded", "false");
    results.setAttribute("role", "region");
    results.setAttribute("aria-label", "Résultats de recherche");
    function closeSearch() {
      results.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }
    function showSearch() {
      results.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }
    function doSearch() {
      var q = normalize(input.value.trim());
      if (q.length < 2) { closeSearch(); results.innerHTML = ""; return; }
      var words = q.split(/\s+/).filter(Boolean);
      var out = [];
      SITE_DATA.pages.forEach(function (p) {
        var title = normalize(p.t);
        var sections = p.s || [];
        var haystack = normalize(p.t + " " + sections.join(" "));
        if (!words.every(function (word) { return haystack.indexOf(word) !== -1; })) return;
        var inTitle = title.indexOf(q) !== -1;
        var section = inTitle ? null : sections.find(function (s) {
          return words.some(function (word) { return normalize(s).indexOf(word) !== -1; });
        });
        out.push({ p: p, sec: section, score: title === q ? 3 : inTitle ? 2 : 1 });
      });
      out.sort(function (a, b) { return b.score - a.score; });
      if (!out.length) {
        results.innerHTML = '<div class="sr-empty" role="status">Aucun résultat.</div>';
        showSearch();
        return;
      }
      results.innerHTML = out.slice(0, 12).map(function (r) {
        var mat = SITE_DATA.matieres[r.p.m] || SITE_DATA.matieres.site;
        return '<a href="' + escapeText(ROOT + "/" + r.p.u) + '">' +
          '<span class="sr-matiere" style="color:' + escapeText(mat.color) + '">' + escapeText(mat.name) + "</span><br>" +
          escapeText(r.p.t) + (r.sec ? '<span class="sr-section">→ ' + escapeText(r.sec) + "</span>" : "") + "</a>";
      }).join("");
      showSearch();
    }
    input.addEventListener("input", doSearch);
    input.addEventListener("focus", doSearch);
    document.addEventListener("click", function (e) {
      if (!input.contains(e.target) && !results.contains(e.target)) closeSearch();
    });
    document.addEventListener("focusin", function (e) {
      if (e.target !== input && !results.contains(e.target)) closeSearch();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeSearch(); return; }
      var links = results.querySelectorAll("a");
      if (results.hidden || !links.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        links[e.key === "ArrowDown" ? 0 : links.length - 1].focus();
      } else if (e.key === "Enter") {
        e.preventDefault(); links[0].click();
      }
    });
    results.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.focus(); closeSearch(); return; }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      var links = Array.from(results.querySelectorAll("a"));
      var index = links.indexOf(document.activeElement);
      if (index < 0) return;
      e.preventDefault();
      var next = index + (e.key === "ArrowDown" ? 1 : -1);
      if (next < 0 || next >= links.length) input.focus(); else links[next].focus();
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
