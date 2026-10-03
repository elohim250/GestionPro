import axios from "axios";

// URL du backend GestionPro
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================================================
// INTERCEPTOR DE REQUÊTE
// Ajoute automatiquement le token JWT si dispo
// ==================================================
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("gestionpro_user") || "null");
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================================================
// INTERCEPTOR DE RÉPONSE
// Gère les erreurs globales (ex: 401 → déconnexion)
// ==================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le token est invalide/expiré → nettoyer localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem("gestionpro_user");
      // Rediriger vers login si on n'y est pas déjà
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;