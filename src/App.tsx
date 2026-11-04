import { useState } from "react";
import { Header } from "./components/Header";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { initialTasks } from "./data/initialTasks";
import type { Task, Priority } from "./types/task";

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleAddTask = (
    title: string,
    description: string,
    category: string,
    priority: Priority,
  ) => {
    const newTask: Task = {
      id: Date.now(), // Використовуємо timestamp як унікальний id
      title,
      description,
      category,
      priority,
      completed: false,
    };

    // Immutable update: створюємо новий масив, копіюючи старі завдання і додаючи нове
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Header />
          <TaskForm onAdd={handleAddTask} />
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

export default App;
