const priorityStyles = {
  basse: "bg-green-100 text-green-700 border-green-200",
  moyenne: "bg-yellow-100 text-yellow-700 border-yellow-200",
  haute: "bg-red-100 text-red-700 border-red-200",
};

const priorityLabels = {
  basse: "🟢 Basse",
  moyenne: "🟡 Moyenne",
  haute: "🔴 Haute",
};

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const isCompleted = task.status === "terminée";

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue =
    task.dueDate && !isCompleted && new Date(task.dueDate) < new Date();

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-4 border-l-4 transition hover:shadow-md ${
        isCompleted
          ? "border-l-green-400 opacity-75"
          : isOverdue
          ? "border-l-red-400"
          : "border-l-primary-400"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task._id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
            isCompleted
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-primary-500"
          }`}
          title={isCompleted ? "Marquer comme en cours" : "Marquer comme terminée"}
        >
          {isCompleted && "✓"}
        </button>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-gray-800 break-words ${
              isCompleted ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-600 mt-1 break-words">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Priorité */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                priorityStyles[task.priority]
              }`}
            >
              {priorityLabels[task.priority]}
            </span>

            {/* Échéance */}
            {task.dueDate && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  isOverdue
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                📅 {formatDate(task.dueDate)}
                {isOverdue && " (en retard)"}
              </span>
            )}

            {/* Statut */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                isCompleted
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {isCompleted ? "✅ Terminée" : "🔄 En cours"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;