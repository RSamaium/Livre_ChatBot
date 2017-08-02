# Requis

* NodeJS > 8.x.x

# Installation

1. Tapez `npm install`
2. Remplir les informations manquantes dans `src/config/default.js`

# Démarrer

Lancer le serveur :

`npm run dev`

Lancer localtunnel

`npm run lt`

# Créer un menu persistant

Lancer la commande (Linux) :

`TOKEN=<token de messenger> sh ./bin/persistent-menu.sh`

# Stripe

Dans `src/server/public/views/rent.html`, mettez votre clé publique :

```js
const handler = StripeCheckout.configure({
    key: '<pk key>',
    ...
})
```