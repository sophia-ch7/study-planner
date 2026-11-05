import { useState } from "react";
import { Header } from "./components/Header";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskStats } from "./components/TaskStats";
import { TaskFilters, type FilterType } from "./components/TaskFilters";
import { initialTasks } from "./data/initialTasks";
import type { Task, Priority } from "./types/task";

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterType>("all");

  const handleAddTask = (
    title: string,
    description: string,
    category: string,
    priority: Priority,
  ) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      category,
      priority,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id: number | string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleDeleteTask = (id: number | string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Динамічно обчислюємо масив для відображення залежно від фільтра
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "uncompleted") return !task.completed;
    return true; // для 'all'
  });

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Header />
          <TaskStats tasks={tasks} />
          <TaskForm onAdd={handleAddTask} />
          <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
          <TaskList
            tasks={filteredTasks}
            totalCount={tasks.length}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
