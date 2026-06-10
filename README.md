# Portfolio — Compaoré Guetawendé Zacharie

Portfolio professionnel **full-stack** et **administrable**.

- **Frontend** — React + Vite (site public + espace admin sur `/admin`)
- **Backend** — Node.js + Express + Prisma (API REST, JWT, upload, email)
- **Base de données** — PostgreSQL

Tout le contenu (profil, projets, compétences, parcours, distinctions) se modifie depuis l'espace admin, **sans toucher au code**.

---

## 🗂️ Structure

```
portfolio-fullstack/
├── backend/      → API (Express + Prisma)
├── frontend/     → Site React (Vite)
├── docker-compose.yml  → PostgreSQL prêt à l'emploi
└── README.md
```

---

## ✅ Prérequis

- **Node.js 18+**
- **PostgreSQL** (installé en local, OU via Docker — voir ci-dessous)

---

## 🚀 Installation pas à pas

### 1) La base de données PostgreSQL

**Option A — Docker (le plus simple)** depuis la racine :
```bash
docker compose up -d
```
La base tourne sur `localhost:5432` (user `postgres`, mot de passe `postgres`, base `portfolio`).

**Option B — PostgreSQL déjà installé** : crée une base `portfolio` et note ton identifiant/mot de passe.

### 2) Le backend
```bash
cd backend
npm install
cp .env.example .env
```
Ouvre `backend/.env` et renseigne au minimum :
- `DATABASE_URL` (laisse la valeur par défaut si tu as utilisé Docker)
- `JWT_SECRET` (une longue chaîne aléatoire — `openssl rand -hex 32`)
- `ADMIN_EMAIL` et `ADMIN_PASSWORD` (ton compte admin)

Puis crée les tables et injecte le contenu du CV :
```bash
npm run prisma:generate
npm run prisma:migrate     # crée les tables
npm run seed               # crée l'admin + le contenu de départ
npm run dev                # démarre l'API sur http://localhost:4000
```

### 3) Le frontend (dans un 2e terminal)
```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_URL pointe déjà vers le backend
npm run dev                 # site sur http://localhost:5173
```

---

## 🔐 Espace admin (endpoint dédié)

L'administration **n'apparaît nulle part** sur le site public. On y accède **uniquement** par l'URL :

```
http://localhost:5173/admin
```

- **Identifiants** = `ADMIN_EMAIL` / `ADMIN_PASSWORD` définis dans `backend/.env`.
- Pour rendre la route encore plus discrète, change `"admin"` dans **`frontend/src/App.jsx`** (ex. `/gestion-x9k2`). C'est la seule ligne à modifier.

---

## 📩 Recevoir les messages du formulaire (SMTP Gmail)

Le formulaire de contact **enregistre toujours** les messages en base (visibles dans l'admin → onglet *Messages*).
Pour les recevoir **par email**, remplis la section SMTP de `backend/.env` :

1. Active la **validation en 2 étapes** sur ton compte Google.
2. Crée un **mot de passe d'application** (Google → Sécurité → Mots de passe des applications).
3. Renseigne :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ton.email@gmail.com
SMTP_PASS=le-mot-de-passe-application-16-caracteres
CONTACT_TO=adresse.qui.recoit@gmail.com
```

Redémarre le backend. Tant que ces champs sont vides, les messages restent simplement stockés en base (rien n'est perdu).

---

## 🧱 Stack & API

| Méthode | Endpoint | Accès |
|--------|----------|-------|
| GET | `/api/profile` `/api/projects` `/api/skills` `/api/languages` `/api/timeline` `/api/awards` | public |
| POST | `/api/contact` | public |
| POST | `/api/auth/login` | public |
| PUT/POST/DELETE | toutes les ressources d'édition | JWT requis |
| POST | `/api/upload` | JWT requis |

---

## 🚢 Mise en production (résumé)

- **Frontend** : `npm run build` → dossier `dist/` à héberger (Vercel, Netlify, Nginx…).
- **Backend** : héberger sur un VPS / Railway / Render ; lancer `npm run prisma:deploy` puis `npm start`.
- Mettre à jour `VITE_API_URL`, `CORS_ORIGIN` et `PUBLIC_URL` avec les vraies URLs.

---

## 📌 À faire après installation

- Mettre les **liens GitHub / démo** des 2 projets primés (admin → Projets).
- Ajouter le **CV PDF** et une **photo** (admin → Profil).
- Renseigner le **LinkedIn**.
- Changer le **mot de passe admin** (admin → Réglages).
