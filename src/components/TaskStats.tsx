import type { Task } from "../types/task";

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const uncompleted = total - completed;

  return (
    <div className="row mb-4 text-center">
      <div className="col">
        <div className="p-3 bg-light border rounded">
          <h6>Всього</h6>
          <span className="fs-4 fw-bold text-primary">{total}</span>
        </div>
      </div>
      <div className="col">
        <div className="p-3 bg-light border rounded">
          <h6>Виконано</h6>
          <span className="fs-4 fw-bold text-success">{completed}</span>
        </div>
      </div>
      <div className="col">
        <div className="p-3 bg-light border rounded">
          <h6>Не виконано</h6>
          <span className="fs-4 fw-bold text-warning">{uncompleted}</span>
        </div>
      </div>
    </div>
  );
}
