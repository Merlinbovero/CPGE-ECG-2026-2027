/* ============================================================
   Cours prépa — rendu des archives
   Les compteurs, derniers ajouts et chronologies sont produits
   depuis PREPA_ARCHIVE pour éviter de dupliquer les métadonnées.
   ============================================================ */

(function () {
  "use strict";

  if (!window.PREPA_ARCHIVE) return;

  var archive = window.PREPA_ARCHIVE;
  var body = document.body;
  var ROOT = body.getAttribute("data-root") || ".";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function url(path) {
    if (!path) return "#";
    if (/^https?:\/\//i.test(path)) return path;
    return ROOT.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
  }

  function coursesSorted() {
    return archive.courses.slice().sort(function (a, b) {
      return String(b.courseDate || b.archiveDate).localeCompare(String(a.courseDate || a.archiveDate));
    });
  }

  function monthLabel(iso) {
    var d = new Date(iso + "T12:00:00");
    var label = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function courseCard(course, compact) {
    var tags = (course.tags || []).map(function (tag) {
      return '<span class="prepa-tag">' + esc(tag) + '</span>';
    }).join("");

    return '<a class="prepa-course-card' + (compact ? ' is-compact' : '') + '" href="' + esc(url(course.url)) + '">' +
      '<div class="prepa-course-thumb"><img loading="lazy" src="' + esc(url(course.thumb)) + '" alt="Miniature du cours ' + esc(course.title) + '"></div>' +
      '<div class="prepa-course-body">' +
        '<span class="prepa-course-date">' + esc(course.dateLabel) + '</span>' +
        '<h3>' + esc(course.title) + '</h3>' +
        '<p><strong>' + esc(course.reference) + '.</strong> ' + esc(course.theme) + '. ' + esc(course.pages) + ' page' + (course.pages > 1 ? 's' : '') + ' conservée' + (course.pages > 1 ? 's' : '') + ' · ' + esc(course.corrections) + ' correction' + (course.corrections > 1 ? 's' : '') + ' ajoutée' + (course.corrections > 1 ? 's' : '') + '.</p>' +
        '<div class="prepa-tags">' + tags + '</div>' +
      '</div>' +
      '<div class="prepa-course-arrow" aria-hidden="true">→</div>' +
    '</a>';
  }

  function renderLanding() {
    if (body.getAttribute("data-page-id") !== "cours-prepa-index") return;

    var courses = coursesSorted();
    var totalPages = courses.reduce(function (sum, c) { return sum + (Number(c.pages) || 0); }, 0);
    var totalCorrections = courses.reduce(function (sum, c) { return sum + (Number(c.corrections) || 0); }, 0);
    var activeSubjects = {};
    courses.forEach(function (c) { activeSubjects[c.subject] = true; });

    var statValues = {
      courses: courses.length,
      pages: totalPages,
      corrections: totalCorrections,
      subjects: Object.keys(activeSubjects).length
    };
    Object.keys(statValues).forEach(function (key) {
      var el = document.querySelector('[data-prepa-stat="' + key + '"]');
      if (el) el.textContent = statValues[key];
    });

    Object.keys(archive.subjects).forEach(function (key) {
      var subjectCourses = courses.filter(function (c) { return c.subject === key; });
      var card = document.querySelector('.prepa-subject-card[data-subject="' + key + '"]');
      if (!card) return;
      var count = card.querySelector("[data-prepa-count]");
      var latest = card.querySelector("[data-prepa-latest]");
      if (count) count.textContent = subjectCourses.length + " cours";
      if (latest) latest.textContent = subjectCourses.length ? "Dernier ajout · " + subjectCourses[0].title : "Archive prête à recevoir les cours";
    });

    var latestList = document.getElementById("prepa-latest-list");
    if (latestList) {
      latestList.innerHTML = courses.length ? courses.slice(0, 4).map(function (c) { return courseCard(c, true); }).join("") : '<div class="prepa-empty"><strong>Aucun cours archivé pour le moment.</strong><p>Les prochains documents apparaîtront ici automatiquement.</p></div>';
    }

    if (courses.length) {
      var latestCourse = courses[0];
      var latestLink = document.querySelector("[data-prepa-latest-link]");
      if (latestLink) latestLink.setAttribute("href", url(latestCourse.url));
      var heroImage = document.querySelector("[data-prepa-hero-image]");
      if (heroImage) {
        heroImage.src = url(latestCourse.thumb);
        heroImage.alt = "Dernier cours archivé : " + latestCourse.title;
      }
      var heroSubject = document.querySelector("[data-prepa-hero-subject]");
      var heroDate = document.querySelector("[data-prepa-hero-date]");
      if (heroSubject) heroSubject.textContent = (archive.subjects[latestCourse.subject] || {}).short + " · " + latestCourse.reference;
      if (heroDate) heroDate.textContent = latestCourse.dateLabel.replace(" · date d’archivage", "");
    }
  }

  function renderSubjectArchive() {
    var subjectKey = body.getAttribute("data-prepa-subject");
    if (!subjectKey) return;
    var mount = document.getElementById("prepa-subject-archive");
    if (!mount) return;

    var subjectCourses = coursesSorted().filter(function (c) { return c.subject === subjectKey; });
    var count = document.querySelector("[data-prepa-subject-count]");
    if (count) count.textContent = subjectCourses.length + " cours archivé" + (subjectCourses.length > 1 ? "s" : "");

    if (!subjectCourses.length) {
      mount.innerHTML = '<div class="prepa-empty prepa-empty-large"><span class="prepa-empty-index">00</span><strong>Aucun cours archivé pour le moment.</strong><p>Le premier document de cette matière apparaîtra ici, rangé automatiquement par mois puis par date.</p></div>';
      return;
    }

    var groups = {};
    subjectCourses.forEach(function (course) {
      var key = (course.courseDate || course.archiveDate).slice(0, 7);
      if (!groups[key]) groups[key] = [];
      groups[key].push(course);
    });

    mount.innerHTML = Object.keys(groups).sort().reverse().map(function (key) {
      var courses = groups[key];
      return '<section class="prepa-month">' +
        '<div class="prepa-month-label">' + esc(monthLabel(courses[0].courseDate || courses[0].archiveDate)) + '</div>' +
        '<div class="prepa-course-list">' + courses.map(function (c) { return courseCard(c, false); }).join("") + '</div>' +
      '</section>';
    }).join("");
  }

  renderLanding();
  renderSubjectArchive();
})();
