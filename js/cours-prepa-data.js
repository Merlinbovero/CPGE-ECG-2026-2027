/* ============================================================
   Cours prépa — registre documentaire
   Une entrée = un document réellement reçu en classe.
   Les pages d'archive se construisent à partir de ce registre.
   ============================================================ */

window.PREPA_ARCHIVE = {
  subjects: {
    maths: {
      order: 1,
      name: "Mathématiques appliquées",
      short: "Maths",
      page: "cours-prepa/maths.html",
      description: "Polycopiés, définitions, méthodes, feuilles d’exercices et corrections.",
      image: "cours-prepa/assets/maths/2026-09-05-suites-a1/cover.webp"
    },
    esh: {
      order: 2,
      name: "ESH",
      short: "ESH",
      page: "cours-prepa/esh.html",
      description: "Économie, sociologie, histoire économique, documents et dossiers distribués en classe.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/New%20York%20Stock%20Exchange%20-%20panoramio%20%282%29.jpg?width=1400"
    },
    cg: {
      order: 3,
      name: "Culture générale",
      short: "Culture générale",
      page: "cours-prepa/culture-generale.html",
      description: "Philosophie, littérature, textes, notions, dissertations et documents de méthode.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Marginalia_in_the_hand_of_grammarian_and_politician_James_Harris_%281709-1780%29_in_a_1556_edition_of_Aristotle%27s_Physics.jpg?width=1400"
    },
    anglais: {
      order: 4,
      name: "Anglais",
      short: "Anglais",
      page: "cours-prepa/anglais.html",
      description: "Articles, civilisation, vocabulaire, grammaire, essais et préparation aux épreuves.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Newspapers_on_a_desk_%2839997398193%29.jpg?width=1400"
    },
    italien: {
      order: 5,
      name: "Italien",
      short: "Italien",
      page: "cours-prepa/italien.html",
      description: "Langue, grammaire, civilisation, textes et entraînements réellement donnés en prépa.",
      image: "cours-prepa/assets/italien/2026-09-06-geographie-regions/p08.webp"
    }
  },

  courses: [
    {
      id: "italien-geographie-regions-2026-09-06",
      subject: "italien",
      title: "Géographie de l’Italie & régions — niveau A2",
      reference: "Italia per stranieri · Unità 1 + Unità 5",
      theme: "Un paese a forma di… · L’Italia delle regioni",
      archiveDate: "2026-09-06",
      courseDate: null,
      dateLabel: "06 septembre 2026 · date d’archivage",
      pages: 9,
      corrections: 11,
      chapterTitle: "Civilisation — Géographie et régions",
      chapterUrl: "italien/civilisation.html",
      url: "cours-prepa/italien/geographie-regions-2026-09-06.html",
      thumb: "cours-prepa/assets/italien/2026-09-06-geographie-regions/p08.webp",
      tags: ["A2", "Géographie", "Régions", "Vocabulaire", "Civilisation", "11 corrigés"]
    },
    {
      id: "maths-suites-a1-2026-09-05",
      subject: "maths",
      title: "Suites — A1 · Premières définitions et notations",
      reference: "ANA 01-A1",
      theme: "Thème 01 · Suites · Partie A — Généralités et étude globale",
      archiveDate: "2026-09-05",
      courseDate: null,
      dateLabel: "05 septembre 2026 · date d’archivage",
      pages: 2,
      corrections: 4,
      chapterTitle: "Chapitre 6 — Suites réelles",
      chapterUrl: "maths/ch06-suites.html",
      url: "cours-prepa/maths/suites-a1-2026-09-05.html",
      thumb: "cours-prepa/assets/maths/2026-09-05-suites-a1/a1-p1.webp",
      tags: ["Analyse", "Suites", "Définitions", "Récurrence", "4 corrigés"]
    }
  ]
};
