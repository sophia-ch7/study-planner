import { TaskItem } from "./TaskItem";
import { useTaskContext } from "../hooks/useTaskContext";

export function TaskList() {
  const { tasks, filter } = useTaskContext();

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "uncompleted") return !task.completed;
    return true;
  });

  if (tasks.length === 0) {
    return (
      <div className="alert alert-info text-center">
        Завдань поки немає.
        <br />
        Додайте перше навчальне завдання.
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        За цим фільтром завдань немає.
      </div>
    );
  }

  return (
    <div>
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
