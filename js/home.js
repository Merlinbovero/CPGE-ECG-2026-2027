/* Documents récents : une seule source, le registre des cours prépa. */
(function () {
  "use strict";
  var list = document.getElementById("home-recent");
  var archive = window.PREPA_ARCHIVE;
  if (!list || !archive || !Array.isArray(archive.courses)) return;
  var courses = archive.courses.slice().sort(function (a, b) {
    return String(b.archiveDate).localeCompare(String(a.archiveDate));
  }).slice(0, 4);
  courses.forEach(function (course) {
    var subject = archive.subjects[course.subject];
    if (!subject || !course.url) return;
    var item = document.createElement("li");
    var link = document.createElement("a");
    link.href = course.url;
    var meta = document.createElement("span");
    meta.className = "home-recent-meta";
    var matter = document.createElement("span");
    matter.className = "home-recent-subject";
    matter.textContent = subject.short;
    matter.style.setProperty("--recent-accent", "var(--ui-" + course.subject + ")");
    var date = document.createElement("time");
    date.dateTime = course.archiveDate;
    date.textContent = "Ajouté le " + new Intl.DateTimeFormat("fr-FR", {
      day: "numeric", month: "long"
    }).format(new Date(course.archiveDate + "T12:00:00"));
    meta.append(matter, date);
    var title = document.createElement("strong");
    title.textContent = course.title;
    link.append(meta, title);
    item.appendChild(link);
    list.appendChild(item);
  });
  if (list.children.length) document.getElementById("home-recent-fallback").hidden = true;
})();
