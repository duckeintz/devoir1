# LOG3550 – Devoir 1 : Catalogue de bibliothèque

**Étudiant :** Antoine Heintz-Duckenson
**Cours :** LOG3550 Développement web, ISTEAH
**Professeur :** Samuel Jonathan Joseph
**Lien du dépôt Git :** COLLE ICI TON LIEN GITHUB

## Description
C'est le frontend d'un catalogue de bibliothèque. Il est fait avec HTML, CSS et JavaScript purs, sans framework. On peut voir les livres, les chercher, les filtrer, les trier, en ajouter et en supprimer. Les données restent dans le navigateur grâce à `localStorage`. Dans le devoir 2, ce frontend sera relié à une API FastAPI.

## Mode d'emploi
1. Ouvrir le fichier `index.html` dans Chrome, Firefox ou Edge.
2. **Rechercher** un livre par titre ou par auteur. La recherche marche même sans majuscules ni accents.
3. **Filtrer** par catégorie ou avec « Disponibles seulement ». Les filtres marchent ensemble.
4. **Trier** par titre ou par année, dans les deux sens.
5. **Emprunter** ou **Rendre** un livre avec les boutons de la carte.
6. **Supprimer** un livre (une confirmation est demandée).
7. **Ajouter** un livre avec le formulaire en bas de la page. Les erreurs s'affichent sous chaque champ.
8. **Réinitialiser** remet les 10 livres de départ.

## Choix de conception
- **Mobile d'abord** : 1 colonne sur téléphone, 2 sur tablette, 3 sur ordinateur et 4 sur grand écran.
- **Variables CSS** dans `:root` pour les couleurs et les espaces, pour changer le style facilement.
- **Cartes générées avec JavaScript** grâce à une balise `<template>` : aucun livre n'est écrit à la main dans le HTML.
- **Accessibilité** : balises sémantiques, `label` sur chaque champ, navigation au clavier, `aria-describedby` et `aria-live` pour les messages d'erreur.
- **Étiquettes « Disponible » et « Emprunté »** : elles ont une couleur et aussi un texte, pour ne pas dépendre seulement de la couleur.
- **Un seul écouteur de clic** sur la liste pour tous les boutons des cartes.

## Réponses aux questions

### Pourquoi les balises sémantiques sont meilleures qu'une suite de div ?
Les balises sémantiques (header, nav, main, footer) disent à quoi sert chaque partie de la page. Une div ne dit rien. Pour l'accessibilité, les lecteurs d'écran les utilisent pour aller vite au menu ou au contenu. Pour le référencement, Google comprend mieux la structure de la page. Pour la maintenance, le code est plus clair et plus facile à relire. Certaines balises (nav, button) ont aussi un comportement déjà prévu.

### Quelle est la différence entre map, filter et forEach ?
`forEach` passe sur chaque élément d'un tableau pour faire une action, mais il ne retourne rien. `map` crée un nouveau tableau où chaque élément est transformé. `filter` crée un nouveau tableau avec seulement les éléments qui passent un test. Pour la recherche et le filtrage, j'ai utilisé `filter` (fonction `filtrer`). J'ai utilisé `map` pour transformer les livres en cartes, et `forEach` pour brancher les écouteurs d'événements.

## Difficultés rencontrées
- Je ne connaissais pas bien Git : au début, je ne savais pas ouvrir le terminal dans VS Code ni ce qu'était un commit. J'ai appris à faire `git init`, `git add` et `git commit`.
- Le test responsive m'a demandé du temps : j'ai dû apprendre à utiliser le mode appareil de Chrome (F12) pour voir la page sur téléphone et tablette.
- J'ai dû comprendre comment le code gère les accents dans la recherche (`normalize`) et comment les messages d'erreur sont reliés aux champs pour les lecteurs d'écran (`aria-describedby`).
- Mettre le projet sur GitHub était nouveau pour moi.

## Sources et outils d'assistance utilisés
- **Claude (IA d'Anthropic)** : il m'a donné le code de départ du projet (HTML, CSS, JavaScript) et m'a expliqué les étapes. Ensuite, j'ai lu le code, je l'ai testé dans le navigateur et je l'ai étudié pour pouvoir l'expliquer.
- **MDN Web Docs** : documentation sur HTML, CSS, JavaScript et ARIA (https://developer.mozilla.org).
- **Police** : Source Serif 4, de Google Fonts. Aucune image n'est utilisée dans la page.

## Captures d'écran (dossier `captures/`)
1. `01-validation-w3c.png` : validation W3C sans erreur
2. `02-ecran-large.png` : écran d'ordinateur
3. `03-tablette.png` : tablette
4. `04-telephone.png` : téléphone