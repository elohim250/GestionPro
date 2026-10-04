# 🎯 GestionPro

**Application MERN de gestion de tâches personnalisées**

Une application full-stack permettant à chaque utilisateur de créer un compte sécurisé et de gérer sa propre liste de tâches avec échéances, priorités, filtres et tri.

[![Demo en ligne](https://img.shields.io/badge/🌐_Démo-gestionpro--beta.vercel.app-blue)](https://gestionpro-beta.vercel.app)
[![API](https://img.shields.io/badge/🔌_API-Render-green)](https://gestionpro-backend-381u.onrender.com)

---

## 📸 Aperçu

### Page de connexion
![Login](./screenshots/01-login.png)

### Tableau de bord
![Dashboard](./screenshots/02-dashboard.png)

### Vue mobile
![Mobile](./screenshots/03-mobile.png)

---

## 🌐 Démo en ligne

- **Frontend** : [https://gestionpro-beta.vercel.app](https://gestionpro-beta.vercel.app)
- **Backend API** : [https://gestionpro-backend-381u.onrender.com](https://gestionpro-backend-381u.onrender.com)

⚠️ **Note** : le backend est hébergé sur le plan gratuit de Render. Le premier chargement peut prendre **30 secondes** (le temps que le service se réveille).

---

## ✨ Fonctionnalités
...
**Application MERN de gestion de tâches personnalisées**

Une application full-stack permettant à chaque utilisateur de créer un compte sécurisé et de gérer sa propre liste de tâches avec échéances, priorités, filtres et tri.

![Aperçu](https://img.shields.io/badge/MERN-Stack-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

---

## ✨ Fonctionnalités

### 🔐 Authentification sécurisée
- Inscription et connexion via **JWT**
- Mots de passe hashés avec **bcryptjs**
- Routes protégées par middleware

### ✅ Gestion des tâches (CRUD complet)
- ➕ Créer une tâche (titre, description, échéance, priorité)
- 📖 Lister ses propres tâches
- ✏️ Modifier une tâche
- 🗑️ Supprimer avec confirmation
- ✔️ Basculer le statut (en cours ⇄ terminée)

### 🔍 Filtres et tri
- Recherche par titre ou description
- Filtre par statut
- Tri par échéance, priorité, titre ou date

### 🎨 Expérience utilisateur
- Interface **responsive** (Tailwind CSS)
- Notifications **toast**
- Détection automatique des **tâches en retard**
- Statistiques en temps réel
- Isolation des données (chaque user voit ses tâches)

---

## 🛠️ Stack technique

| Couche | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router, Axios, Tailwind CSS |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Mongoose |
| **Base de données** | MongoDB Atlas |
| **Déploiement** | Render (backend), Vercel (frontend) |

---

## 🏗️ Architecture
