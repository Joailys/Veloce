# 🗺️ ROADMAP — Veloce Platform

Feuille de route stratégique et évolution produit pour **Veloce** (Plateforme de gestion de projets et d'issue tracking haute vélocité pour équipes d'ingénierie et produit).

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
- [ ] **Extension VS Code & JetBrains** : Panneau latéral Veloce directement intégré dans l'IDE pour lier les commits sans quitter l'éditeur de code.

---

## 🔴 v2.0.0 — Intelligence Avancée & Auto-Triage (Q1 2027)

- [ ] **Auto-Triage par l'IA Veloce** : Analyse intelligente des logs de crash et proposition automatique d'assignation et d'étiquetage.
- [ ] **Estimations Prédictives** : Calcul du risque de retard de sprint basé sur la vélocité historique des cycles précédents.
- [ ] **Multi-Workspace Enterprise Single Sign-On (SSO / SAML)** : Gestion d'identité centralisée Okta / Google Workspace.
