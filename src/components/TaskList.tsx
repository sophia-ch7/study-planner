import { useEffect, useState } from "react";
import { taskRepository } from "../repositories/taskRepository";
import type { Task } from "../types/task";
import { TaskItem } from "./TaskItem";
import { Pagination } from "./Pagination";
import { TaskDetailsModal } from "./TaskDetailsModal";

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function TaskList({ tasks, setTasks }: TaskListProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedTaskId, setSelectedTaskId] = useState<number | string | null>(
    null,
  );

  const LIMIT = 10;

  const fetchTasks = (currentPage: number, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    const skip = (currentPage - 1) * LIMIT;

    taskRepository
      .getAll(LIMIT, skip, signal)
      .then((data) => {
        setTasks(data.tasks);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Не вдалося завантажити список завдань з REST API.");
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTasks(page, controller.signal);

    return () => {
      controller.abort();
    };
  }, [page]);

  const handleRetry = () => {
    fetchTasks(page);
  };

  return (
    <div>
      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Завантаження даних із REST API...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger text-center p-4" role="alert">
          <p className="mb-2 fw-semibold">{error}</p>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleRetry}
          >
            Спробувати ще раз 🔄
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tasks.length === 0 && (
        <div className="alert alert-warning text-center p-4">
          Завдань не знайдено.
        </div>
      )}

      {/* Success State */}
      {!loading && !error && tasks.length > 0 && (
        <div>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskToggle={(id, newCompleted) => {
                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === id ? { ...t, completed: newCompleted } : t,
                  ),
                );
              }}
              onTaskDeleted={(deletedId) => {
                setTasks((prev) => prev.filter((t) => t.id !== deletedId));
              }}
              onShowDetails={(id) => setSelectedTaskId(id)}
            />
          ))}

          <Pagination
            currentPage={page}
            totalItems={total}
            itemsPerPage={LIMIT}
            onPageChange={(newPage: number) => setPage(newPage)}
            disabled={loading}
          />
        </div>
      )}

      {/* Modal details */}
      <TaskDetailsModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
}
