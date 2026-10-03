import api from "./api.js";

// ==================================================
// Service centralisé pour les appels API des tâches
// ==================================================

const taskService = {
  // Récupérer toutes les tâches (avec filtres optionnels)
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);

    const query = params.toString();
    const { data } = await api.get(`/tasks${query ? `?${query}` : ""}`);
    return data;
  },

  // Récupérer une tâche par ID
  getById: async (id) => {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  // Créer une nouvelle tâche
  create: async (taskData) => {
    const { data } = await api.post("/tasks", taskData);
    return data;
  },

  // Mettre à jour une tâche
  update: async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data;
  },

  // Supprimer une tâche
  delete: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },

  // Basculer le statut (en cours ⇄ terminée)
  toggle: async (id) => {
    const { data } = await api.patch(`/tasks/${id}/toggle`);
    return data;
  },
};

export default taskService;