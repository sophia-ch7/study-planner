import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { taskRepository } from "../repositories/taskRepository";
import { useAuth } from "../context/AuthContext";
import { TaskItem } from "../components/TaskItem";
import { Pagination } from "../components/Pagination";
import { TaskFormDialog } from "../components/TaskFormDialog";
import type { Task } from "../types/task";
import type { TaskFormData } from "../schemas/taskSchema";

export function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  // Зчитування параметрів з URL (Query Params)
  const statusFilter = searchParams.get("status") || "all";
  const page = Number(searchParams.get("page")) || 1;
  const LIMIT = 10;

  useEffect(() => {
    setLoading(true);
    const skip = (page - 1) * LIMIT;

    taskRepository
      .getAll(LIMIT, skip)
      .then((data) => {
        setTasks(data.tasks);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  // Фільтрація списку на основі Query Params
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "completed") return task.completed;
    if (statusFilter === "active") return !task.completed;
    return true;
  });

  const handleStatusChange = (newStatus: string) => {
    setSearchParams({ status: newStatus, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ status: statusFilter, page: String(newPage) });
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (data: TaskFormData) => {
    try {
      const newTask = await taskRepository.create({
        title: data.title,
        completed: false,
      });
      setTasks((prev) => [newTask, ...prev]);
      setIsCreateDialogOpen(false);
    } catch (err) {
      alert("Помилка створення завдання");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Список завдань 📋</h2>
        <button className="btn btn-primary" onClick={handleCreateClick}>
          + Створити завдання
        </button>
      </div>

      {/* Фільтрація через Query Params */}
      <div className="card p-3 mb-4 bg-light">
        <div className="d-flex align-items-center gap-3">
          <strong>Фільтр за статусом (URL Query Params):</strong>
          <button
            className={`btn btn-sm ${statusFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => handleStatusChange("all")}
          >
            Усі
          </button>
          <button
            className={`btn btn-sm ${statusFilter === "active" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => handleStatusChange("active")}
          >
            Активні
          </button>
          <button
            className={`btn btn-sm ${statusFilter === "completed" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => handleStatusChange("completed")}
          >
            Виконані
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">Завантаження...</div>
      ) : (
        <div>
          {filteredTasks.length === 0 ? (
            <div className="alert alert-warning text-center">
              Завдань не знайдено
            </div>
          ) : (
            filteredTasks.map((task) => (
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
                onTaskDeleted={(id) => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  setTasks((prev) => prev.filter((t) => t.id !== id));
                }}
                onShowDetails={(id) => navigate(`/tasks/${id}`)}
              />
            ))
          )}

          <Pagination
            currentPage={page}
            totalItems={total}
            itemsPerPage={LIMIT}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </div>
      )}

      <TaskFormDialog
        open={isCreateDialogOpen}
        mode="create"
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
