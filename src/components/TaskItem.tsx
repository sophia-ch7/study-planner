import type { Task } from "../types/task";
import { taskRepository } from "../repositories/taskRepository";

interface TaskItemProps {
  task: Task;
  onTaskToggle?: (id: number | string, newCompleted: boolean) => void;
  onTaskDeleted?: (id: number | string) => void;
  onShowDetails?: (id: number | string) => void;
}

export function TaskItem({
  task,
  onTaskToggle,
  onTaskDeleted,
  onShowDetails,
}: TaskItemProps) {
  const handleToggle = async () => {
    const nextCompleted = !task.completed;

    if (onTaskToggle) {
      onTaskToggle(task.id, nextCompleted);
    }

    try {
      await taskRepository.update(task.id, { completed: nextCompleted });
    } catch (err) {
      console.error("Помилка оновлення статусу:", err);
      if (onTaskToggle) {
        onTaskToggle(task.id, !nextCompleted);
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Видалити завдання "${task.title}"?`)) return;

    try {
      await taskRepository.delete(task.id);
      if (onTaskDeleted) onTaskDeleted(task.id);
    } catch (err) {
      console.error("Помилка видалення:", err);
    }
  };

  return (
    <div className={`card mb-2 ${task.completed ? "bg-light" : ""}`}>
      <div className="card-body d-flex justify-content-between align-items-center py-2">
        <div className="form-check me-3">
          <input
            className="form-check-input me-2"
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            id={`task-${task.id}`}
          />
          <label
            htmlFor={`task-${task.id}`}
            className={`form-check-label ${task.completed ? "text-decoration-line-through text-muted" : ""}`}
          >
            {task.title}
          </label>
        </div>

        <div className="d-flex gap-2 flex-shrink-0">
          {onShowDetails && (
            <button
              className="btn btn-sm btn-outline-info"
              onClick={() => onShowDetails(task.id)}
            >
              Деталі 🔍
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDelete}
          >
            Видалити 🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
