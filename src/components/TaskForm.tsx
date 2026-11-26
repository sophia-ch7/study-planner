import { useState } from "react";
import type { Priority } from "../types/task";

interface TaskFormProps {
  onAddTask: (
    title: string,
    description: string,
    category: string,
    priority: Priority,
  ) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask(title, description, category, priority);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Назва нового завдання..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary">
          Додати завдання ➕
        </button>
      </div>
    </form>
  );
}
