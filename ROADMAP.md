# 🗺️ ROADMAP — Veloce Platform

Feuille de route stratégique et évolution produit pour **Veloce** (Plateforme de gestion de projets et d'issue tracking haute vélocité pour équipes d'ingénierie et produit).

---

## 💡 Idées & Nouvelles Fonctionnalités à Ajouter (Brainstorming & Backlog)

Cette section recense les idées de fonctionnalités à explorer et à prioriser pour les futures versions :

### ⚡ Expérience Utilisateur & Navigation Clavier
- [ ] **Mode "Zen / Focus"** : Masquage de la barre latérale et des en-têtes pour un traitement des tickets sans distraction.
- [ ] **Raccourcis personnalisables** : Réassignation des cartes de raccourcis clavier via la modale de préférences.
- [ ] **Macro-Commandes Clavier** : Chaînage d'actions en une seule combinaison (ex. `Shift + D` = Marquer Done + Retirer l'assigné + Déplacer au cycle suivant).

### 🤖 Studio IA Veloce (Assistants & Automatisation)
- [ ] **Génération automatique de sous-tâches** : Décomposition intelligente d'une issue complexe en sous-tâches unitaires d'ingénierie.
- [ ] **Détection de doublons (Duplicate Finder)** : Analyse sémantique lors de la saisie du titre pour avertir si un ticket similaire existe déjà.
- [ ] **Rapport quotidien de sprint (Daily Standup Summary)** : Génération automatique d'un résumé synthétique des tickets bloqués et avancées des dernières 24h.

### 🔗 Intégrations & Écosystème Développeurs
- [ ] **Extension VS Code & JetBrains** : Panneau latéral interactif dans l'éditeur de code pour lier directement les commits et les branches Git.
- [ ] **Intégration Notion & Linear Sync** : Import / Export bidirectionnel avec Notion et Linear.
- [ ] **Connecteur Discord & Telegram** : Bots de notifications d'urgence et création de tickets par commandes Slash (`/veloce new`).

### 🎨 UX, Design System & Personnalisation
- [ ] **Thèmes visuels (Custom Color Palettes)** : Support des thèmes Synthwave, Nord, Dracula et High Contrast OLED.
- [ ] **Widgets Bento personnalisables sur le Tableau de bord** : Disposition glisser-déposer des métriques préférées.

### 📊 Reporting, Audit & Conduite du Changement
- [ ] **Changelog automatique (Release Notes Generator)** : Génération en 1 clic des notes de mise à jour au format Markdown pour chaque cycle clôturé.
- [ ] **Export avancé CSV / PDF** : Export structuré des rapports de vélocité pour les comités de direction.

---

## 🟢 v1.0.0 — Socle Fondateur & Clavier Natif (Livré)

- [x] **Moteur Keyboard-First Native** : Navigation fluide `j`/`k`, raccourcis à touche unique `1`-`5` (priorités), `s` (statuts), `c` (création) et palette `Cmd + K`.
- [x] **Gestion des Sprints & Auto-Rollover** : Cycles time-boxés et transfert automatisé des tickets non terminés en 1 clic.
- [x] **Vues d'Affichage Multiples** : Vues Liste, Tableau Kanban et Timeline.
- [x] **Moteur d'Automatisations Dev** : Règles événementielles déclaratives (`WHEN PR Merged -> THEN Issue Done`, `Sentry Crash -> Bug Ticket`).
- [x] **Insights & Burn-down Velocity** : Graphiques de vélocité, suivi de complétion et charge de travail par développeur.
- [x] **Sécurité & RBAC** : Gouvernance granulaire des accès (`Admin`, `Tech Lead`, `Member`, `Guest`) et espaces multi-équipes (`ENG`, `PROD`, `SEC`).
- [x] **Documentation & Guides** : [`README.md`](README.md) complet et [`guide.md`](guide.md) d'utilisation au clavier.

---

## 🟡 v1.1.0 — Synchronisation Temps Réel & Collaboration Multi-Utilisateurs (Q3 2026)

- [ ] **Collaborative Real-time Engine** : Synchronisation WebSocket pour la présence des membres en direct et curseurs partagés.
- [ ] **Gestion des Conflits d'Édition** : Résolution optimiste des éditions simultanées sur les tickets.
- [ ] **Notifications PWA & Desktop** : Notifications push navigateur et intégration barre des tâches macOS/Windows.

---

## 🟠 v1.2.0 — App Desktop Native & SDK Écosystème (Q4 2026)

- [ ] **Application Desktop Native** : Packaging Tauri / Electron avec raccourcis système globaux (`Option + Space` pour créer un ticket depuis n'importe quelle application).
- [ ] **CLI Veloce (`veloce-cli`)** : Création, tri et résolution de tickets directement depuis le terminal de commande (`veloce issue create`, `veloce cycle status`).
- [ ] **Extension IDE** : Panneau latéral Veloce directement intégré dans l'IDE pour lier les commits sans quitter l'éditeur de code.

---

## 🔴 v2.0.0 — Intelligence Avancée & Auto-Triage (Q1 2027)

- [ ] **Auto-Triage par l'IA Veloce** : Analyse intelligente des logs de crash et proposition automatique d'assignation et d'étiquetage.
- [ ] **Estimations Prédictives** : Calcul du risque de retard de sprint basé sur la vélocité historique des cycles précédents.
- [ ] **Multi-Workspace Enterprise Single Sign-On (SSO / SAML)** : Gestion d'identité centralisée Okta / Google Workspace.
