import { useTaskContext } from "../hooks/useTaskContext";

export type FilterType = "all" | "completed" | "uncompleted";

export function TaskFilters() {
  const { filter, setFilter } = useTaskContext();

  return (
    <div className="btn-group mb-4 w-100">
      <button
        className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => setFilter("all")}
      >
        Всі
      </button>
      <button
        className={`btn ${filter === "completed" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => setFilter("completed")}
      >
        Виконані
      </button>
      <button
        className={`btn ${filter === "uncompleted" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => setFilter("uncompleted")}
      >
        Не виконані
      </button>
    </div>
  );
}
