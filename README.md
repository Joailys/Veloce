<div align="center">

# ⚡ Veloce

**Plateforme de gestion de projets et d'issue tracking haute vélocité pour équipes d'ingénierie et produit.**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/license-Apache--2.0-green.svg?style=for-the-badge)

*Fluidité ultime, raccourcis clavier natifs, intégrations écosystème dev et automatisations intelligentes.*

</div>

---

## 📖 Présentation

**Veloce** est conçu pour éliminer les frictions dans la gestion de projet moderne. Inspiré par les flux de travail des meilleures équipes d'ingénierie, Veloce combine une expérience utilisateur ultrarapide, une gestion fine des itérations (Cycles), un alignement stratégique (Roadmaps) et des automatisations poussées interconnectées avec votre écosystème de développement (GitHub, Sentry, Figma, Slack).

---

## ✨ Fonctionnalités Clés

### 📋 1. Suivi des Tickets (Issues) & Vues Dynamiques
- **Vues multiples** : Basculez en un instant entre les vues **Liste**, **Tableau Kanban** et **Frise Chronologique (Timeline)**.
- **Filtrage & Groupement** : Filtrez et groupez par statut (`backlog`, `todo`, `in_progress`, `in_review`, `done`, `canceled`), priorité (`urgent`, `high`, `medium`, `low`), assigné, projet, cycle ou label.
- **Détails & Dépendances** : Prise en charge des sous-tâches, relations inter-tickets (bloque, est bloqué par, doublon), liens vers Pull Requests GitHub/GitLab, alertes Sentry et frames Figma.

### 🔄 2. Cycles d'Ingénierie & Sprints
- Découpage du travail en itérations datées avec suivi de la vélocité.
- Gestion des états de cycle (`active`, `upcoming`, `completed`).
- Report automatique (*rollover*) des tickets non complétés vers le cycle suivant.

### 🎯 3. Projets & Feuille de Route (Roadmaps)
- Suivi de la santé globale des projets en temps réel (`on_track`, `at_risk`, `delayed`, `completed`).
- Jalons (*Milestones*) clés et dates cibles de livraison.
- Vue synoptique Roadmap pour l'alignement stratégique des équipes produit.

### ⚡ 4. Moteur d'Automatisations & Intégrations
- **Règles événementielles** :
  - Passage automatique au statut `in_review` dès l'ouverture d'une Pull Request.
  - Clôture automatique du ticket lors du merge de la PR.
  - Création/Étiquetage de tickets d'incident sur réception d'alertes Sentry.
  - Notifications automatisées vers vos canaux Slack.
- **Intégrations natives** : GitHub, GitLab, Sentry, Figma, Slack, Webhooks personnalisés.

### 📊 5. Analytiques & Studio IA Veloce
- Métriques de performance : débit de résolution, répartition des bugs par sévérité, taux de complétion des cycles.
- **Studio IA Veloce** : Assistant intelligent intégré pour la décomposition automatique de tickets complexes, la génération de résumés d'avancement et la suggestion de priorités.

### ⌨️ 6. Navigation Keyboard-First
- Palette de commande rapide accessible partout via `Cmd + K` (ou `Ctrl + K`).
- Raccourcis clavier complets (`C` pour créer un ticket, `G` + `I` pour aller aux issues, `Shift + ?` pour ouvrir la modale d'aide).

---

## 🛠️ Stack Technique

| Composant | Technologie |
| :--- | :--- |
| **Framework UI** | React 19 + TypeScript 5.8 |
| **Build & Tooling** | Vite 6 |
| **Styling & UI** | Tailwind CSS v4 + Framer Motion |
| **Iconographie** | Lucide React |
| **Intelligence Artificielle** | SDK Google GenAI (Studio IA Veloce) |

---

## 🚀 Installation & Lancement Local

### Prérequis
- **Node.js** : Version 18.0.0 ou supérieure
- **npm** ou **pnpm** / **yarn**

### Étapes d'installation

1. **Cloner le dépôt et accéder au répertoire** :
   ```bash
   git clone https://github.com/votre-org/veloce.git
   cd veloce
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   Copiez le fichier exemple `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```
   Renseignez vos clés d'accès :
   ```env
   # Clé d'API requis pour les fonctionnalités du Studio IA Veloce
   GEMINI_API_KEY="votre_cle_api"

   # URL de votre application (ex: http://localhost:3000)
   APP_URL="http://localhost:3000"
   ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000`.

---

## 📜 Scripts Disponibles

Dans le répertoire du projet, vous pouvez exécuter :

- `npm run dev` : Lance le serveur de développement Vite.
- `npm run build` : Compile l'application pour la production dans le dossier `dist/`.
- `npm run preview` : Prévisualise le build de production localement.
- `npm run lint` : Exécute le contrôle de typage TypeScript (`tsc --noEmit`).
- `npm run clean` : Nettoie les fichiers de build temporaires.

---

## 🏷️ Versionnement (SemVer 2.0.0)

Ce projet respecte la spécification **[Semantic Versioning 2.0.0](https://semver.org/lang/fr/)** (`MAJEUR.MINEUR.CORRECTIF`) :
- **MAJEUR (X.0.0)** : Modifications majeures introduisant des ruptures de compatibilité.
- **MINEUR (x.Y.0)** : Ajout de nouvelles fonctionnalités rétrocompatibles.
- **CORRECTIF (x.y.Z)** : Corrections de bugs ou ajustements mineurs sans rupture.

La version courante est disponible dans [`package.json`](file:///Users/simon/Documents/Projets/Veloce/package.json).

---

## 📄 Licence

Ce projet est sous licence **Apache 2.0**. Consultez le fichier LICENSE pour plus de détails.