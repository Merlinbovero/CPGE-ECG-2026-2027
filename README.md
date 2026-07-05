# CPGE ECG1 — 2026/2027 · Site de révision

Site web pédagogique statique pour la première année de CPGE **ECG** (parcours **mathématiques appliquées + ESH**), année scolaire 2026/2027. Conforme aux programmes officiels (BO spécial n°1 du 11 février 2021).

## 🔗 Accès au site

**➡️ [merlinbovero.github.io/CPGE-ECG-2026-2027](https://merlinbovero.github.io/CPGE-ECG-2026-2027/)**

Scanne ce QR code pour l'ouvrir sur ton téléphone :

<img src="qr-code.svg" alt="QR code vers le site" width="160">

Le site est une **application installable** (PWA) : sur mobile ou ordinateur, tu peux l'ajouter à l'écran d'accueil pour l'ouvrir en plein écran, comme une vraie app, et la consulter même hors connexion.

- **iPhone / iPad (Safari)** : Partager → « Sur l'écran d'accueil ».
- **Android (Chrome)** : menu ⋮ → « Installer l'application ».
- **Ordinateur (Chrome / Edge)** : icône d'installation dans la barre d'adresse.

## Contenu

- **Mathématiques appliquées & informatique** — 17 chapitres (2 semestres) + 5 fiches Python, avec cours complets et ≥ 8 exercices corrigés par chapitre (3 niveaux de difficulté).
- **ESH** — 12 chapitres (modules 1 et 2) : cours, auteurs, données chiffrées, dissertations corrigées, QCM.
- **Culture générale** — 13 notions + méthodologie de la dissertation et de la contraction.
- **LVA Anglais** et **LVB Italien** — civilisation, grammaire, vocabulaire, méthodologie, exercices corrigés.
- **Méthodologie & concours** — organisation, colles, présentation BCE/Ecricome.

## Stack technique

- HTML/CSS/JavaScript vanilla, aucun build : ouvrir `index.html` dans un navigateur ou servir le dossier tel quel (`python3 -m http.server`).
- Formules mathématiques : [KaTeX](https://katex.org/) via CDN.
- Coloration syntaxique Python : [Prism.js](https://prismjs.com/) via CDN.
- Mode sombre/clair persistant, suivi de progression (chapitres terminés, exercices réussis) et recherche globale : `localStorage`, côté client uniquement.

## Architecture

```
index.html              Accueil (présentation, progression, calendrier)
css/style.css           Feuille de style commune (thèmes, encadrés, responsive)
js/main.js              Script commun (thème, recherche, progression, corrigés, QCM)
js/data.js              Manifeste des pages (recherche + barres de progression)
maths/                  1 page par chapitre + index
esh/                    idem
culture-generale/       idem
anglais/                idem
italien/                idem
methodologie/           idem
```

Pour ajouter une page : créer le fichier HTML dans le dossier de la matière (reprendre l'en-tête d'une page existante), puis déclarer la page dans `js/data.js` (id, titre, URL, sections) pour qu'elle apparaisse dans la recherche et la progression.
