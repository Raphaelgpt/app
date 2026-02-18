# Windows 11 Simulation - PRD

## Original Problem Statement
Application Full-Stack simulant l'interface de Windows 11 avec système de gestion de rôles (Admin et Utilisateur), incluant:
- Design Fluent (translucidité Mica, coins arrondis)
- Barre des tâches centrée, menu Démarrer, notifications
- Écran de verrouillage avec authentification
- Session Utilisateur: bureau basique, explorateur (lecture seule), navigateur factice
- Session Admin: panneau de configuration avec gestionnaire de codes, logs, terminal CMD, broadcast

## User Personas
1. **Admin (SuperAdmin)** - Accès complet: gestion utilisateurs, logs, terminal, broadcast
2. **Formateur (formateur1)** - Accès standard: bureau, explorateur lecture seule, navigateur

## Core Requirements (Static)
- [x] Authentification par ID/mot de passe
- [x] Rôles: Admin vs Utilisateur
- [x] Écran de verrouillage Windows 11
- [x] Bureau avec icônes
- [x] Barre des tâches centrée
- [x] Menu Démarrer fonctionnel
- [x] Explorateur de fichiers (read-only pour users)
- [x] Navigateur factice
- [x] Panneau Admin (users CRUD, logs, CMD, broadcast)
- [x] Broadcast plein écran

## What's Been Implemented (18 Feb 2026)
- **Backend**: FastAPI avec MongoDB
  - Auth: POST /api/auth/login avec logging
  - Users: CRUD /api/users (protection SuperAdmin)
  - Logs: GET/DELETE /api/login_logs
  - Broadcast: POST/GET/DELETE /api/broadcast
  
- **Frontend**: React + Framer Motion + Tailwind
  - OSContext pour état global
  - LockScreen avec heure/date animée
  - Desktop avec icônes conditionnelles (admin-only)
  - Taskbar centrée avec indicateur utilisateur
  - StartMenu avec apps épinglées
  - Window draggable avec min/max/close
  - FileExplorer avec structure dossiers
  - FakeBrowser avec navigation interne
  - AdminPanel (users, logs, broadcast tabs)
  - CMD Terminal (help, dir, cls, time, date, whoami, etc.)
  - BroadcastOverlay plein écran

## Default Credentials
- Admin: SuperAdmin / AdminSuper
- User: formateur1 / 01012000

## Backlog (P0/P1/P2)
### P0 (Critical) - Done
- ✅ All core features implemented

### P1 (Important)
- [ ] Réglages système (changement fond d'écran)
- [ ] Notifications Windows style toast
- [ ] Session timeout/auto-lock

### P2 (Nice to have)
- [ ] Thème clair/sombre
- [ ] Multi-fenêtres resize
- [ ] Snapshot/restore desktop state
- [ ] Recherche globale fonctionnelle
- [ ] Plus de commandes CMD

## Technical Stack
- Backend: FastAPI, Motor (MongoDB async), Pydantic
- Frontend: React 19, Framer Motion, Tailwind CSS, Lucide Icons
- Database: MongoDB

## Next Tasks
1. Ajout d'autres commandes au terminal
2. Paramètres utilisateur (changement mot de passe)
3. Notifications toast pour actions système
