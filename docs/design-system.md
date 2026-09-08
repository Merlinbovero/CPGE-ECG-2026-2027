# Design commun ECG1

Les compositions et photographies existantes sont conservées. La présentation commune est définie dans `css/design-system.css` : deux familles typographiques, couleurs par matière, surfaces clair/sombre, largeurs, titres, boutons, encadrés et navigation.

Les feuilles historiques sont placées dans la couche CSS `legacy`. Les règles communes, hors couche, priment sans augmenter la spécificité des sélecteurs. Les styles directement chargés par l'accueil et les archives utilisent cette même couche. Les règles historiques `!important` liées aux états fonctionnels restent prioritaires (notamment le mode livre). Les styles inline des documents sont conservés.

Pour une modification transversale, modifier les variables `--ui-*` ou le composant commun. Les anciens noms de variables sont reliés aux mêmes valeurs dans le bloc d'adaptation. Ne pas ajouter de nouvelle police ni de palette indépendante par page.

- Texte : Source Sans 3 ; titres : Source Serif 4.
- Matières : maths carmin, ESH vert, culture générale prune, anglais indigo, italien ocre, méthodologie ardoise.
- Lecture : 56 rem maximum ; sommaires et accueil : 74 rem.
- Boutons : hauteur minimale de 44 px, coins de 6 px, états de survol et focus communs.
- Encadrés : définition indigo, théorème vert, méthode ocre, avertissement carmin, exercice prune.
- Mobile : marges adaptées, navigation défilante, sections sur une colonne.

Validation du 8 septembre 2026 : références locales et index vérifiés par `scripts/validate_site.py`, syntaxe CSS analysée. Aucun test visuel dans un navigateur ou sur appareil réel n'a été effectué pour cette modification.
