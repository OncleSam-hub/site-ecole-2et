# Site École Supérieure 2ET

Site vitrine statique (HTML/CSS/JS, sans framework ni étape de build) pour l'École Supérieure 2ET à Séguéla, Côte d'Ivoire.

## Voir le site en local

Aucune installation nécessaire. Double-clique sur `index.html` (ou n'importe quelle autre page `.html`), il s'ouvre directement dans le navigateur.

## Structure

```
index.html, a-propos.html, formations.html, formation-continue.html,
admissions.html, recrutement.html, actualites.html, galerie.html, faq.html, contact.html
css/style.css       Styles partagés par toutes les pages
js/config.js        Réglages simples (voir "Bascule inscriptions" ci-dessous)
js/main.js          Menu mobile, sous-menus, accordéon FAQ, filtre galerie, envoi des formulaires
images/logo-2et.png Logo réel de l'école
images/stock/…       Photos temporaires (voir CREDITS.md), à remplacer
images/programs/…    Photos temporaires des 7 filières (voir CREDITS.md), à remplacer
```

## Remplacer une photo

Toutes les photos actuelles (sauf le logo) sont des photos de banque d'images temporaires, en attendant de vraies photos de l'école. Pour en remplacer une : écrase le fichier existant avec une nouvelle image portant exactement le même nom (ex. remplacer `images/stock/hero-students.jpg` par une vraie photo, même nom de fichier). Pousse le changement sur Git, Netlify republie automatiquement.

## Bascule inscriptions ouvertes / fermées

Dans `js/config.js` :

```js
const SITE_CONFIG = {
  admissionsOpen: true   // false = affiche "Inscriptions bientôt ouvertes" à la place du formulaire
};
```

Change `true` en `false` (ou l'inverse), commit, push. Netlify republie automatiquement et le changement est visible en quelques minutes.

**Limite actuelle :** ce n'est pas un panneau d'administration en ligne, juste un réglage dans le code. Il faut passer par Git à chaque fois. Un vrai panneau web (connexion + bouton, sans toucher au code) pourra être ajouté plus tard si besoin, une fois le site stable en ligne.

## Formulaires

Les 4 formulaires du site (Contact, Recrutement, Formation continue, Admissions) utilisent **Netlify Forms** : aucune base de données ni backend à gérer. Une fois le site déployé sur Netlify, les soumissions apparaissent automatiquement dans le tableau de bord Netlify (Site → Forms), et peuvent être configurées pour t'envoyer une notification par email dans les réglages Netlify du site.

## Déploiement (checklist)

1. **Créer le dépôt sur GitHub** : va sur github.com, crée un nouveau dépôt (par exemple `site-ecole-2et`), ne coche aucune case d'initialisation (pas de README/gitignore, ce dossier en a déjà)
2. **Pousser le code** : dans ce dossier, connecte le dépôt distant et pousse (les commandes exactes te seront données au moment de le faire)
3. **Créer un compte / se connecter sur Netlify** : app.netlify.com
4. **"Add new site" → "Import an existing project"** → choisis GitHub → autorise Netlify à accéder au dépôt → sélectionne `site-ecole-2et`
5. Netlify détecte `netlify.toml` automatiquement (pas de commande de build, dossier racine publié tel quel) → clique sur "Deploy site"
6. Le site est en ligne sur une adresse type `nom-aleatoire.netlify.app`. Tu peux la renommer dans les réglages Netlify (Site settings → Change site name)
7. **Nom de domaine personnalisé** (2et.edu.ci) : à faire plus tard, dans Site settings → Domain management, une fois le nom de domaine acheté/disponible

Après cette connexion initiale, chaque `git push` republie automatiquement le site.
