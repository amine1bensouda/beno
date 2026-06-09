# BENO Aqua Matic — Boutique en ligne

Boutique e-commerce Next.js + Prisma + **Supabase (PostgreSQL)**.

## Base de données Supabase

Projet : [beno sur Supabase](https://supabase.com/dashboard/project/aofzqdwrgpvpgkqafmpt)

### 1. Récupérer les URLs de connexion

Dans Supabase → **Connect** → **ORMs** → **Prisma** :

- `DATABASE_URL` → mode **Transaction** (pooler, port 6543)
- `DIRECT_URL` → mode **Session** (port 5432)

### 2. Configurer `.env` (local)

```bash
cp .env.example .env
```

Remplacez `[YOUR-PASSWORD]` par le mot de passe de la base Supabase.

### 3. Créer les tables et insérer les produits

```bash
npm run db:setup
```

### 4. Vercel — variables d'environnement

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL poolée Supabase (port 6543) |
| `DIRECT_URL` | URL directe Supabase (port 5432) |
| `ADMIN_PASSWORD` | Mot de passe admin |
| `ADMIN_SECRET` | Clé secrète session admin |

Puis **Deployments → Redeploy** sur la branche `main` (commit le plus récent).

## Démarrage local

```bash
npm install
npm run db:setup
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run db:setup` | Migrations + seed produits |
| `npm run db:seed` | Réinitialise les produits |
| `npm run db:migrate` | Applique les migrations |
| `npm run build` | Build production (inclut migrate deploy) |

## Panel Admin

[http://localhost:3000/admin/login](http://localhost:3000/admin/login) — mot de passe par défaut : `admin123`
