/* Compléments ESH alignés sur le programme officiel ECG1 2026-2027.
   Chargé sur l'accueil ESH et les nouvelles pages pour les rendre recherchables
   sans modifier le manifeste global historique du site. */
if (typeof SITE_DATA !== "undefined" && Array.isArray(SITE_DATA.pages)) {
  SITE_DATA.pages.push(
    { id: "esh-off-111", m: "esh", n: "1.1", t: "Compléments officiels — fondements de l'économie", u: "esh/complements-fondements-economie.html",
      s: ["Tableau entrées-sorties", "Coefficients techniques", "Mercantilistes", "Physiocrates", "Quesnay", "Histoire de la pensée économique depuis le XVIe siècle"] },
    { id: "esh-off-121", m: "esh", n: "1.2.1", t: "Équilibre microéconomique du consommateur et du producteur", u: "esh/micro-consommateur-producteur.html",
      s: ["Préférences et utilité", "Courbes d'indifférence", "Contrainte budgétaire", "TMS", "Effets revenu et substitution", "Fonction de production", "Coûts", "Choix du producteur"] },
    { id: "esh-off-212", m: "esh", n: "2.1.2", t: "Inégalités et stratégies de développement", u: "esh/strategies-developpement.html",
      s: ["Développement", "Stratégies de développement", "Substitution aux importations", "Promotion des exportations", "État développeur", "Consensus de Washington", "Industrialisation"] },
    { id: "esh-off-221", m: "esh", n: "2.2.1", t: "Transformations des structures économiques et financières", u: "esh/transformations-economiques-financieres.html",
      s: ["Industrialisation", "Tertiarisation", "Désindustrialisation", "Financiarisation", "Globalisation financière", "Économie d'endettement", "Économie de marchés financiers"] },
    { id: "esh-off-222", m: "esh", n: "2.2.2", t: "Mobilité sociale et transformations de la structure sociale", u: "esh/mobilite-sociale.html",
      s: ["Mobilité sociale", "Tables de mobilité", "Mobilité observée", "Mobilité structurelle", "Fluidité sociale", "Odds ratio", "Déclassement"] },
    { id: "esh-off-232", m: "esh", n: "2.3.2", t: "Concurrence imparfaite et stratégies des firmes", u: "esh/strategies-firmes.html",
      s: ["Monopole", "Oligopole", "Concurrence monopolistique", "Barrières à l'entrée", "Différenciation", "Discrimination par les prix", "Théorie des jeux", "Stratégies des firmes"] },
    { id: "esh-off-233", m: "esh", n: "2.3.3", t: "Sociologie du travail et des organisations", u: "esh/sociologie-travail-organisations.html",
      s: ["Travail", "Organisation", "Taylorisme", "Fordisme", "Toyotisme", "Crozier et Friedberg", "Relations professionnelles", "Qualification", "Autonomie et contrôle"] }
  );
}
