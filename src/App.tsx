import { useState } from "react";
import { Header } from "./components/Header";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskStats } from "./components/TaskStats";
import { Toast } from "./components/Toast";
import { taskRepository } from "./repositories/taskRepository";
import type { Task, Priority } from "./types/task";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddTask = async (
    title: string,
    _description: string,
    _category: string,
    _priority: Priority,
  ) => {
    try {
      const newTask = await taskRepository.create({ title, completed: false });
      setTasks((prev) => [newTask, ...prev]);
      setToastMessage("Завдання успішно створено на сервері!");
    } catch (err) {
      setToastMessage("Помилка створення завдання.");
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Header />
          <TaskStats tasks={tasks} />
          <TaskForm onAddTask={handleAddTask} />
          <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
