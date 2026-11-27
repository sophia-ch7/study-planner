import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { taskRepository } from "../repositories/taskRepository";
import { useAuth } from "../context/AuthContext";
import { TaskFormDialog } from "../components/TaskFormDialog";
import type { Task } from "../types/task";
import type { TaskFormData } from "../schemas/taskSchema";

export function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!taskId) return;

    setLoading(true);
    taskRepository
      .getById(taskId)
      .then((data) => {
        setTask(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Не вдалося завантажити деталі завдання.");
        setLoading(false);
      });
  }, [taskId]);

  const handleEditClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!task || !window.confirm(`Видалити завдання "${task.title}"?`)) return;

    try {
      await taskRepository.delete(task.id);
      navigate("/tasks");
    } catch (err) {
      alert("Помилка видалення завдання.");
    }
  };

  const handleEditSubmit = async (data: TaskFormData) => {
    if (!task) return;
    try {
      await taskRepository.update(task.id, data);
      setTask((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          title: data.title,
          description: data.description || "",
          category: data.category,
          priority: data.priority,
        } as Task;
      });
      setIsEditDialogOpen(false);
    } catch (err) {
      alert("Помилка оновлення завдання.");
    }
  };

  if (loading) {
    return <div className="text-center py-5">Завантаження деталей...</div>;
  }

  if (error || !task) {
    return (
      <div className="alert alert-danger">
        {error || "Завдання не знайдено"}
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h2>{task.title}</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={handleEditClick}>
            Редагувати ✏️
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={handleDeleteClick}
          >
            Видалити 🗑️
          </button>
        </div>
      </div>

      <hr />

      <div className="row mb-3">
        <div className="col-md-6">
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
        </div>
        <div className="col-md-6">
          {/* Клієнтські метадані відповідно до вимог ЛБ11 */}
          <p>
            <strong>Створив:</strong>{" "}
            <span className="text-muted">
              Client Metadata (Користувач системи)
            </span>
          </p>
          <p>
            <strong>Дата створення:</strong>{" "}
            <span className="text-muted">
              {new Date().toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h5>Опис:</h5>
        <p className="bg-light p-3 rounded">
          {task.description || "Опис відсутній"}
        </p>
      </div>

      <button className="btn btn-secondary" onClick={() => navigate("/tasks")}>
        &laquo; Назад до списку
      </button>

      <TaskFormDialog
        open={isEditDialogOpen}
        mode="edit"
        task={task}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
}
