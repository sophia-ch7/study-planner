import type { Task } from "../types/task";

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <div className="row text-center mb-4">
      <div className="col-4">
        <div className="card bg-light p-2">
          <div className="fs-4 fw-bold text-primary">{totalTasks}</div>
          <div className="small text-muted">Всього</div>
        </div>
      </div>
      <div className="col-4">
        <div className="card bg-light p-2">
          <div className="fs-4 fw-bold text-warning">{activeTasks}</div>
          <div className="small text-muted">Активних</div>
        </div>
      </div>
      <div className="col-4">
        <div className="card bg-light p-2">
          <div className="fs-4 fw-bold text-success">{completedTasks}</div>
          <div className="small text-muted">Виконано</div>
        </div>
      </div>
    </div>
  );
}
