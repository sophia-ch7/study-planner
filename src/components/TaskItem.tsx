import type { Task } from "../types/task";
import { useTaskContext } from "../hooks/useTaskContext";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, requestDelete, undoDelete, setEditingTask } =
    useTaskContext();

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-danger";
      case "medium":
        return "bg-warning text-dark";
      case "low":
        return "bg-info text-dark";
      default:
        return "bg-secondary";
    }
  };

  if (task.isPendingDelete) {
    return (
      <div className="card mb-3 border-danger-subtle bg-danger-subtle bg-opacity-10 opacity-75">
        <div className="card-body d-flex justify-content-between align-items-center py-2">
          <div>
            <h6 className="card-title text-muted text-decoration-line-through m-0 mb-1">
              {task.title}
            </h6>
            <small className="text-danger fw-semibold">
              Очікує видалення...
            </small>
          </div>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => undoDelete(task.id)}
          >
            Скасувати
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card mb-3 shadow-sm ${task.completed ? "opacity-75 bg-light" : ""}`}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5
            className={`card-title m-0 ${task.completed ? "text-decoration-line-through text-muted" : ""}`}
          >
            {task.title}
          </h5>
          <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="card-text text-muted small mb-2">{task.description}</p>
        )}

        <div className="d-flex align-items-center justify-content-between mt-3">
          {task.category && (
            <span className="badge bg-secondary">{task.category}</span>
          )}

          <div className="btn-group ms-auto">
            <button
              className={`btn btn-sm ${task.completed ? "btn-outline-secondary" : "btn-success"}`}
              onClick={() => toggleTask(task.id)}
            >
              {task.completed ? "Відновити" : "Виконати"}
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setEditingTask(task)}
            >
              Редагувати
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => requestDelete(task.id)}
            >
              Видалити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
