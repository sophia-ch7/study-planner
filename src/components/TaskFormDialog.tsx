import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "../schemas/taskSchema";
import type { Task } from "../types/task";

interface TaskFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  task?: Task | null;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

export function TaskFormDialog({
  open,
  mode,
  task,
  onClose,
  onSubmit,
}: TaskFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "General",
      priority: "medium",
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && task) {
        reset({
          title: task.title,
          description: task.description || "",
          category: task.category || "General",
          priority: task.priority || "medium",
        });
      } else {
        reset({
          title: "",
          description: "",
          category: "General",
          priority: "medium",
        });
      }
    }
  }, [open, mode, task, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal show d-block bg-dark bg-opacity-50"
      tabIndex={-1}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "create"
                ? "Створити нове завдання ➕"
                : "Редагувати завдання ✏️"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Назва завдання</label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  {...register("title")}
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Опис</label>
                <textarea
                  className="form-control"
                  rows={3}
                  {...register("description")}
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Категорія</label>
                  <input
                    type="text"
                    className={`form-control ${errors.category ? "is-invalid" : ""}`}
                    {...register("category")}
                  />
                  {errors.category && (
                    <div className="invalid-feedback">
                      {errors.category.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Пріоритет</label>
                  <select className="form-select" {...register("priority")}>
                    <option value="low">Low (Низький)</option>
                    <option value="medium">Medium (Середній)</option>
                    <option value="high">High (Високий)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Збереження..."
                  : mode === "create"
                    ? "Створити"
                    : "Зберегти зміни"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
