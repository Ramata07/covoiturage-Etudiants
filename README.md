# Backend

Application de covoiturage étudiant pensée pour les étudiants. L'objectif : faciliter le partage de trajets entre étudiants pour réduire les coûts et le temps de transport.

Ce dépôt contient le **backend** du projet. Le frontend n'est pas encore développé.

## Stack technique

- **Runtime** : Bun
- **Framework** : Express.js
- **Langage** : TypeScript
- **Base de données** : PostgreSQL (hébergée sur Neon)
- **ORM** : Drizzle ORM
- **Authentification** : JWT (access + refresh tokens), bcrypt pour le hash des mots de passe
- **Validation** : Zod

## État d'avancement

 **Projet en développement actif** — ceci n'est pas une version finale.

**Fait :**
- Inscription et connexion utilisateur (`/register`, `/login`)
- Authentification par JWT avec access token (courte durée) et système de refresh token
- Hash des mots de passe avec bcrypt
- Réinitialisation de mot de passe
- Validation des requêtes avec Zod
- Migrations de base de données avec Drizzle

**À venir :**
- Endpoints de gestion des trajets (création, recherche, réservation)
- Gestion des profils utilisateurs
- Frontend

## Installation

```bash
bun install
bun run dev
```

Nécessite un fichier `.env` (non versionné) avec au minimum :
```
DATABASE_URL=
JWT_SECRET=
```
