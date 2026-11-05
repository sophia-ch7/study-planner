import type { Task } from "../types/task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  totalCount: number;
  onToggle: (id: number | string) => void;
  onDelete: (id: number | string) => void;
}

export function TaskList({
  tasks,
  totalCount,
  onToggle,
  onDelete,
}: TaskListProps) {
  if (totalCount === 0) {
    return (
      <div className="alert alert-info text-center">
        Завдань поки немає.
        <br />
        Додайте перше навчальне завдання.
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        За цим фільтром завдань немає.
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
