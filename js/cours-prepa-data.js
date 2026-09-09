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
      image: "cours-prepa/assets/maths/2026-09-07-coefficients-binomiaux/p1.webp"
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
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shield%20of%20Achilles.jpg?width=1400"
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
      id: "maths-coefficients-binomiaux-2026-09-07",
      subject: "maths",
      title: "Coefficients binomiaux — définition, Pascal et exercices",
      reference: "ML. Bouchard · Maths Prépa ECG 1",
      theme: "Combinatoire · symétrie · formule de Pascal · triangle de Pascal",
      archiveDate: "2026-09-07",
      courseDate: null,
      dateLabel: "07 septembre 2026 · date d’archivage",
      pages: 2,
      corrections: 6,
      chapterTitle: "Chapitre 2 — Coefficients binomiaux",
      chapterUrl: "maths/ch02-calculs-algebriques.html#s5",
      url: "cours-prepa/maths/coefficients-binomiaux-2026-09-07.html",
      thumb: "cours-prepa/assets/maths/2026-09-07-coefficients-binomiaux/p1.webp",
      tags: ["Algèbre", "Combinatoire", "Coefficients binomiaux", "Pascal", "Symétrie", "6 corrigés"]
    },
    {
      id: "italien-republique-italienne-2026-09-07",
      subject: "italien",
      title: "La Repubblica italiana — niveau A2",
      reference: "Italia per stranieri · Unità 6",
      theme: "Institutions · Parlement · Gouvernement · palais de Rome · naissance de la République",
      archiveDate: "2026-09-07",
      courseDate: null,
      dateLabel: "07 septembre 2026 · complété le 09 septembre",
      pages: 4,
      corrections: 8,
      chapterTitle: "Civilisation — Les institutions de la République",
      chapterUrl: "italien/civilisation.html#s1",
      url: "cours-prepa/italien/republique-italienne-2026-09-07.html",
      thumb: "cours-prepa/assets/italien/2026-09-07-republique-italienne/p31.jpeg",
      tags: ["A2", "République", "Institutions", "Parlement", "Gouvernement", "Vocabulaire", "8 corrigés"]
    },
    {
      id: "cg-heritage-antique-seance-2-2026-09-06",
      subject: "cg",
      title: "Séance 2 — Le bouclier d’Achille",
      reference: "Fiche élève · Séance 2",
      theme: "L’héritage de la pensée grecque et romaine · L’art comme représentation du monde",
      archiveDate: "2026-09-06",
      courseDate: null,
      dateLabel: "06 septembre 2026 · date d’archivage",
      pages: 4,
      corrections: 5,
      chapterTitle: "Notion — L’art",
      chapterUrl: "culture-generale/art.html",
      url: "cours-prepa/culture-generale/heritage-antique-seance-2-2026-09-06.html",
      thumb: "https://commons.wikimedia.org/wiki/Special:FilePath/Shield%20of%20Achilles.jpg?width=900",
      tags: ["Antiquité", "Homère", "Iliade", "Art", "Microcosme", "Résumé Écricome", "5 corrigés"]
    },
    {
      id: "cg-heritage-antique-seance-1-2026-09-06",
      subject: "cg",
      title: "Séance 1 — Le Serment d’Hippocrate",
      reference: "Fiche élève · Séance 1",
      theme: "L’héritage de la pensée grecque et romaine · Permanence des valeurs antiques",
      archiveDate: "2026-09-06",
      courseDate: null,
      dateLabel: "06 septembre 2026 · date d’archivage",
      pages: 3,
      corrections: 5,
      chapterTitle: "Notion — L’histoire · Méthode du résumé",
      chapterUrl: "culture-generale/histoire.html",
      url: "cours-prepa/culture-generale/heritage-antique-seance-1-2026-09-06.html",
      thumb: "https://commons.wikimedia.org/wiki/Special:FilePath/Bust%20of%20Hippocrates.jpg?width=900",
      tags: ["Antiquité", "Hippocrate", "Médecine", "Éthique", "Héritage", "Résumé Écricome", "5 corrigés"]
    },
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
