import { useState } from "react";
import type { Priority } from "../types/task";

interface TaskFormProps {
  onAdd: (
    title: string,
    description: string,
    category: string,
    priority: Priority,
  ) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Зупиняємо перезавантаження сторінки

    if (!title.trim()) return; // Валідація: не додаємо порожнє завдання

    onAdd(title, description, category, priority);

    // Очищуємо форму після успішного додавання
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("medium");
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Додати нове завдання</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Назва завдання (обов'язково)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Короткий опис"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Категорія (наприклад, React)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="low">Низька пріоритетність</option>
                <option value="medium">Середня пріоритетність</option>
                <option value="high">Висока пріоритетність</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Додати завдання
          </button>
        </form>
      </div>
    </div>
  );
}
