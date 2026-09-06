/* ============================================================
   Cours prépa — rendu des archives depuis PREPA_ARCHIVE.
   La page principale affiche une vue dossiers sobre ; les pages
   de matière gardent leur chronologie détaillée.
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

  function subjectKeys() {
    return Object.keys(archive.subjects).sort(function (a, b) {
      return (archive.subjects[a].order || 99) - (archive.subjects[b].order || 99);
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

  function folderCourseRow(course) {
    var meta = course.reference || "Cours";
    if (course.pages) meta += " · " + course.pages + " page" + (course.pages > 1 ? "s" : "");
    if (course.corrections) meta += " · " + course.corrections + " corrigé" + (course.corrections > 1 ? "s" : "");

    return '<a class="prepa-file-row" href="' + esc(url(course.url)) + '">' +
      '<span class="prepa-file-date">' + esc(course.dateLabel || course.archiveDate) + '</span>' +
      '<span class="prepa-file-main"><strong>' + esc(course.title) + '</strong><span>' + esc(meta) + '</span></span>' +
      '<span class="prepa-file-arrow" aria-hidden="true">→</span>' +
    '</a>';
  }

  function renderFolderLanding() {
    if (body.getAttribute("data-page-id") !== "cours-prepa-index") return;
    var mount = document.getElementById("prepa-folder-list");
    if (!mount) return;

    var courses = coursesSorted();
    var keys = subjectKeys();

    mount.innerHTML = keys.map(function (key, index) {
      var subject = archive.subjects[key];
      var subjectCourses = courses.filter(function (course) { return course.subject === key; });
      var count = subjectCourses.length;
      var content = count ? subjectCourses.map(folderCourseRow).join("") : '<div class="prepa-folder-empty">Aucun cours pour le moment.</div>';

      return '<details class="prepa-folder"' + (count ? ' open' : '') + '>' +
        '<summary>' +
          '<span class="prepa-folder-chevron" aria-hidden="true">›</span>' +
          '<span class="prepa-folder-title"><strong>' + esc(subject.name) + '</strong><span class="prepa-folder-code">Dossier ' + String(index + 1).padStart(2, "0") + '</span></span>' +
          '<span class="prepa-folder-count">' + count + ' cours</span>' +
        '</summary>' +
        '<div class="prepa-folder-content">' + content + '</div>' +
      '</details>';
    }).join("");

    var total = document.getElementById("prepa-files-total");
    if (total) {
      total.textContent = keys.length + " matières · " + courses.length + " cours";
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

  renderFolderLanding();
  renderSubjectArchive();
})();
