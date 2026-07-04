/* Généré depuis une source Python vérifiée (chaque corrigé passe ses tests). Ne pas éditer à la main. */
var NIVEAUX = [
{
"n": 1,
"titre": "Le carré",
"enonce": "Écris une fonction <code>carre(x)</code> qui renvoie le carré de <code>x</code>.",
"starter": "def carre(x):\n    # ton code ici\n    pass\n",
"indice": "Le carré s'obtient avec l'opérateur <code>**</code> : <code>x**2</code>.",
"solution": "def carre(x):\n    return x**2\n",
"tests": [
{
"call": "carre(3)",
"expect": "9",
"approx": false
},
{
"call": "carre(-4)",
"expect": "16",
"approx": false
},
{
"call": "carre(0)",
"expect": "0",
"approx": false
}
]
},
{
"n": 2,
"titre": "La somme",
"enonce": "Écris <code>somme_deux(a, b)</code> qui renvoie la somme de deux nombres.",
"starter": "def somme_deux(a, b):\n    pass\n",
"indice": "Utilise <code>return a + b</code>.",
"solution": "def somme_deux(a, b):\n    return a + b\n",
"tests": [
{
"call": "somme_deux(3, 4)",
"expect": "7",
"approx": false
},
{
"call": "somme_deux(-2, 2)",
"expect": "0",
"approx": false
},
{
"call": "somme_deux(10, 5)",
"expect": "15",
"approx": false
}
]
},
{
"n": 3,
"titre": "La moyenne de deux nombres",
"enonce": "Écris <code>moyenne2(a, b)</code> qui renvoie la moyenne de <code>a</code> et <code>b</code>.",
"starter": "def moyenne2(a, b):\n    pass\n",
"indice": "La moyenne, c'est <code>(a + b) / 2</code>. La division <code>/</code> donne un flottant.",
"solution": "def moyenne2(a, b):\n    return (a + b) / 2\n",
"tests": [
{
"call": "moyenne2(4, 6)",
"expect": "5.0",
"approx": true
},
{
"call": "moyenne2(3, 8)",
"expect": "5.5",
"approx": true
},
{
"call": "moyenne2(10, 0)",
"expect": "5.0",
"approx": true
}
]
},
{
"n": 4,
"titre": "Pair ou impair",
"enonce": "Écris <code>est_pair(n)</code> qui renvoie <code>True</code> si <code>n</code> est pair, <code>False</code> sinon.",
"starter": "def est_pair(n):\n    pass\n",
"indice": "Un nombre est pair si son reste dans la division par 2 est nul : <code>n % 2 == 0</code>.",
"solution": "def est_pair(n):\n    return n % 2 == 0\n",
"tests": [
{
"call": "est_pair(4)",
"expect": "True",
"approx": false
},
{
"call": "est_pair(7)",
"expect": "False",
"approx": false
},
{
"call": "est_pair(0)",
"expect": "True",
"approx": false
}
]
},
{
"n": 5,
"titre": "Le plus grand",
"enonce": "Écris <code>maximum2(a, b)</code> qui renvoie le plus grand des deux, <strong>sans utiliser <code>max</code></strong>.",
"starter": "def maximum2(a, b):\n    pass\n",
"indice": "Utilise une condition <code>if a >= b:</code>.",
"solution": "def maximum2(a, b):\n    if a >= b:\n        return a\n    else:\n        return b\n",
"tests": [
{
"call": "maximum2(3, 7)",
"expect": "7",
"approx": false
},
{
"call": "maximum2(9, 2)",
"expect": "9",
"approx": false
},
{
"call": "maximum2(5, 5)",
"expect": "5",
"approx": false
}
]
},
{
"n": 6,
"titre": "Valeur absolue",
"enonce": "Écris <code>valeur_absolue(x)</code> qui renvoie la valeur absolue de <code>x</code>, <strong>sans <code>abs</code></strong>.",
"starter": "def valeur_absolue(x):\n    pass\n",
"indice": "Si <code>x</code> est négatif, renvoie <code>-x</code>.",
"solution": "def valeur_absolue(x):\n    if x < 0:\n        return -x\n    return x\n",
"tests": [
{
"call": "valeur_absolue(-5)",
"expect": "5",
"approx": false
},
{
"call": "valeur_absolue(3)",
"expect": "3",
"approx": false
},
{
"call": "valeur_absolue(0)",
"expect": "0",
"approx": false
}
]
},
{
"n": 7,
"titre": "Aire d'un rectangle",
"enonce": "Écris <code>aire_rectangle(L, l)</code> qui renvoie l'aire d'un rectangle de longueur <code>L</code> et largeur <code>l</code>.",
"starter": "def aire_rectangle(L, l):\n    pass\n",
"indice": "L'aire est le produit <code>L * l</code>.",
"solution": "def aire_rectangle(L, l):\n    return L * l\n",
"tests": [
{
"call": "aire_rectangle(3, 4)",
"expect": "12",
"approx": false
},
{
"call": "aire_rectangle(5, 5)",
"expect": "25",
"approx": false
},
{
"call": "aire_rectangle(10, 2)",
"expect": "20",
"approx": false
}
]
},
{
"n": 8,
"titre": "Prix TTC",
"enonce": "Un prix hors taxe <code>ht</code> est majoré d'un taux de TVA <code>taux</code> (en %). Écris <code>prix_ttc(ht, taux)</code> qui renvoie le prix TTC.",
"starter": "def prix_ttc(ht, taux):\n    pass\n",
"indice": "TTC = HT × (1 + taux/100).",
"solution": "def prix_ttc(ht, taux):\n    return ht * (1 + taux / 100)\n",
"tests": [
{
"call": "prix_ttc(100, 20)",
"expect": "120.0",
"approx": true
},
{
"call": "prix_ttc(50, 10)",
"expect": "55.0",
"approx": true
},
{
"call": "prix_ttc(200, 5.5)",
"expect": "211.0",
"approx": true
}
]
},
{
"n": 9,
"titre": "Le reste",
"enonce": "Écris <code>reste(a, b)</code> qui renvoie le reste de la division euclidienne de <code>a</code> par <code>b</code>.",
"starter": "def reste(a, b):\n    pass\n",
"indice": "L'opérateur reste (modulo) est <code>%</code>.",
"solution": "def reste(a, b):\n    return a % b\n",
"tests": [
{
"call": "reste(17, 5)",
"expect": "2",
"approx": false
},
{
"call": "reste(10, 2)",
"expect": "0",
"approx": false
},
{
"call": "reste(9, 4)",
"expect": "1",
"approx": false
}
]
},
{
"n": 10,
"titre": "Le signe",
"enonce": "Écris <code>signe(x)</code> qui renvoie <code>-1</code> si <code>x</code> est négatif, <code>0</code> s'il est nul, <code>1</code> s'il est positif.",
"starter": "def signe(x):\n    pass\n",
"indice": "Enchaîne <code>if</code>, <code>elif</code>, <code>else</code>.",
"solution": "def signe(x):\n    if x < 0:\n        return -1\n    elif x == 0:\n        return 0\n    else:\n        return 1\n",
"tests": [
{
"call": "signe(-8)",
"expect": "-1",
"approx": false
},
{
"call": "signe(0)",
"expect": "0",
"approx": false
},
{
"call": "signe(3.2)",
"expect": "1",
"approx": false
}
]
},
{
"n": 11,
"titre": "Somme des entiers",
"enonce": "Écris <code>somme_jusqua(n)</code> qui renvoie <code>1 + 2 + … + n</code> à l'aide d'une boucle <code>for</code>.",
"starter": "def somme_jusqua(n):\n    S = 0\n    # ta boucle ici\n    return S\n",
"indice": "Initialise <code>S = 0</code> puis <code>for k in range(1, n+1): S += k</code>.",
"solution": "def somme_jusqua(n):\n    S = 0\n    for k in range(1, n + 1):\n        S += k\n    return S\n",
"tests": [
{
"call": "somme_jusqua(10)",
"expect": "55",
"approx": false
},
{
"call": "somme_jusqua(1)",
"expect": "1",
"approx": false
},
{
"call": "somme_jusqua(100)",
"expect": "5050",
"approx": false
}
]
},
{
"n": 12,
"titre": "La factorielle",
"enonce": "Écris <code>factorielle(n)</code> qui renvoie <code>n! = 1 × 2 × … × n</code> (et <code>0! = 1</code>).",
"starter": "def factorielle(n):\n    p = 1\n    # ...\n    return p\n",
"indice": "Un produit s'initialise à 1. Boucle de 1 à n.",
"solution": "def factorielle(n):\n    p = 1\n    for k in range(1, n + 1):\n        p *= k\n    return p\n",
"tests": [
{
"call": "factorielle(5)",
"expect": "120",
"approx": false
},
{
"call": "factorielle(0)",
"expect": "1",
"approx": false
},
{
"call": "factorielle(6)",
"expect": "720",
"approx": false
}
]
},
{
"n": 13,
"titre": "Compter les pairs",
"enonce": "Écris <code>compte_pairs(n)</code> qui renvoie le nombre d'entiers pairs entre 1 et <code>n</code> inclus.",
"starter": "def compte_pairs(n):\n    c = 0\n    return c\n",
"indice": "Parcours 1..n et incrémente si <code>k % 2 == 0</code>.",
"solution": "def compte_pairs(n):\n    c = 0\n    for k in range(1, n + 1):\n        if k % 2 == 0:\n            c += 1\n    return c\n",
"tests": [
{
"call": "compte_pairs(10)",
"expect": "5",
"approx": false
},
{
"call": "compte_pairs(7)",
"expect": "3",
"approx": false
},
{
"call": "compte_pairs(1)",
"expect": "0",
"approx": false
}
]
},
{
"n": 14,
"titre": "Puissance à la main",
"enonce": "Écris <code>puissance(a, n)</code> qui renvoie <code>a**n</code> (n ≥ 0) <strong>sans utiliser <code>**</code></strong>, avec une boucle.",
"starter": "def puissance(a, n):\n    r = 1\n    return r\n",
"indice": "Multiplie <code>r</code> par <code>a</code>, <code>n</code> fois.",
"solution": "def puissance(a, n):\n    r = 1\n    for k in range(n):\n        r *= a\n    return r\n",
"tests": [
{
"call": "puissance(2, 10)",
"expect": "1024",
"approx": false
},
{
"call": "puissance(3, 0)",
"expect": "1",
"approx": false
},
{
"call": "puissance(5, 3)",
"expect": "125",
"approx": false
}
]
},
{
"n": 15,
"titre": "La table de multiplication",
"enonce": "Écris <code>table(n)</code> qui renvoie la liste <code>[n×1, n×2, …, n×10]</code>.",
"starter": "def table(n):\n    L = []\n    return L\n",
"indice": "Utilise <code>L.append(n*k)</code> dans une boucle de 1 à 10.",
"solution": "def table(n):\n    L = []\n    for k in range(1, 11):\n        L.append(n * k)\n    return L\n",
"tests": [
{
"call": "table(3)",
"expect": "[3, 6, 9, 12, 15, 18, 21, 24, 27, 30]",
"approx": false
},
{
"call": "table(1)",
"expect": "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
"approx": false
}
]
},
{
"n": 16,
"titre": "Somme d'une liste",
"enonce": "Écris <code>somme_liste(L)</code> qui renvoie la somme des éléments, <strong>sans <code>sum</code></strong>.",
"starter": "def somme_liste(L):\n    S = 0\n    return S\n",
"indice": "Parcours <code>for x in L: S += x</code>.",
"solution": "def somme_liste(L):\n    S = 0\n    for x in L:\n        S += x\n    return S\n",
"tests": [
{
"call": "somme_liste([1, 2, 3, 4])",
"expect": "10",
"approx": false
},
{
"call": "somme_liste([])",
"expect": "0",
"approx": false
},
{
"call": "somme_liste([-5, 5])",
"expect": "0",
"approx": false
}
]
},
{
"n": 17,
"titre": "Maximum d'une liste",
"enonce": "Écris <code>maximum_liste(L)</code> qui renvoie le plus grand élément d'une liste non vide, <strong>sans <code>max</code></strong>.",
"starter": "def maximum_liste(L):\n    m = L[0]\n    return m\n",
"indice": "Initialise avec le premier élément puis compare aux suivants.",
"solution": "def maximum_liste(L):\n    m = L[0]\n    for x in L:\n        if x > m:\n            m = x\n    return m\n",
"tests": [
{
"call": "maximum_liste([3, 9, 2, 9])",
"expect": "9",
"approx": false
},
{
"call": "maximum_liste([-1, -5, -2])",
"expect": "-1",
"approx": false
},
{
"call": "maximum_liste([7])",
"expect": "7",
"approx": false
}
]
},
{
"n": 18,
"titre": "Compter les positifs",
"enonce": "Écris <code>compte_positifs(L)</code> qui renvoie le nombre d'éléments strictement positifs.",
"starter": "def compte_positifs(L):\n    c = 0\n    return c\n",
"indice": "Teste <code>if x > 0</code>.",
"solution": "def compte_positifs(L):\n    c = 0\n    for x in L:\n        if x > 0:\n            c += 1\n    return c\n",
"tests": [
{
"call": "compte_positifs([-2, 3, 0, 5, -1])",
"expect": "2",
"approx": false
},
{
"call": "compte_positifs([1, 2, 3])",
"expect": "3",
"approx": false
},
{
"call": "compte_positifs([-1, -2])",
"expect": "0",
"approx": false
}
]
},
{
"n": 19,
"titre": "Inverser une liste",
"enonce": "Écris <code>inverse_liste(L)</code> qui renvoie une nouvelle liste avec les éléments dans l'ordre inverse.",
"starter": "def inverse_liste(L):\n    return []\n",
"indice": "Le slicing <code>L[::-1]</code> renverse une liste.",
"solution": "def inverse_liste(L):\n    return L[::-1]\n",
"tests": [
{
"call": "inverse_liste([1, 2, 3])",
"expect": "[3, 2, 1]",
"approx": false
},
{
"call": "inverse_liste([])",
"expect": "[]",
"approx": false
},
{
"call": "inverse_liste([4, 4, 5])",
"expect": "[5, 4, 4]",
"approx": false
}
]
},
{
"n": 20,
"titre": "Somme des carrés",
"enonce": "Écris <code>somme_carres(n)</code> qui renvoie \\(1^2 + 2^2 + \\dots + n^2\\).",
"starter": "def somme_carres(n):\n    S = 0\n    return S\n",
"indice": "Ajoute <code>k**2</code> dans la boucle. (Formule : n(n+1)(2n+1)/6.)",
"solution": "def somme_carres(n):\n    S = 0\n    for k in range(1, n + 1):\n        S += k**2\n    return S\n",
"tests": [
{
"call": "somme_carres(3)",
"expect": "14",
"approx": false
},
{
"call": "somme_carres(1)",
"expect": "1",
"approx": false
},
{
"call": "somme_carres(10)",
"expect": "385",
"approx": false
}
]
},
{
"n": 21,
"titre": "Somme des cubes",
"enonce": "Écris <code>somme_cubes(n)</code> qui renvoie \\(1^3 + 2^3 + \\dots + n^3\\).",
"starter": "def somme_cubes(n):\n    S = 0\n    return S\n",
"indice": "Ajoute <code>k**3</code>. (C'est le carré de la somme des entiers.)",
"solution": "def somme_cubes(n):\n    S = 0\n    for k in range(1, n + 1):\n        S += k**3\n    return S\n",
"tests": [
{
"call": "somme_cubes(3)",
"expect": "36",
"approx": false
},
{
"call": "somme_cubes(1)",
"expect": "1",
"approx": false
},
{
"call": "somme_cubes(4)",
"expect": "100",
"approx": false
}
]
},
{
"n": 22,
"titre": "Moyenne d'une liste",
"enonce": "Écris <code>moyenne(L)</code> qui renvoie la moyenne des éléments d'une liste non vide.",
"starter": "def moyenne(L):\n    pass\n",
"indice": "Moyenne = somme / effectif : <code>sum(L)/len(L)</code>.",
"solution": "def moyenne(L):\n    return sum(L) / len(L)\n",
"tests": [
{
"call": "moyenne([2, 4, 6])",
"expect": "4.0",
"approx": true
},
{
"call": "moyenne([10])",
"expect": "10.0",
"approx": true
},
{
"call": "moyenne([1, 2, 3, 4])",
"expect": "2.5",
"approx": true
}
]
},
{
"n": 23,
"titre": "La variance",
"enonce": "Écris <code>variance(L)</code> qui renvoie la variance empirique \\(\\frac1n\\sum x_i^2 - \\bar x^2\\).",
"starter": "def variance(L):\n    pass\n",
"indice": "Calcule la moyenne, puis la moyenne des carrés, et applique Kœnig-Huygens.",
"solution": "def variance(L):\n    m = sum(L) / len(L)\n    m2 = sum(x*x for x in L) / len(L)\n    return m2 - m*m\n",
"tests": [
{
"call": "variance([2, 4, 4, 6, 9])",
"expect": "5.6",
"approx": true
},
{
"call": "variance([5, 5, 5])",
"expect": "0.0",
"approx": true
},
{
"call": "variance([1, 3])",
"expect": "1.0",
"approx": true
}
]
},
{
"n": 24,
"titre": "Produit d'une liste",
"enonce": "Écris <code>produit_liste(L)</code> qui renvoie le produit de tous les éléments.",
"starter": "def produit_liste(L):\n    p = 1\n    return p\n",
"indice": "Initialise à 1 (produit vide).",
"solution": "def produit_liste(L):\n    p = 1\n    for x in L:\n        p *= x\n    return p\n",
"tests": [
{
"call": "produit_liste([1, 2, 3, 4])",
"expect": "24",
"approx": false
},
{
"call": "produit_liste([])",
"expect": "1",
"approx": false
},
{
"call": "produit_liste([5, 0, 9])",
"expect": "0",
"approx": false
}
]
},
{
"n": 25,
"titre": "Coefficient binomial",
"enonce": "Écris <code>binomial(n, k)</code> qui renvoie \\(\\binom{n}{k} = \\frac{n!}{k!(n-k)!}\\).",
"starter": "def binomial(n, k):\n    pass\n",
"indice": "Réutilise une factorielle, ou multiplie/divise progressivement.",
"solution": "def binomial(n, k):\n    def fact(m):\n        p = 1\n        for i in range(1, m + 1):\n            p *= i\n        return p\n    return fact(n) // (fact(k) * fact(n - k))\n",
"tests": [
{
"call": "binomial(5, 2)",
"expect": "10",
"approx": false
},
{
"call": "binomial(10, 0)",
"expect": "1",
"approx": false
},
{
"call": "binomial(6, 3)",
"expect": "20",
"approx": false
}
]
},
{
"n": 26,
"titre": "Suite arithmétique",
"enonce": "Une suite arithmétique vérifie \\(u_n = u_0 + n r\\). Écris <code>suite_arith(u0, r, n)</code> qui renvoie \\(u_n\\).",
"starter": "def suite_arith(u0, r, n):\n    pass\n",
"indice": "Applique directement la formule close.",
"solution": "def suite_arith(u0, r, n):\n    return u0 + n * r\n",
"tests": [
{
"call": "suite_arith(3, 2, 5)",
"expect": "13",
"approx": false
},
{
"call": "suite_arith(0, 1, 100)",
"expect": "100",
"approx": false
},
{
"call": "suite_arith(10, -2, 4)",
"expect": "2",
"approx": false
}
]
},
{
"n": 27,
"titre": "Suite géométrique",
"enonce": "Une suite géométrique vérifie \\(u_n = u_0 q^n\\). Écris <code>suite_geom(u0, q, n)</code>.",
"starter": "def suite_geom(u0, q, n):\n    pass\n",
"indice": "Formule close <code>u0 * q**n</code>.",
"solution": "def suite_geom(u0, q, n):\n    return u0 * q**n\n",
"tests": [
{
"call": "suite_geom(1, 2, 10)",
"expect": "1024",
"approx": false
},
{
"call": "suite_geom(3, 1, 5)",
"expect": "3",
"approx": false
},
{
"call": "suite_geom(2, 3, 3)",
"expect": "54",
"approx": false
}
]
},
{
"n": 28,
"titre": "Suite récurrente",
"enonce": "Soit \\(u_0 = 2\\) et \\(u_{k+1} = 3u_k + 1\\). Écris <code>suite_rec(n)</code> qui renvoie \\(u_n\\).",
"starter": "def suite_rec(n):\n    x = 2\n    return x\n",
"indice": "Pars de <code>x = 2</code> et itère <code>n</code> fois <code>x = 3*x + 1</code>.",
"solution": "def suite_rec(n):\n    x = 2\n    for k in range(n):\n        x = 3 * x + 1\n    return x\n",
"tests": [
{
"call": "suite_rec(0)",
"expect": "2",
"approx": false
},
{
"call": "suite_rec(1)",
"expect": "7",
"approx": false
},
{
"call": "suite_rec(2)",
"expect": "22",
"approx": false
}
]
},
{
"n": 29,
"titre": "Fibonacci",
"enonce": "La suite de Fibonacci : \\(F_0=0\\), \\(F_1=1\\), \\(F_{n+2}=F_{n+1}+F_n\\). Écris <code>fibonacci(n)</code>.",
"starter": "def fibonacci(n):\n    a, b = 0, 1\n    return a\n",
"indice": "Mets à jour simultanément : <code>a, b = b, a + b</code>.",
"solution": "def fibonacci(n):\n    a, b = 0, 1\n    for k in range(n):\n        a, b = b, a + b\n    return a\n",
"tests": [
{
"call": "fibonacci(0)",
"expect": "0",
"approx": false
},
{
"call": "fibonacci(10)",
"expect": "55",
"approx": false
},
{
"call": "fibonacci(1)",
"expect": "1",
"approx": false
}
]
},
{
"n": 30,
"titre": "PGCD (Euclide)",
"enonce": "Écris <code>pgcd(a, b)</code> par l'algorithme d'Euclide.",
"starter": "def pgcd(a, b):\n    return a\n",
"indice": "Tant que <code>b != 0</code> : <code>a, b = b, a % b</code>.",
"solution": "def pgcd(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a\n",
"tests": [
{
"call": "pgcd(36, 24)",
"expect": "12",
"approx": false
},
{
"call": "pgcd(17, 5)",
"expect": "1",
"approx": false
},
{
"call": "pgcd(100, 40)",
"expect": "20",
"approx": false
}
]
},
{
"n": 31,
"titre": "Nombre premier",
"enonce": "Écris <code>est_premier(n)</code> qui renvoie <code>True</code> si <code>n</code> est premier.",
"starter": "def est_premier(n):\n    pass\n",
"indice": "Teste les diviseurs de 2 à n-1 ; n<2 n'est pas premier.",
"solution": "def est_premier(n):\n    if n < 2:\n        return False\n    for d in range(2, n):\n        if n % d == 0:\n            return False\n    return True\n",
"tests": [
{
"call": "est_premier(7)",
"expect": "True",
"approx": false
},
{
"call": "est_premier(1)",
"expect": "False",
"approx": false
},
{
"call": "est_premier(12)",
"expect": "False",
"approx": false
}
]
},
{
"n": 32,
"titre": "Nombre de diviseurs",
"enonce": "Écris <code>nb_diviseurs(n)</code> qui renvoie le nombre de diviseurs positifs de <code>n</code>.",
"starter": "def nb_diviseurs(n):\n    c = 0\n    return c\n",
"indice": "Compte les <code>d</code> de 1 à n tels que <code>n % d == 0</code>.",
"solution": "def nb_diviseurs(n):\n    c = 0\n    for d in range(1, n + 1):\n        if n % d == 0:\n            c += 1\n    return c\n",
"tests": [
{
"call": "nb_diviseurs(12)",
"expect": "6",
"approx": false
},
{
"call": "nb_diviseurs(7)",
"expect": "2",
"approx": false
},
{
"call": "nb_diviseurs(1)",
"expect": "1",
"approx": false
}
]
},
{
"n": 33,
"titre": "Somme des chiffres",
"enonce": "Écris <code>somme_chiffres(n)</code> qui renvoie la somme des chiffres de l'entier <code>n</code> (n ≥ 0).",
"starter": "def somme_chiffres(n):\n    s = 0\n    return s\n",
"indice": "<code>n % 10</code> donne le dernier chiffre, <code>n // 10</code> l'enlève.",
"solution": "def somme_chiffres(n):\n    s = 0\n    while n > 0:\n        s += n % 10\n        n //= 10\n    return s\n",
"tests": [
{
"call": "somme_chiffres(2024)",
"expect": "8",
"approx": false
},
{
"call": "somme_chiffres(0)",
"expect": "0",
"approx": false
},
{
"call": "somme_chiffres(999)",
"expect": "27",
"approx": false
}
]
},
{
"n": 34,
"titre": "Évaluer un polynôme",
"enonce": "Un polynôme est donné par ses coefficients <code>[a0, a1, …, ad]</code>. Écris <code>eval_poly(coeffs, x)</code> qui renvoie \\(\\sum_i a_i x^i\\).",
"starter": "def eval_poly(coeffs, x):\n    S = 0\n    return S\n",
"indice": "Utilise <code>enumerate(coeffs)</code> pour avoir l'indice i.",
"solution": "def eval_poly(coeffs, x):\n    S = 0\n    for i, a in enumerate(coeffs):\n        S += a * x**i\n    return S\n",
"tests": [
{
"call": "eval_poly([3, -2, 0, 1], 2)",
"expect": "7",
"approx": false
},
{
"call": "eval_poly([1, 1], 5)",
"expect": "6",
"approx": false
},
{
"call": "eval_poly([0], 9)",
"expect": "0",
"approx": false
}
]
},
{
"n": 35,
"titre": "Moyenne pondérée",
"enonce": "Écris <code>moyenne_ponderee(valeurs, poids)</code> = \\(\\frac{\\sum v_i p_i}{\\sum p_i}\\).",
"starter": "def moyenne_ponderee(valeurs, poids):\n    pass\n",
"indice": "Calcule le numérateur et le dénominateur séparément.",
"solution": "def moyenne_ponderee(valeurs, poids):\n    num = 0\n    den = 0\n    for v, p in zip(valeurs, poids):\n        num += v * p\n        den += p\n    return num / den\n",
"tests": [
{
"call": "moyenne_ponderee([10, 12], [1, 3])",
"expect": "11.5",
"approx": true
},
{
"call": "moyenne_ponderee([20, 0], [1, 1])",
"expect": "10.0",
"approx": true
},
{
"call": "moyenne_ponderee([5], [2])",
"expect": "5.0",
"approx": true
}
]
},
{
"n": 36,
"titre": "Somme harmonique",
"enonce": "Écris <code>harmonique(n)</code> = \\(\\sum_{k=1}^n \\frac1k\\).",
"starter": "def harmonique(n):\n    S = 0\n    return S\n",
"indice": "Attention : <code>1/k</code> pour avoir un flottant.",
"solution": "def harmonique(n):\n    S = 0\n    for k in range(1, n + 1):\n        S += 1 / k\n    return S\n",
"tests": [
{
"call": "harmonique(1)",
"expect": "1.0",
"approx": true
},
{
"call": "harmonique(3)",
"expect": "1.8333333333",
"approx": true
},
{
"call": "harmonique(4)",
"expect": "2.0833333333",
"approx": true
}
]
},
{
"n": 37,
"titre": "Exponentielle en série",
"enonce": "Écris <code>exp_serie(x, n)</code> = \\(\\sum_{k=0}^{n} \\frac{x^k}{k!}\\) (approximation de \\(e^x\\)).",
"starter": "def exp_serie(x, n):\n    S = 0\n    fact = 1\n    return S\n",
"indice": "Mets à jour la factorielle au fur et à mesure : <code>fact *= k</code>.",
"solution": "def exp_serie(x, n):\n    S = 1.0\n    fact = 1\n    for k in range(1, n + 1):\n        fact *= k\n        S += x**k / fact\n    return S\n",
"tests": [
{
"call": "exp_serie(0, 10)",
"expect": "1.0",
"approx": true
},
{
"call": "exp_serie(1, 20)",
"expect": "2.7182818284",
"approx": true
},
{
"call": "exp_serie(2, 30)",
"expect": "7.3890560989",
"approx": true
}
]
},
{
"n": 38,
"titre": "Racine carrée (Héron)",
"enonce": "Écris <code>racine(a)</code> qui approche \\(\\sqrt a\\) par la méthode de Héron : \\(x_{k+1} = \\frac12(x_k + a/x_k)\\), en 30 itérations depuis \\(x_0 = a\\) (a > 0).",
"starter": "def racine(a):\n    x = a\n    return x\n",
"indice": "Répète 30 fois <code>x = 0.5*(x + a/x)</code>.",
"solution": "def racine(a):\n    x = float(a)\n    for k in range(30):\n        x = 0.5 * (x + a / x)\n    return x\n",
"tests": [
{
"call": "racine(2)",
"expect": "1.41421356237",
"approx": true
},
{
"call": "racine(9)",
"expect": "3.0",
"approx": true
},
{
"call": "racine(100)",
"expect": "10.0",
"approx": true
}
]
},
{
"n": 39,
"titre": "Série alternée",
"enonce": "Écris <code>serie_alternee(n)</code> = \\(\\sum_{k=1}^{n} \\frac{(-1)^{k+1}}{k}\\) (approche \\(\\ln 2\\)).",
"starter": "def serie_alternee(n):\n    S = 0\n    return S\n",
"indice": "Le signe est <code>(-1)**(k+1)</code>.",
"solution": "def serie_alternee(n):\n    S = 0\n    for k in range(1, n + 1):\n        S += (-1)**(k + 1) / k\n    return S\n",
"tests": [
{
"call": "serie_alternee(1)",
"expect": "1.0",
"approx": true
},
{
"call": "serie_alternee(4)",
"expect": "0.5833333333",
"approx": true
},
{
"call": "serie_alternee(2)",
"expect": "0.5",
"approx": true
}
]
},
{
"n": 40,
"titre": "Ligne du triangle de Pascal",
"enonce": "Écris <code>ligne_pascal(n)</code> qui renvoie la liste \\([\\binom{n}{0}, \\dots, \\binom{n}{n}]\\).",
"starter": "def ligne_pascal(n):\n    L = [1]\n    return L\n",
"indice": "Chaque terme se déduit du précédent : \\(\\binom{n}{k+1} = \\binom{n}{k}\\frac{n-k}{k+1}\\).",
"solution": "def ligne_pascal(n):\n    L = [1]\n    for k in range(n):\n        L.append(L[-1] * (n - k) // (k + 1))\n    return L\n",
"tests": [
{
"call": "ligne_pascal(4)",
"expect": "[1, 4, 6, 4, 1]",
"approx": false
},
{
"call": "ligne_pascal(0)",
"expect": "[1]",
"approx": false
},
{
"call": "ligne_pascal(1)",
"expect": "[1, 1]",
"approx": false
}
]
},
{
"n": 41,
"titre": "Nombre parfait",
"enonce": "Un nombre est <em>parfait</em> s'il est égal à la somme de ses diviseurs stricts. Écris <code>est_parfait(n)</code>.",
"starter": "def est_parfait(n):\n    pass\n",
"indice": "Somme les diviseurs de 1 à n-1 qui divisent n, compare à n.",
"solution": "def est_parfait(n):\n    s = 0\n    for d in range(1, n):\n        if n % d == 0:\n            s += d\n    return s == n\n",
"tests": [
{
"call": "est_parfait(6)",
"expect": "True",
"approx": false
},
{
"call": "est_parfait(28)",
"expect": "True",
"approx": false
},
{
"call": "est_parfait(10)",
"expect": "False",
"approx": false
}
]
},
{
"n": 42,
"titre": "Renverser un entier",
"enonce": "Écris <code>renverser(n)</code> qui renvoie l'entier formé des chiffres de <code>n</code> à l'envers (n ≥ 0).",
"starter": "def renverser(n):\n    r = 0\n    return r\n",
"indice": "<code>r = r*10 + n%10</code> puis <code>n //= 10</code>.",
"solution": "def renverser(n):\n    r = 0\n    while n > 0:\n        r = r * 10 + n % 10\n        n //= 10\n    return r\n",
"tests": [
{
"call": "renverser(1234)",
"expect": "4321",
"approx": false
},
{
"call": "renverser(100)",
"expect": "1",
"approx": false
},
{
"call": "renverser(7)",
"expect": "7",
"approx": false
}
]
},
{
"n": 43,
"titre": "Conversion en binaire",
"enonce": "Écris <code>en_binaire(n)</code> qui renvoie la chaîne de l'écriture binaire de <code>n</code> (n ≥ 1), <strong>sans <code>bin</code></strong>.",
"starter": "def en_binaire(n):\n    s = ''\n    return s\n",
"indice": "Ajoute <code>str(n%2)</code> devant, puis <code>n //= 2</code>.",
"solution": "def en_binaire(n):\n    s = ''\n    while n > 0:\n        s = str(n % 2) + s\n        n //= 2\n    return s\n",
"tests": [
{
"call": "en_binaire(5)",
"expect": "'101'",
"approx": false
},
{
"call": "en_binaire(8)",
"expect": "'1000'",
"approx": false
},
{
"call": "en_binaire(1)",
"expect": "'1'",
"approx": false
}
]
},
{
"n": 44,
"titre": "Compter les occurrences",
"enonce": "Écris <code>occurrences(L, x)</code> qui renvoie le nombre de fois où <code>x</code> apparaît dans <code>L</code>, <strong>sans <code>count</code></strong>.",
"starter": "def occurrences(L, x):\n    c = 0\n    return c\n",
"indice": "Teste <code>if y == x</code> pour chaque <code>y</code>.",
"solution": "def occurrences(L, x):\n    c = 0\n    for y in L:\n        if y == x:\n            c += 1\n    return c\n",
"tests": [
{
"call": "occurrences([1, 2, 1, 3, 1], 1)",
"expect": "3",
"approx": false
},
{
"call": "occurrences([4, 5], 9)",
"expect": "0",
"approx": false
},
{
"call": "occurrences([7, 7], 7)",
"expect": "2",
"approx": false
}
]
},
{
"n": 45,
"titre": "Indice du maximum",
"enonce": "Écris <code>indice_max(L)</code> qui renvoie l'indice de la première occurrence du plus grand élément.",
"starter": "def indice_max(L):\n    im = 0\n    return im\n",
"indice": "Compare <code>L[i]</code> à <code>L[im]</code>.",
"solution": "def indice_max(L):\n    im = 0\n    for i in range(1, len(L)):\n        if L[i] > L[im]:\n            im = i\n    return im\n",
"tests": [
{
"call": "indice_max([3, 9, 2, 9])",
"expect": "1",
"approx": false
},
{
"call": "indice_max([5])",
"expect": "0",
"approx": false
},
{
"call": "indice_max([1, 2, 3])",
"expect": "2",
"approx": false
}
]
},
{
"n": 46,
"titre": "Tri croissant",
"enonce": "Écris <code>trier(L)</code> qui renvoie une nouvelle liste triée par ordre croissant.",
"starter": "def trier(L):\n    pass\n",
"indice": "Tu peux utiliser <code>sorted(L)</code>, ou coder un tri à bulles.",
"solution": "def trier(L):\n    return sorted(L)\n",
"tests": [
{
"call": "trier([3, 1, 2])",
"expect": "[1, 2, 3]",
"approx": false
},
{
"call": "trier([])",
"expect": "[]",
"approx": false
},
{
"call": "trier([5, 5, 1])",
"expect": "[1, 5, 5]",
"approx": false
}
]
},
{
"n": 47,
"titre": "La médiane",
"enonce": "Écris <code>mediane(L)</code> qui renvoie la médiane (moyenne des deux valeurs centrales si l'effectif est pair). Liste non vide.",
"starter": "def mediane(L):\n    pass\n",
"indice": "Trie d'abord, puis regarde le milieu selon la parité de <code>len(L)</code>.",
"solution": "def mediane(L):\n    T = sorted(L)\n    n = len(T)\n    if n % 2 == 1:\n        return float(T[n // 2])\n    return (T[n // 2 - 1] + T[n // 2]) / 2\n",
"tests": [
{
"call": "mediane([3, 1, 2])",
"expect": "2.0",
"approx": true
},
{
"call": "mediane([1, 2, 3, 4])",
"expect": "2.5",
"approx": true
},
{
"call": "mediane([7])",
"expect": "7.0",
"approx": true
}
]
},
{
"n": 48,
"titre": "Produit scalaire",
"enonce": "Écris <code>produit_scalaire(U, V)</code> = \\(\\sum_i U_i V_i\\) (listes de même longueur).",
"starter": "def produit_scalaire(U, V):\n    S = 0\n    return S\n",
"indice": "Parcours par indices ou avec <code>zip(U, V)</code>.",
"solution": "def produit_scalaire(U, V):\n    S = 0\n    for u, v in zip(U, V):\n        S += u * v\n    return S\n",
"tests": [
{
"call": "produit_scalaire([1, 2, 3], [4, 5, 6])",
"expect": "32",
"approx": false
},
{
"call": "produit_scalaire([1, 0], [0, 1])",
"expect": "0",
"approx": false
},
{
"call": "produit_scalaire([2], [3])",
"expect": "6",
"approx": false
}
]
},
{
"n": 49,
"titre": "La norme d'un vecteur",
"enonce": "Écris <code>norme(V)</code> = \\(\\sqrt{\\sum_i V_i^2}\\).",
"starter": "def norme(V):\n    pass\n",
"indice": "Somme les carrés puis élève à la puissance 0.5.",
"solution": "def norme(V):\n    return sum(v*v for v in V) ** 0.5\n",
"tests": [
{
"call": "norme([3, 4])",
"expect": "5.0",
"approx": true
},
{
"call": "norme([0, 0])",
"expect": "0.0",
"approx": true
},
{
"call": "norme([1, 2, 2])",
"expect": "3.0",
"approx": true
}
]
},
{
"n": 50,
"titre": "La facture avec remise",
"enonce": "Un magasin applique <strong>10 % de remise</strong> si le total des articles dépasse 100 €. Écris <code>facture(prix)</code> qui prend une liste de prix et renvoie le montant à payer.",
"starter": "def facture(prix):\n    total = 0\n    return total\n",
"indice": "Somme les prix ; si le total > 100, multiplie par 0.9.",
"solution": "def facture(prix):\n    total = sum(prix)\n    if total > 100:\n        total = total * 0.9\n    return total\n",
"tests": [
{
"call": "facture([50, 60])",
"expect": "99.0",
"approx": true
},
{
"call": "facture([30, 20])",
"expect": "50.0",
"approx": true
},
{
"call": "facture([200])",
"expect": "180.0",
"approx": true
}
]
},
{
"n": 51,
"titre": "Nombre d'admis",
"enonce": "Écris <code>nb_admis(notes)</code> qui renvoie combien de notes sont supérieures ou égales à 10.",
"starter": "def nb_admis(notes):\n    c = 0\n    return c\n",
"indice": "Compte <code>if note >= 10</code>.",
"solution": "def nb_admis(notes):\n    c = 0\n    for note in notes:\n        if note >= 10:\n            c += 1\n    return c\n",
"tests": [
{
"call": "nb_admis([8, 12, 10, 6, 15])",
"expect": "3",
"approx": false
},
{
"call": "nb_admis([9, 9])",
"expect": "0",
"approx": false
},
{
"call": "nb_admis([20])",
"expect": "1",
"approx": false
}
]
},
{
"n": 52,
"titre": "La mention",
"enonce": "Écris <code>mention(moy)</code> qui renvoie la mention : <code>'TB'</code> si ≥ 16, <code>'B'</code> si ≥ 14, <code>'AB'</code> si ≥ 12, <code>'passable'</code> si ≥ 10, sinon <code>'refuse'</code>.",
"starter": "def mention(moy):\n    pass\n",
"indice": "Enchaîne les <code>if / elif</code> du plus grand au plus petit.",
"solution": "def mention(moy):\n    if moy >= 16:\n        return 'TB'\n    elif moy >= 14:\n        return 'B'\n    elif moy >= 12:\n        return 'AB'\n    elif moy >= 10:\n        return 'passable'\n    else:\n        return 'refuse'\n",
"tests": [
{
"call": "mention(17)",
"expect": "'TB'",
"approx": false
},
{
"call": "mention(13)",
"expect": "'AB'",
"approx": false
},
{
"call": "mention(8)",
"expect": "'refuse'",
"approx": false
}
]
},
{
"n": 53,
"titre": "Compter les mots",
"enonce": "Écris <code>compte_mots(phrase)</code> qui renvoie le nombre de mots (séparés par des espaces).",
"starter": "def compte_mots(phrase):\n    pass\n",
"indice": "La méthode <code>split()</code> découpe sur les espaces.",
"solution": "def compte_mots(phrase):\n    return len(phrase.split())\n",
"tests": [
{
"call": "compte_mots('je code en python')",
"expect": "4",
"approx": false
},
{
"call": "compte_mots('bonjour')",
"expect": "1",
"approx": false
},
{
"call": "compte_mots('a b  c')",
"expect": "3",
"approx": false
}
]
},
{
"n": 54,
"titre": "Palindrome",
"enonce": "Écris <code>est_palindrome(s)</code> qui renvoie <code>True</code> si la chaîne se lit pareil dans les deux sens.",
"starter": "def est_palindrome(s):\n    pass\n",
"indice": "Compare <code>s</code> à <code>s[::-1]</code>.",
"solution": "def est_palindrome(s):\n    return s == s[::-1]\n",
"tests": [
{
"call": "est_palindrome('kayak')",
"expect": "True",
"approx": false
},
{
"call": "est_palindrome('python')",
"expect": "False",
"approx": false
},
{
"call": "est_palindrome('ressasser')",
"expect": "True",
"approx": false
}
]
},
{
"n": 55,
"titre": "Chiffrement de César",
"enonce": "Écris <code>cesar(s, k)</code> qui décale chaque lettre minuscule de <code>k</code> positions dans l'alphabet (avec retour au début). Les autres caractères sont inchangés.",
"starter": "def cesar(s, k):\n    r = ''\n    return r\n",
"indice": "Pour une lettre : <code>chr((ord(c) - 97 + k) % 26 + 97)</code>.",
"solution": "def cesar(s, k):\n    r = ''\n    for c in s:\n        if 'a' <= c <= 'z':\n            r += chr((ord(c) - 97 + k) % 26 + 97)\n        else:\n            r += c\n    return r\n",
"tests": [
{
"call": "cesar('abc', 1)",
"expect": "'bcd'",
"approx": false
},
{
"call": "cesar('xyz', 3)",
"expect": "'abc'",
"approx": false
},
{
"call": "cesar('a b', 1)",
"expect": "'b c'",
"approx": false
}
]
},
{
"n": 56,
"titre": "Seuil d'une suite",
"enonce": "Soit \\(u_0 = 1\\), \\(u_{k+1} = 2u_k + 1\\). Écris <code>seuil(A)</code> qui renvoie le plus petit \\(n\\) tel que \\(u_n > A\\).",
"starter": "def seuil(A):\n    u = 1\n    n = 0\n    return n\n",
"indice": "Boucle <code>while u <= A</code> en incrémentant <code>n</code>.",
"solution": "def seuil(A):\n    u = 1\n    n = 0\n    while u <= A:\n        u = 2 * u + 1\n        n += 1\n    return n\n",
"tests": [
{
"call": "seuil(1)",
"expect": "1",
"approx": false
},
{
"call": "seuil(100)",
"expect": "6",
"approx": false
},
{
"call": "seuil(0)",
"expect": "0",
"approx": false
}
]
},
{
"n": 57,
"titre": "Racine par dichotomie",
"enonce": "Écris <code>dicho_racine(a)</code> qui approche \\(\\sqrt a\\) (0 ≤ a) par dichotomie sur \\([0, a+1]\\) jusqu'à une largeur < 1e-9.",
"starter": "def dicho_racine(a):\n    lo, hi = 0.0, a + 1\n    return (lo + hi) / 2\n",
"indice": "Tant que <code>hi - lo > 1e-9</code> : milieu <code>m</code>, si <code>m*m <= a</code> alors <code>lo = m</code> sinon <code>hi = m</code>.",
"solution": "def dicho_racine(a):\n    lo, hi = 0.0, a + 1.0\n    while hi - lo > 1e-9:\n        m = (lo + hi) / 2\n        if m * m <= a:\n            lo = m\n        else:\n            hi = m\n    return (lo + hi) / 2\n",
"tests": [
{
"call": "dicho_racine(2)",
"expect": "1.41421356237",
"approx": true
},
{
"call": "dicho_racine(0)",
"expect": "0.0",
"approx": true
},
{
"call": "dicho_racine(9)",
"expect": "3.0",
"approx": true
}
]
},
{
"n": 58,
"titre": "Produit de matrices 2×2",
"enonce": "Une matrice 2×2 est <code>[[a, b], [c, d]]</code>. Écris <code>mat_mult(A, B)</code> qui renvoie le produit matriciel \\(AB\\).",
"starter": "def mat_mult(A, B):\n    pass\n",
"indice": "Chaque coefficient est un produit ligne × colonne.",
"solution": "def mat_mult(A, B):\n    a, b, c, d = A[0][0], A[0][1], A[1][0], A[1][1]\n    e, f, g, h = B[0][0], B[0][1], B[1][0], B[1][1]\n    return [[a*e + b*g, a*f + b*h], [c*e + d*g, c*f + d*h]]\n",
"tests": [
{
"call": "mat_mult([[1, 2], [3, 4]], [[1, 0], [0, 1]])",
"expect": "[[1, 2], [3, 4]]",
"approx": false
},
{
"call": "mat_mult([[1, 1], [0, 1]], [[1, 1], [0, 1]])",
"expect": "[[1, 2], [0, 1]]",
"approx": false
},
{
"call": "mat_mult([[2, 0], [0, 2]], [[3, 4], [5, 6]])",
"expect": "[[6, 8], [10, 12]]",
"approx": false
}
]
},
{
"n": 59,
"titre": "Puissance de matrice 2×2",
"enonce": "Écris <code>mat_puissance(A, k)</code> qui renvoie \\(A^k\\) (k ≥ 1) pour une matrice 2×2, en réutilisant le produit.",
"starter": "def mat_puissance(A, k):\n    pass\n",
"indice": "Pars de <code>A</code> et multiplie <code>k-1</code> fois par <code>A</code>.",
"solution": "def mat_mult(A, B):\n    a, b, c, d = A[0][0], A[0][1], A[1][0], A[1][1]\n    e, f, g, h = B[0][0], B[0][1], B[1][0], B[1][1]\n    return [[a*e + b*g, a*f + b*h], [c*e + d*g, c*f + d*h]]\ndef mat_puissance(A, k):\n    R = A\n    for i in range(k - 1):\n        R = mat_mult(R, A)\n    return R\n",
"tests": [
{
"call": "mat_puissance([[1, 1], [0, 1]], 5)",
"expect": "[[1, 5], [0, 1]]",
"approx": false
},
{
"call": "mat_puissance([[2, 0], [0, 2]], 3)",
"expect": "[[8, 0], [0, 8]]",
"approx": false
},
{
"call": "mat_puissance([[1, 1], [0, 1]], 1)",
"expect": "[[1, 1], [0, 1]]",
"approx": false
}
]
},
{
"n": 60,
"titre": "Moyenne mobile",
"enonce": "Écris <code>moyenne_mobile(L, k)</code> qui renvoie la liste des moyennes de chaque fenêtre de <code>k</code> éléments consécutifs.",
"starter": "def moyenne_mobile(L, k):\n    res = []\n    return res\n",
"indice": "Pour <code>i</code> de 0 à <code>len(L)-k</code>, moyenne de <code>L[i:i+k]</code>.",
"solution": "def moyenne_mobile(L, k):\n    res = []\n    for i in range(len(L) - k + 1):\n        res.append(sum(L[i:i+k]) / k)\n    return res\n",
"tests": [
{
"call": "moyenne_mobile([1, 2, 3, 4], 2)",
"expect": "[1.5, 2.5, 3.5]",
"approx": false
},
{
"call": "moyenne_mobile([2, 4, 6], 3)",
"expect": "[4.0]",
"approx": false
},
{
"call": "moyenne_mobile([5, 5, 5, 5], 2)",
"expect": "[5.0, 5.0, 5.0]",
"approx": false
}
]
},
{
"n": 61,
"titre": "Probabilité binomiale",
"enonce": "Écris <code>proba_binomiale(n, k, p)</code> = \\(\\binom{n}{k} p^k (1-p)^{n-k}\\).",
"starter": "def proba_binomiale(n, k, p):\n    pass\n",
"indice": "Réutilise un coefficient binomial puis multiplie par les puissances.",
"solution": "def proba_binomiale(n, k, p):\n    def fact(m):\n        r = 1\n        for i in range(1, m + 1):\n            r *= i\n        return r\n    binom = fact(n) // (fact(k) * fact(n - k))\n    return binom * p**k * (1 - p)**(n - k)\n",
"tests": [
{
"call": "proba_binomiale(2, 1, 0.5)",
"expect": "0.5",
"approx": true
},
{
"call": "proba_binomiale(10, 0, 0.5)",
"expect": "0.0009765625",
"approx": true
},
{
"call": "proba_binomiale(3, 3, 1.0)",
"expect": "1.0",
"approx": true
}
]
},
{
"n": 62,
"titre": "Espérance d'une loi",
"enonce": "Une loi est donnée par <code>valeurs</code> et <code>probas</code>. Écris <code>esperance(valeurs, probas)</code> = \\(\\sum x_i p_i\\).",
"starter": "def esperance(valeurs, probas):\n    E = 0\n    return E\n",
"indice": "Somme les produits <code>x * p</code>.",
"solution": "def esperance(valeurs, probas):\n    E = 0\n    for x, p in zip(valeurs, probas):\n        E += x * p\n    return E\n",
"tests": [
{
"call": "esperance([1, 2, 3], [0.2, 0.5, 0.3])",
"expect": "2.1",
"approx": true
},
{
"call": "esperance([0, 1], [0.5, 0.5])",
"expect": "0.5",
"approx": true
},
{
"call": "esperance([10], [1])",
"expect": "10",
"approx": true
}
]
},
{
"n": 63,
"titre": "Variance d'une loi",
"enonce": "Écris <code>variance_loi(valeurs, probas)</code> = \\(E(X^2) - E(X)^2\\).",
"starter": "def variance_loi(valeurs, probas):\n    pass\n",
"indice": "Calcule E(X) et E(X²) par deux sommes, puis applique Kœnig-Huygens.",
"solution": "def variance_loi(valeurs, probas):\n    E = 0\n    E2 = 0\n    for x, p in zip(valeurs, probas):\n        E += x * p\n        E2 += x * x * p\n    return E2 - E * E\n",
"tests": [
{
"call": "variance_loi([0, 1], [0.5, 0.5])",
"expect": "0.25",
"approx": true
},
{
"call": "variance_loi([1, 2, 3], [0.2, 0.5, 0.3])",
"expect": "0.49",
"approx": true
},
{
"call": "variance_loi([5, 5], [0.5, 0.5])",
"expect": "0.0",
"approx": true
}
]
},
{
"n": 64,
"titre": "Lancer de dés (aléatoire reproductible)",
"enonce": "Écris <code>somme_des(n, graine)</code> qui fixe la graine (<code>random.seed(graine)</code>) puis renvoie la somme de <code>n</code> lancers d'un dé à 6 faces. <span class='small muted'>La graine rend le résultat reproductible.</span>",
"starter": "import random\ndef somme_des(n, graine):\n    random.seed(graine)\n    S = 0\n    return S\n",
"indice": "Après <code>random.seed(graine)</code>, additionne <code>random.randint(1, 6)</code> n fois.",
"solution": "import random\ndef somme_des(n, graine):\n    random.seed(graine)\n    S = 0\n    for i in range(n):\n        S += random.randint(1, 6)\n    return S\n",
"tests": [
{
"call": "somme_des(3, 42)",
"expect": "8",
"approx": false
},
{
"call": "somme_des(0, 1)",
"expect": "0",
"approx": false
},
{
"call": "somme_des(5, 7)",
"expect": "16",
"approx": false
}
]
},
{
"n": 65,
"titre": "Fréquence du six",
"enonce": "Écris <code>freq_six(N, graine)</code> qui simule <code>N</code> lancers (graine fixée) et renvoie la fréquence d'apparition du 6.",
"starter": "import random\ndef freq_six(N, graine):\n    random.seed(graine)\n    c = 0\n    return c / N\n",
"indice": "Compte les lancers égaux à 6, divise par N.",
"solution": "import random\ndef freq_six(N, graine):\n    random.seed(graine)\n    c = 0\n    for i in range(N):\n        if random.randint(1, 6) == 6:\n            c += 1\n    return c / N\n",
"tests": [
{
"call": "freq_six(1000, 42)",
"expect": "0.175",
"approx": true
},
{
"call": "freq_six(100, 1)",
"expect": "0.2",
"approx": true
}
]
},
{
"n": 66,
"titre": "Estimation de π (Monte-Carlo)",
"enonce": "Écris <code>estime_pi(N, graine)</code> qui tire <code>N</code> points dans le carré [0,1]² (graine fixée) et renvoie \\(4 \\times \\frac{\\text{points dans le quart de disque}}{N}\\).",
"starter": "import random\ndef estime_pi(N, graine):\n    random.seed(graine)\n    c = 0\n    return 4 * c / N\n",
"indice": "Un point (x, y) est dans le quart de disque si <code>x*x + y*y <= 1</code>.",
"solution": "import random\ndef estime_pi(N, graine):\n    random.seed(graine)\n    c = 0\n    for i in range(N):\n        x = random.random()\n        y = random.random()\n        if x*x + y*y <= 1:\n            c += 1\n    return 4 * c / N\n",
"tests": [
{
"call": "estime_pi(10000, 42)",
"expect": "3.126",
"approx": true
}
]
},
{
"n": 67,
"titre": "Suite de Syracuse",
"enonce": "Écris <code>syracuse(n)</code> qui renvoie le nombre d'étapes pour atteindre 1 : si pair on divise par 2, sinon <code>3n+1</code>.",
"starter": "def syracuse(n):\n    c = 0\n    return c\n",
"indice": "Boucle <code>while n > 1</code> en comptant les étapes.",
"solution": "def syracuse(n):\n    c = 0\n    while n > 1:\n        if n % 2 == 0:\n            n //= 2\n        else:\n            n = 3 * n + 1\n        c += 1\n    return c\n",
"tests": [
{
"call": "syracuse(1)",
"expect": "0",
"approx": false
},
{
"call": "syracuse(100)",
"expect": "25",
"approx": false
},
{
"call": "syracuse(6)",
"expect": "8",
"approx": false
}
]
},
{
"n": 68,
"titre": "Le crible d'Ératosthène",
"enonce": "Écris <code>premiers_jusqua(n)</code> qui renvoie la liste des nombres premiers ≤ <code>n</code>.",
"starter": "def premiers_jusqua(n):\n    res = []\n    return res\n",
"indice": "Teste la primalité de chaque entier de 2 à n (ou code un vrai crible).",
"solution": "def premiers_jusqua(n):\n    est = [True] * (n + 1)\n    res = []\n    for p in range(2, n + 1):\n        if est[p]:\n            res.append(p)\n            for m in range(p*p, n + 1, p):\n                est[m] = False\n    return res\n",
"tests": [
{
"call": "premiers_jusqua(10)",
"expect": "[2, 3, 5, 7]",
"approx": false
},
{
"call": "premiers_jusqua(2)",
"expect": "[2]",
"approx": false
},
{
"call": "premiers_jusqua(20)",
"expect": "[2, 3, 5, 7, 11, 13, 17, 19]",
"approx": false
}
]
},
{
"n": 69,
"titre": "Rendre la monnaie",
"enonce": "Écris <code>rendre_monnaie(somme)</code> qui renvoie la liste du nombre de pièces/billets de [50, 20, 10, 5, 2, 1] pour rendre <code>somme</code> (entier) avec le moins d'unités.",
"starter": "def rendre_monnaie(somme):\n    coupures = [50, 20, 10, 5, 2, 1]\n    res = []\n    return res\n",
"indice": "Pour chaque coupure : <code>somme // coupure</code> puis <code>somme %= coupure</code>.",
"solution": "def rendre_monnaie(somme):\n    coupures = [50, 20, 10, 5, 2, 1]\n    res = []\n    for c in coupures:\n        res.append(somme // c)\n        somme %= c\n    return res\n",
"tests": [
{
"call": "rendre_monnaie(38)",
"expect": "[0, 1, 1, 1, 1, 1]",
"approx": false
},
{
"call": "rendre_monnaie(100)",
"expect": "[2, 0, 0, 0, 0, 0]",
"approx": false
},
{
"call": "rendre_monnaie(0)",
"expect": "[0, 0, 0, 0, 0, 0]",
"approx": false
}
]
},
{
"n": 70,
"titre": "Projet : le panier de courses",
"enonce": "Un panier est une liste de couples <code>(prix, quantité)</code>. Écris <code>total_panier(panier, seuil, remise)</code> qui calcule le total ; si le total dépasse <code>seuil</code>, applique une remise de <code>remise</code> %. Renvoie le résultat arrondi à 2 décimales.",
"starter": "def total_panier(panier, seuil, remise):\n    total = 0\n    return total\n",
"indice": "Somme <code>prix * quantite</code>, teste le seuil, applique <code>total * (1 - remise/100)</code>, puis <code>round(total, 2)</code>.",
"solution": "def total_panier(panier, seuil, remise):\n    total = 0\n    for prix, quantite in panier:\n        total += prix * quantite\n    if total > seuil:\n        total = total * (1 - remise / 100)\n    return round(total, 2)\n",
"tests": [
{
"call": "total_panier([(10, 2), (5, 4)], 30, 10)",
"expect": "36.0",
"approx": true
},
{
"call": "total_panier([(3, 1)], 100, 20)",
"expect": "3.0",
"approx": true
},
{
"call": "total_panier([(50, 3)], 100, 10)",
"expect": "135.0",
"approx": true
}
]
}
];
