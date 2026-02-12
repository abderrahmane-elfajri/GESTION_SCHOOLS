# Gestion Scolaire - École de Formation

Application Next.js moderne pour la gestion complète d'écoles de formation professionnelle (Coiffure, Coiffure Visagiste, Esthétique). Interface professionnelle avec design moderne et dégradés, authentification sécurisée et génération automatique de documents PDF/Excel.

## 🌟 Fonctionnalités principales

### 🔐 Authentification & Sécurité
- Page d'accueil (landing page) professionnelle avec présentation des fonctionnalités
- Authentification Supabase (Admin & Secrétaire) avec protection middleware
- Contrôle d'accès basé sur les rôles (RBAC)
- Gestion multi-écoles avec séparation stricte via RLS (Row Level Security)

### 👨‍🎓 Gestion des élèves
- **Informations complètes** :
  - Nom complet, téléphone, adresse
  - CIN (Carte d'Identité Nationale)
  - Code Massar (identifiant scolaire national)
  - Niveau scolaire (15 niveaux: Non scolarisé à Bac +5)
  - Dernière année scolaire
  - Programme (Coiffure, Coiffure Visagiste, Esthétique)
  - Année scolaire et matricule
- **Fonctionnalités** :
  - CRUD complet avec validation Zod
  - Recherche par nom, téléphone, matricule
  - Filtres avancés (programme, année, école)
  - Pagination performante
  - Auto-génération des numéros d'inscription
  - Validation en temps réel avec messages d'erreur contextuels

### 💰 Suivi des paiements
- Paiements mensuels (10 mois)
- Toggle payé/impayé avec date automatique
- Suivi des montants et mensualités
- Statistiques des paiements en attente
- Export Excel avec historique complet

### 📄 Documents automatisés
- **Certificats de scolarité** (PDF A4)
  - Génération instantanée
  - Protection double-clic
  - États de chargement
- **Export Excel** (.xlsx) complet
  - 16 champs incluant CIN, Code Massar, Niveau Scolaire
  - Statut des paiements mensuels
  - Filtres appliqués

### 📊 Tableau de bord
- Statistiques en temps réel (élèves, paiements, certificats)
- Derniers élèves inscrits
- Actions rapides (ajout élève, recherche)
- Design professionnel avec cartes et dégradés

### 👥 Administration
- Création de secrétaires (via service role)
- Affectation par école
- Gestion des utilisateurs

## 🎨 Design & UX

- Interface moderne avec dégradés de couleurs
- Validation de formulaire avec bordures rouges sur erreurs
- Messages de succès/erreur contextuels
- Loading skeletons pour meilleure perception de performance
- Composants accessibles (aria-labels)
- Design responsive (mobile-first)

## 📁 Structure du projet

- `app/` : Routes Next.js (App Router, Server Components, Server Actions, API routes)
  - `page.tsx` : Landing page (page d'accueil)
  - `(auth)/login/` : Page de connexion
  - `(dashboard)/` : Routes protégées (dashboard, students, admin)
  - `api/certificates/` : Génération PDF
  - `api/export/` : Export Excel
- `src/lib/` : Utilitaires et logique métier
  - `supabase (recommandé: 20+)
- npm ou pnpm
- Compte Supabase configuré avec :
  - Projet créé
  - Tables importées (voir section Déploiement)
  - Variables d'environnement notées

## 🚀 Installation & démarrage

### 1. Cloner et installer

```bash
# Installer les dépendances
npm install
```

### 2. Configuration Supabase

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
```

### 3. Importer le schéma de base de données

Dans Supabase Dashboard :
1. Aller dans **SQL Editor**
2. Créer une nouvelle requête
3. Copier le contenu de `supabase/schema.sql`
4. Exécuter
5. Si les tables existent déjà, exécuter `supabase/migration-with-data-update.sql` pour ajouter les nouveaux champs

### 4. Démarrer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🎯 Utilisation

### Première connexion

1. **Page d'accueil** : Visitez `http://localhost:3000`
2. **Cliquez sur "Connexion"** ou "Se connecter"
3. **Connectez-vous** avec vos identifiants Supabase
4. **Accédez au dashboard** : Vous serez automatiquement redirigé

### Ajouter un élève

1. Dashboard → **"Ajouter élève"** ou Menu → **"Élèves"** → **"Nouvel élève"**
2. Remplir le formulaire :
   - **Informations personnelles** : Nom, téléphone, adresse
   - **Documents** : CIN, Code Massar
   - **Scolarité** : Niveau scolaire (dropdown 15 niveaux), dernière année
   - **Formation** : Programme (Coiffure/Coiffure Visagiste/Esthétique), année scolaire
   - **Matricule** : Laisser vide pour auto-génération
3. Cliquer sur **"Créer l'élève"**
4. Message de succès affiché ✓

### Générer un certificat

1. Liste des élèves → Cliquer sur un élève
2. Section **"Certificat de scolarité"**
3. Cliquer sur **"Générer le certificat"**
4. PDF téléchargé automatiquement (format A4)

### Exporter en Excel

1. Page **"Élèves"**
2. Appliquer des filtres (optionnel)
3. Cliquer sur **"Exporter en Excel"**
4. Fichier .xlsx téléchargé avec tous les détails

## 📦 Déploiement sur Vercel

### 1. Push sur Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-repo.git
git push -u origin main
```

### 2. Importer sur Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. **Import Project** → Connecter votre repo Git
3. **Configure Project** :
   - Framework Preset: **Next.js**
   - Root Directory: `./`
4. **Ajouter les variables d'environnement** :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Cliquer sur **Deploy**

### 3. Configuration post-déploiement

1. Dans Supabase Dashboard → **Authentication** → **URL Configuration**
2. Ajouter votre domaine Vercel dans **Site URL** et **Redirect URLs**

## 🧪 Commandes disponibles

```bash
# Développement
npm run dev          # Démarrer le serveur de développement (port 3000)

# Production
npm run build        # Créer un build de production optimisé
npm run start        # Démarrer le serveur de production

# Qualité
npm run lint         # Vérifier le code avec ESLint
```

## 📝 Notes importantes

### Niveaux scolaires disponibles
1. Non scolarisé
2. Primaire (1ère-6ème année)
3. Collège (1ère-3ème année)
4. Lycée (Tronc Commun, 1ère Bac, 2ème Bac)
5. Bac +1 à Bac +5

### Types de programmes
- **Coiffure** : Formation coiffure classique
- **Coiffure Visagiste** : Formation coiffure spécialisée visagisme
- **Esthétique** : Formation esthétique et soins

### Paiements mensuels
- 10 mensualités par élève
- Toggle payé/impayé
- Date de paiement automatique
- Montant personnalisable

### Sécurité
- Toutes les routes protégées par middleware
- RLS (Row Level Security) activé sur toutes les tables
- Séparation stricte multi-écoles
- Contrôle d'accès basé sur les rôles

## 🐛 Dépannage

### Erreur "Too many redirects"
- Vérifier que le middleware exclut `/api/*` et `/_next/*`
- Vérifier les variables d'environnement Supabase

### Erreur de build TypeScript
- Exécuter `npm run build` pour voir les erreurs détaillées
- Vérifier que tous les champs de la base de données correspondent aux types TypeScript

### Performance lente
- Vérifier que les index sont créés (migration SQL)
- Réduire les temps de cache si nécessaire
- Vérifier la latence Supabase

### Base de données
- Si vous avez des erreurs de colonne manquante, exécuter `supabase/migration-with-data-update.sql`
- Vérifier que toutes les politiques RLS sont activées

## 📄 License

Ce projet est privé et destiné à un usage interne uniquement.

## 👨‍💻 Support

Pour toute question ou problème :
1. Vérifier la section Dépannage ci-dessus
2. Consulter la documentation Supabase
3. Vérifier les logs dans la console du navigateur et le terminal

---

**Développé avec ❤️ pour la gestion moderne des écoles de formation professionnelle**ent :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Installation & démarrage

```bash
npm install
npm run dev
```

Configurer un fichier `.env.local` avec les clés Supabase correspondantes avant de démarrer.

## Déploiement

1. Importer `supabase/schema.sql` dans Supabase (SQL Editor > Run).
2. Configurer les variables d'environnement sur Vercel.
3. Déployer `main` sur Vercel (`vercel` ou Git integration).

## Tests / Qualité

- `npm run lint` : linting via ESLint + Next.
- `npm run build` : build de production.

## Export & API

- `GET /api/certificates?studentId=<uuid>&schoolYear=2025/2026[&format=card]` : génère un PDF (et crée un enregistrement).
- `GET /api/export?year=2025&school_id=<uuid>&program=men...` : export Excel filtré.

## Sécurité

- RLS activé et configuré sur `students`, `payments`, `certificates`, `profiles`.
- Middleware Next vérifie session et rôle avant d'accéder aux routes protégées.
- Actions sensibles (création secrétaires) utilisent la clé Service Role côté serveur uniquement.
