import TaskItem from "./TaskItem.jsx";
import Spinner from "./Spinner.jsx";

const TaskList = ({ tasks, loading, onToggle, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Spinner text="Chargement des tâches..." />
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm animate-fade-in">
        <div className="text-5xl mb-3">📭</div>
        <p className="text-gray-500 font-medium">Aucune tâche pour le moment</p>
        <p className="text-sm text-gray-400 mt-1">
          Créez votre première tâche ci-dessus !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;