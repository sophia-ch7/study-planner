import { useEffect, useState } from "react";
import { taskRepository } from "../repositories/taskRepository";
import type { Task } from "../types/task";

interface TaskDetailsModalProps {
  taskId: number | string | null;
  onClose: () => void;
}

export function TaskDetailsModal({ taskId, onClose }: TaskDetailsModalProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    taskRepository
      .getById(taskId, controller.signal)
      .then((data) => {
        setTask(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Не вдалося завантажити деталі завдання.");
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [taskId]);

  if (!taskId) return null;

  return (
    <div
      className="modal show d-block tab-index-1 bg-dark bg-opacity-50"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Деталі завдання #{taskId}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {loading && (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
                <p className="mt-2 text-muted">Завантаження деталей...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {task && !loading && (
              <div>
                <h4 className="mb-3">{task.title}</h4>
                <p>
                  <strong>Статус:</strong>{" "}
                  {task.completed ? "Виконано ✅" : "В процесі ⏳"}
                </p>
                <p>
                  <strong>Категорія:</strong> {task.category}
                </p>
                <p>
                  <strong>Пріоритет:</strong>{" "}
                  <span className="badge bg-secondary">{task.priority}</span>
                </p>
                <p>
                  <strong>Опис:</strong> {task.description || "Опис відсутній"}
                </p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Закрити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
