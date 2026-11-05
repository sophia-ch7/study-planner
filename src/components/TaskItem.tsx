import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number | string) => void;
  onDelete: (id: number | string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div
      className={`card mb-3 ${task.completed ? "bg-light text-muted opacity-75" : ""}`}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">
            {task.completed ? <s>{task.title}</s> : task.title}
          </h5>
          <span
            className={`badge ${
              task.priority === "high"
                ? "bg-danger"
                : task.priority === "medium"
                  ? "bg-warning text-dark"
                  : "bg-success"
            }`}
          >
            {task.priority}
          </span>
        </div>
        <p className="card-text">{task.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="badge bg-secondary">{task.category}</span>
          <div className="btn-group ms-auto">
            <button
              className={`btn btn-sm ${task.completed ? "btn-secondary" : "btn-success"}`}
              onClick={() => onToggle(task.id)}
            >
              {task.completed ? "Відновити" : "Виконати"}
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(task.id)}
            >
              Видалити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
