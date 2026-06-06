# BENO Aqua Matic — Boutique en ligne

Boutique e-commerce Next.js + Prisma pour la lessive liquide **BENO Aqua Matic** (Bleu Océanic & Lavande).

## Fonctionnalités

- Catalogue BENO Aqua Matic (2 parfums, format 5L)
- Panier client (localStorage)
- Commande avec paiement à la livraison (COD)
- Charte graphique bleu / violet adaptée à la marque
- Base de données SQLite via Prisma

## Démarrage

```bash
npm run db:setup
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run db:setup` | Crée la BDD et insère les produits BENO |
| `npm run db:seed` | Réinitialise les produits |
| `npm run build` | Build production |

## Panel Admin

Accès : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

| Variable | Description | Défaut |
|----------|-------------|--------|
| `ADMIN_PASSWORD` | Mot de passe de connexion | `admin123` |
| `ADMIN_SECRET` | Token de session (cookie) | à changer en production |

Fonctionnalités :
- Gestion des commandes (statuts)
- Ajouter / modifier / supprimer des produits

Les images sont dans `public/products/` :
- `bleu-oceanic-bottle.png` — BENO Bleu Océanic 5L
- `lavande-bottle.png` — BENO Lavande 5L
- `duo-poster.png` — Affiche hero (les deux variantes)
