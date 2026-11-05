export type FilterType = "all" | "completed" | "uncompleted";

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TaskFilters({
  currentFilter,
  onFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="btn-group mb-4 w-100">
      <button
        className={`btn ${currentFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => onFilterChange("all")}
      >
        Всі
      </button>
      <button
        className={`btn ${currentFilter === "completed" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => onFilterChange("completed")}
      >
        Виконані
      </button>
      <button
        className={`btn ${currentFilter === "uncompleted" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => onFilterChange("uncompleted")}
      >
        Не виконані
      </button>
    </div>
  );
}
