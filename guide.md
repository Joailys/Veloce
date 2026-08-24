# 🚀 Guide d'Utilisation Officiel — Veloce

Bienvenue dans **Veloce**, l'outil de gestion de projets et d'issue tracking haute vélocité conçu pour les équipes de développement logiciel et produit.

Ce guide interactif vous explique pas à pas comment maîtriser l'application, naviguer à la vitesse de la pensée grâce aux raccourcis clavier et automatiser vos flux de travail.

---

## ⚡ 1. Navigation au Clavier (Keyboard-First)

Veloce est conçu pour être utilisé **sans toucher la souris**.

### ⌨️ Raccourcis Globaux

| Touche | Action |
| :--- | :--- |
| <kbd>Cmd</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Ouvrir la **Palette de Commandes** (Recherche & Navigation rapide) |
| <kbd>Shift</kbd> + <kbd>?</kbd> | Ouvrir la modale d'aide des raccourcis clavier |
| <kbd>C</kbd> | Créer immédiatement un nouveau ticket |
| <kbd>Esc</kbd> | Fermer toute modale ouverte ou réinitialiser la sélection |

### 🎯 Raccourcis dans la Vue Liste des Tickets (`Issues`)

> [!TIP]
> Dans la vue Liste des tickets, utilisez votre clavier pour trier vos tickets 10 fois plus vite qu'avec la souris !

- **<kbd>J</kbd> ou <kbd>↓</kbd>** : Déplacer la sélection vers le ticket **suivant**.
- **<kbd>K</kbd> ou <kbd>↑</kbd>** : Remonter au ticket **précédent**.
- **<kbd>Enter</kbd>** : Ouvrir la fiche détaillée du ticket sélectionné.
- **<kbd>X</kbd>** : Sélectionner / Désélectionner un ticket (pour les actions groupées).
- **<kbd>1</kbd> à <kbd>5</kbd>** : Changer instantanément la priorité du ticket survolé :
  - `1` = Urgent (🔴 P1)
  - `2` = High (🟠 P2)
  - `3` = Medium (🟡 P3)
  - `4` = Low (🔵 P4)
  - `5` = None (⚪ Sans priorité)
- **<kbd>S</kbd>** : Faire défiler et basculer le statut du ticket (`Backlog` → `Todo` → `In Progress` → `In Review` → `Done`).
- **<kbd>Backspace</kbd> / <kbd>Delete</kbd>** : Supprimer le ticket sélectionné.

---

## 📋 2. Gestion des Tickets & Vues

### Vues d'affichage
Dans la barre d'en-tête, basculez entre 3 vues adaptées à votre mode de travail :
1. **Liste** : Vue compacte avec raccourcis clavier natifs.
2. **Kanban (Board)** : Glissez-déposez vos tickets entre les colonnes de statut.
3. **Timeline** : Frise chronologique pour visualiser les échéances et durées.

### Filtres & Groupement
- **Changer d'équipe** : Dans la barre latérale gauche (*Sidebar*), filtrez par équipe (`Engineering`, `Product`, `Security`) ou gardez `All Teams`.
- **Groupement** : Cliquez sur le sélecteur *Group by* pour regrouper vos tickets par **Statut**, **Priorité**, **Assigné**, **Projet** ou **Cycle**.

### Anatomie d'un Ticket
Cliquez sur un ticket pour ouvrir sa modale de détail :
- **Sous-tâches (Sub-tasks)** : Découpez un ticket en sous-tâches et cochez-les au fur et à mesure.
- **Relations** : Définissez si le ticket *bloque*, *est bloqué par* ou *est un doublon* d'un autre ticket.
- **Intégrations Dev** : Associez des branches Git, des Pull Requests GitHub/GitLab, des alertes Sentry et des liens Figma.
- **Commentaires & Historique** : Échangez avec l'équipe et suivez l'historique d'activité du ticket.

---

## 🔄 3. Cycles de Développement & Sprints

Les **Cycles** permettent d'organiser le travail en itérations temporelles (généralement 2 semaines) sans surcharge administrative.

> [!IMPORTANT]
> **Clôture de Sprint & Rollover Automatique** :
> À la fin d'un cycle, cliquez sur **"Complete & Rollover Unfinished Work"**.
> Veloce fait automatiquement le bilan des *Story Points* réalisés et transfère en 1 clic tous les tickets non terminés vers le cycle suivant.

### Graphique de Vélocité (Burndown Chart)
Dans la vue Cycles, suivez en temps réel la courbe de travail restant (*Actual Remaining*) par rapport à la ligne idéale (*Ideal Guideline*).

---

## 🎯 4. Projets Stratégiques & Roadmap

- **Projets** : Regroupez vos tickets sous des initiatives majeures (ex: *Veloce Platform v1.0*).
- **Indicateurs de Santé** : Suivez le statut du projet en 1 coup d'œil (`On Track`, `At Risk`, `Delayed`, `Completed`).
- **Jalons (Milestones)** : Associez des étapes clés datées pour valider l'avancement.
- **Vue Roadmap** : Visualisez l'ensemble de vos projets sur une frise temporelle globale.

---

## ⚡ 5. Moteur d'Automatisations (*Automations*)

Le moteur d'automatisations de Veloce exécute des actions déclaratives selon le principe :  
**`WHEN [Déclencheur] -> THEN [Action]`**

### Règles pré-configurées incluses :
1. **Pull Request Merged** → Passe automatiquement le ticket en **Done**.
2. **Pull Request Opened** → Passe automatiquement le ticket en **In Review**.
3. **Alerte Sentry reçue** → Attache l'étiquette **Bug** et définit la priorité à **High**.
4. **Priorité Urgent (P1)** → Auto-assigne le **Team Lead**.

### Créer une règle personnalisée :
1. Rendez-vous dans **Automations** (`Sidebar`).
2. Cliquez sur **New Automation Rule**.
3. Choisissez le déclencheur (*Trigger*) et l'action (*Action*), puis enregistrez.

---

## 📊 6. Analytiques & Insights

La vue **Insights** vous donne un tableau de bord analytique complet :
- **Velocity Trends** : Suivi des points d'histoire complétés cycle après cycle.
- **Status Distribution** : Répartition des tickets par statut et points de charge.
- **Team Workload** : Distribution de la charge de travail et du taux de complétion par développeur.

---

## 🔒 7. Administration, Membres & Permissions (RBAC)

Accédez à **Settings & Access** pour administrer votre espace :

- **Teams (Équipes)** : Définissez vos équipes et leurs clés d'identifiants (ex: `ENG-101`, `MOB-202`).
- **Members (Membres)** : Invitez de nouveaux collaborateurs et attribuez des rôles :
  - 👑 **Admin** : Accès total, export de données, suppression.
  - 🛡️ **Tech Lead** : Gestion des cycles, projets et automatisations.
  - 💻 **Member** : Création et résolution des tickets.
  - 👁️ **Guest / Viewer** : Consultation seule.
- **Data & Clean Reset** :
  - **Export JSON** : Téléchargez une sauvegarde complète de votre base de données.
  - **Import JSON** : Restaurez un snapshot de workspace.
  - **Wipe Fake Data** : Nettoyez toutes les données de test pour démarrer sur un espace vierge.

---

## 💡 8. Conseil de Productivité

> [!TIP]
> Pour travailler à maximale vélocité : gardez vos mains sur le clavier, utilisez <kbd>Cmd</kbd> + <kbd>K</kbd> pour basculer de vue, <kbd>C</kbd> pour créer un ticket, <kbd>J</kbd>/<kbd>K</kbd> pour naviguer et <kbd>1</kbd>-<kbd>5</kbd> pour trier vos priorités. Vous n'aurez presque plus besoin de toucher votre souris !
