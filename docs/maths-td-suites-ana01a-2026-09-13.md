# TD ANA 01-A — Généralités et étude globale

Document reçu et archivé le 13 septembre 2026 ; aucune date de distribution visible.
Deux photos originales intégrales, sans transformation des fichiers :

- IMG_1207.jpeg → cours-prepa/assets/maths/2026-09-13-td-suites-ana01a/td-page-1.jpeg (1/2).
- IMG_1208.jpeg → cours-prepa/assets/maths/2026-09-13-td-suites-ana01a/td-page-2.jpeg (2/2).

L’orientation de lecture est gérée en CSS. Le graphique de l’exercice 6 est
recalculé à partir de la formule, avec scripts/plot_td_suites_ana01a.py.

Page : cours-prepa/maths/td-suites-ana01a-2026-09-13.html.
Référencée dans le registre Cours prépa et dans le chapitre 6 sur les suites.
La recherche commune est régénérée par scripts/sync_search.py.

## Choix pédagogiques

- Les sept exercices et toutes leurs sous-questions sont conservés et corrigés.
- Les calculs des solutions restent exacts ; aucune calculatrice n’est nécessaire.
- Ex. 1.5 : le polycopié indique N, mais la récurrence est utilisable pour n >= 1.
- Ex. 3.6 : n / 2^n n’est pas monotone sur N, décroît au sens large dès 1 et
  strictement dès 2 (égalité des termes de rang 1 et 2).
- Ex. 3.7 et 3.8 : n >= 1 ; seule la croissance de ln est nécessaire pour 3.8.
- Ex. 4.2 : vrai pour n >= 2 ; au rang 1 la formule est indéfinie ; au rang 0,
  le terme vaut 3 et n’est pas majoré par 2. Ambiguïté signalée, sans modifier
  silencieusement l’énoncé.
- Ex. 4.4 : le dénominateur lu est 3n, et non 3^n ; n >= 1.
- Ex. 4.6 : n >= 1 ; la preuve de non-majoration comprend une variante exacte
  sans recours aux croissances comparées.
- Ex. 6 : cinq premiers termes = u0 à u4. Conjecture, bien-définition et preuve
  des variations sont séparées. La minoration plus forte par 2 est un complément.
- Ex. 7.2 : preuve indépendante par récurrence avant de conjecturer puis
  démontrer le terme général dans la question 3.
