# Patiko – site de vente de voitures

## Structure
```
patiko/
├── index.html            page unique (en général, on n'y touche pas)
├── css/style.css         apparence
├── js/app.js             fonctionnement du site
├── data/voitures.json    LES VÉHICULES (c'est ici qu'on ajoute ou modifie les annonces)
└── images/voitures/
    └── <un-dossier-par-voiture>/   1.jpg, 2.jpg, 3.jpg, 4.jpg
```

## Ajouter une voiture
1. Créez un dossier dans `images/voitures/`, par exemple `peugeot-308-2022` (minuscules, sans accents ni espaces).
2. Déposez-y les photos du client : `1.jpg` (photo principale), `2.jpg`, `3.jpg`, `4.jpg`. Vous pouvez en mettre plus : listez-les dans le JSON.
3. Dans `data/voitures.json`, copiez un bloc `{ ... }` existant, collez-le à la suite (virgule entre deux blocs) et modifiez :
   - `id` : un numéro unique, jamais réutilisé
   - `marque`, `modele`, `annee`, `km`, `prix`, `carburant`, `boite`, `puissance`, `couleur`
   - `badge` : `"Nouveau"`, `"Bonne affaire"`, `"Garantie"` ou `""`
   - `description` et `equipements` (liste de textes)
   - `images` : les chemins des photos, ex. `"images/voitures/peugeot-308-2022/1.jpg"`
4. Enregistrez et redéployez : la voiture apparaît dans le catalogue.

Pour retirer une annonce, supprimez son bloc dans le JSON et son dossier d'images.
Si une photo est absente, le site affiche un visuel de substitution.
Photos conseillées : JPG, 1600 × 1000 px, moins de 300 Ko (squoosh.app pour les alléger).

## Tester en local
Le site charge `data/voitures.json` : il ne s'ouvre pas en double-cliquant sur `index.html`. Dans le dossier `patiko` :
```
python -m http.server 8000
```
puis ouvrez http://localhost:8000

## Mise en ligne gratuite
- **Render :** New > Static Site, branchez le dépôt GitHub contenant ce dossier, « Build Command » vide, « Publish Directory » = `.` (ou `patiko` si le dépôt contient le dossier).
- **Netlify :** glissez-déposez le dossier sur app.netlify.com/drop.
Ajoutez ensuite patiko.io dans les réglages de domaine personnalisé de l'hébergeur.

## À compléter avant publication
- Formulaire de contact : remplacez `VOTRE_ID` dans `js/app.js` (compte gratuit sur formspree.io).
- Mentions légales et CGV : modèles avec `[à compléter]` dans `js/app.js`, à faire valider.
- Adresse, téléphone et email du showroom : recherchez « Exemple » et « 01 23 45 67 89 » dans `js/app.js`.
