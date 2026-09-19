# Suites B1 — cours de classe

Archivé le 19 septembre 2026 ; aucune date de séance n’est indiquée.
Page : `cours-prepa/maths/suites-b1-arithmetiques-geometriques-2026-09-19.html`.
Référence : ANA 01-B1, pages 1/2 et 2/2, partie B « Suites usuelles ».

## Sources

Photographies copiées à l’identique dans
`cours-prepa/assets/maths/2026-09-19-suites-b1/` :

- IMG_1217.jpeg → couverture.jpeg.
- IMG_1218.jpeg → cours-page-1.jpeg.
- IMG_1219.jpeg → correction-manuscrite.jpeg.
- IMG_1220.jpeg → cours-page-2.jpeg.

La classe existante `a3-photo-frame` tourne l’affichage de +90° ; les fichiers
originaux restent inchangés et téléchargeables. B2 et B3 sont mentionnés dans
le sommaire de la couverture, mais seules les pages de B1 sont présentes.
Les deux graphiques SVG sont reproductibles avec `scripts/plot_suites_b1.py`.

## Contenu

- Définitions par récurrence, termes généraux et décalages d’indices.
- Deux graphiques, avec les valeurs exactes dans un tableau.
- Sommes arithmétiques et géométriques ; nombre de termes et cas q = 1.
- M1 et M2 ; précautions pour le quotient ; réponse pour la suite nulle.
- Deux cas de l’exemple 1, trois tests arithmétiques, quatre tests géométriques
  et la suite auxiliaire : dix corrections dépliables, toutes les sous-questions.
- Fiche de révision, liens vers les autres cours et les quatre originaux.
- Enregistrement dans l’archive, la recherche et le chapitre 6 ; la liste des
  derniers ajouts de l’accueil utilise automatiquement le registre.
- Cache du service worker v17.

## Points pédagogiques vérifiés

- La somme de rang 0 à 10 compte onze termes. L’encadré « Pour info » du
  polycopié omet u0 dans son développement : la coquille est explicitée.
- Exemple 1.1 : un = 2 + 3n ; u10 = 32 ; somme = 187.
- Exemple 1.2 : premier rang 1, donc un = 3(1/2)^(n−1), pour n ≥ 1 ;
  somme des huit termes = 6(1−1/256) = 765/128.
- Exemple 2.1(c) : un+1 = −un + 5 est arithmétique si et seulement si
  u0 = 5/2 ; la feuille ne donne pas de valeur initiale.
- La suite 2n + 3^n n’est ni arithmétique ni géométrique ; preuves par trois
  termes. Trois termes compatibles ne prouvent pas la nature d’une suite.
- La convention du polycopié q ≠ 0 est conservée. La suite nulle est
  géométrique pour tout q non nul ; aucun quotient 0/0 n’est utilisé.
- Exemple 2.3 : vn+1 = vn + 1/2 ; v0 = 0 ; vn = n/2 ; un = n·2^(n−1),
  avec vérification du rang 0.
- Tous les calculs rédigés sont exacts et réalisables sans calculatrice.

## Validation avant publication

- `python scripts/validate_site.py` : 135 pages, 3 876 références locales,
  133 pages indexées, aucune erreur.
- Navigateur : 253 formules KaTeX rendues, aucune erreur de formule ni de
  JavaScript, aucune réponse locale HTTP en erreur.
- Ouverture/fermeture des dix corrigés et comportement à l’impression vérifiés.
- Quatre photos chargées ; identité binaire avec les pièces jointes vérifiée.
- Affichage inspecté en 1 024 × 1 366, clair et sombre, et 390 × 844 ; aucun
  débordement horizontal de page ni de paragraphe sur mobile.
- Présence vérifiée dans l’archive de maths, la recherche B1 et l’accueil.
- Sommes et terme général de la suite auxiliaire contrôlés en arithmétique exacte.
