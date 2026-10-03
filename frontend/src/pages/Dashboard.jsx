import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import taskService from "../services/taskService.js";

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");

  // Modale de suppression
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    taskId: null,
  });

  // Filtres
  const [filters, setFilters] = useState({
    status: "toutes",
    search: "",
    sortBy: "",
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const apiFilters = {};
      if (filters.status !== "toutes") apiFilters.status = filters.status;
      if (filters.search) apiFilters.search = filters.search;
      if (filters.sortBy) apiFilters.sortBy = filters.sortBy;

      const data = await taskService.getAll(apiFilters);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de chargement des tâches");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask._id, taskData);
        showToast("Tâche modifiée avec succès", "success");
        setEditingTask(null);
      } else {
        await taskService.create(taskData);
        showToast("Tâche créée avec succès", "success");
      }
      await fetchTasks();
    } catch (err) {
      throw err;
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await taskService.toggle(id);
      showToast(
        updated.status === "terminée"
          ? "Tâche marquée comme terminée 🎉"
          : "Tâche reprise en cours 🔄",
        "info"
      );
      await fetchTasks();
    } catch (err) {
      showToast("Erreur lors du changement de statut", "error");
    }
  };

  const openDeleteModal = (id) => {
    setDeleteModal({ isOpen: true, taskId: id });
  };

  const confirmDelete = async () => {
    try {
      await taskService.delete(deleteModal.taskId);
      showToast("Tâche supprimée", "success");
      setDeleteModal({ isOpen: false, taskId: null });
      await fetchTasks();
    } catch (err) {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "terminée").length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(
    (t) =>
      t.dueDate &&
      t.status !== "terminée" &&
      new Date(t.dueDate) < new Date()
  ).length;

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <TaskForm
              onSubmit={handleSubmitTask}
              initialData={editingTask}
              onCancel={editingTask ? () => setEditingTask(null) : null}
            />
          </div>
        </div>

        {/* Liste + filtres */}
        <div className="lg:col-span-2 space-y-4">
          {/* Accueil + stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-xl font-bold text-gray-800">
              👋 Bonjour {user?.name}
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {totalTasks}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {pendingTasks}
                </div>
                <div className="text-xs text-blue-600 mt-1">En cours</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {completedTasks}
                </div>
                <div className="text-xs text-green-600 mt-1">Terminées</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {overdueTasks}
                </div>
                <div className="text-xs text-red-600 mt-1">En retard</div>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="🔍 Rechercher..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="toutes">Toutes</option>
                <option value="en cours">En cours</option>
                <option value="terminée">Terminées</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Trier par...</option>
                <option value="dueDate">Échéance</option>
                <option value="priority">Priorité</option>
                <option value="title">Titre</option>
                <option value="oldest">Plus anciennes</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <TaskList
            tasks={tasks}
            loading={loading}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
          />
        </div>
      </div>

      {/* Modale de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Supprimer la tâche"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer cette tâche ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, taskId: null })}
      />
    </MainLayout>
  );
};

export default Dashboard;