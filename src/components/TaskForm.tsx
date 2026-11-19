import { useState, useEffect, type FormEvent } from "react";
import type { Priority } from "../types/task";
import { useTaskContext } from "../hooks/useTaskContext";

export function TaskForm() {
  const { addTask, updateTask, editingTask, setEditingTask } = useTaskContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("medium");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(
        editingTask.id,
        title.trim(),
        description.trim(),
        category.trim(),
        priority,
      );
    } else {
      addTask(title.trim(), description.trim(), category.trim(), priority);
      resetForm();
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4 shadow-sm">
      <h5 className="card-title mb-3">
        {editingTask ? "Редагувати завдання" : "Додати нове завдання"}
      </h5>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Назва завдання..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Опис (необов'язково)"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Категорія (напр. React)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Низький пріоритет</option>
            <option value="medium">Середній пріоритет</option>
            <option value="high">Високий пріоритет</option>
          </select>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button
          type="submit"
          className={`btn ${editingTask ? "btn-warning" : "btn-primary"} flex-grow-1`}
        >
          {editingTask ? "Зберегти зміни" : "Додати завдання"}
        </button>
        {editingTask && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleCancelEdit}
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}
