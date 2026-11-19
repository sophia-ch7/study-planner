import {
  createContext,
  useReducer,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import type { Task, Priority } from "../types/task";
import { taskReducer } from "../reducers/taskReducer";
import { initialTasks } from "../data/initialTasks";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { FilterType } from "../components/TaskFilters";

interface ToastState {
  message: string;
  subMessage?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface TaskContextType {
  tasks: Task[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  toast: ToastState | null;
  hideToast: () => void;
  addTask: (
    title: string,
    description: string,
    category: string,
    priority: Priority,
  ) => void;
  updateTask: (
    id: number | string,
    title: string,
    description: string,
    category: string,
    priority: Priority,
  ) => void;
  toggleTask: (id: number | string) => void;
  requestDelete: (id: number | string) => void;
  undoDelete: (id: number | string) => void;
  clearCompleted: () => void;
  resetTasks: () => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "study_planner_tasks";

function loadInitialTasks(): Task[] {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? (JSON.parse(item) as Task[]) : initialTasks;
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return initialTasks;
  }
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, [], loadInitialTasks);
  const [filter, setFilter] = useLocalStorage<FilterType>(
    "study_planner_filter",
    "all",
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const pendingTimerRef = useRef<{
    id: number | string;
    timer: ReturnType<typeof setTimeout>;
    actionType: "single" | "clearCompleted";
  } | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks]);

  useEffect(() => {
    const activeCount = tasks.filter(
      (t) => !t.completed && !t.isPendingDelete,
    ).length;
    document.title = `Study Planner — ${activeCount} active tasks`;
  }, [tasks]);

  const showToast = (
    message: string,
    subMessage?: string,
    actionLabel?: string,
    onAction?: () => void,
    duration?: number,
  ) => {
    setToast({ message, subMessage, actionLabel, onAction, duration });
  };

  const hideToast = () => {
    setToast(null);
  };

  const addTask = (
    title: string,
    description: string,
    category: string,
    priority: Priority,
  ) => {
    dispatch({
      type: "add",
      payload: { title, description, category, priority },
    });
    showToast("Завдання успішно додано!");
  };

  const updateTask = (
    id: number | string,
    title: string,
    description: string,
    category: string,
    priority: Priority,
  ) => {
    dispatch({
      type: "update",
      payload: { id, title, description, category, priority },
    });
    setEditingTask(null);
    showToast("Завдання успішно оновлено!");
  };

  const toggleTask = (id: number | string) => {
    dispatch({ type: "toggle", payload: { id } });
  };

  const requestDelete = (id: number | string) => {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current.timer);
      if (pendingTimerRef.current.actionType === "clearCompleted") {
        dispatch({ type: "clearCompleted" });
      } else {
        dispatch({
          type: "confirmDelete",
          payload: { id: pendingTimerRef.current.id },
        });
      }
    }

    dispatch({ type: "requestDelete", payload: { id } });

    const timer = setTimeout(() => {
      dispatch({ type: "confirmDelete", payload: { id } });
      pendingTimerRef.current = null;
      showToast("Завдання остаточно видалено.");
    }, 5000);

    pendingTimerRef.current = { id, timer, actionType: "single" };

    showToast(
      "Завдання буде видалено",
      "Undo скасовує таймер і повертає завдання.",
      "UNDO",
      () => {
        if (pendingTimerRef.current) {
          clearTimeout(pendingTimerRef.current.timer);
          pendingTimerRef.current = null;
        }
        dispatch({ type: "undoDelete", payload: { id } });
        showToast("Видалення скасовано.");
      },
      5000,
    );
  };

  const undoDelete = (id: number | string) => {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current.timer);
      if (pendingTimerRef.current.actionType === "clearCompleted") {
        dispatch({ type: "undoClearCompleted" });
      } else {
        dispatch({
          type: "undoDelete",
          payload: { id: pendingTimerRef.current.id },
        });
      }
      pendingTimerRef.current = null;
    } else {
      dispatch({ type: "undoDelete", payload: { id } });
    }
    showToast("Видалення скасовано.");
  };

  const clearCompleted = () => {
    const hasCompleted = tasks.some((t) => t.completed && !t.isPendingDelete);
    if (!hasCompleted) {
      showToast("Немає виконаних завдань для очищення.");
      return;
    }

    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current.timer);
      if (pendingTimerRef.current.actionType === "clearCompleted") {
        dispatch({ type: "clearCompleted" });
      } else {
        dispatch({
          type: "confirmDelete",
          payload: { id: pendingTimerRef.current.id },
        });
      }
    }

    dispatch({ type: "requestClearCompleted" });

    const timer = setTimeout(() => {
      dispatch({ type: "clearCompleted" });
      pendingTimerRef.current = null;
      showToast("Виконані завдання остаточно видалено.");
    }, 5000);

    pendingTimerRef.current = {
      id: "clear_completed",
      timer,
      actionType: "clearCompleted",
    };

    showToast(
      "Виконані завдання будуть видалені",
      "Undo скасовує таймер і повертає всі виконані завдання.",
      "UNDO",
      () => {
        if (pendingTimerRef.current) {
          clearTimeout(pendingTimerRef.current.timer);
          pendingTimerRef.current = null;
        }
        dispatch({ type: "undoClearCompleted" });
        showToast("Очищення виконаних скасовано.");
      },
      5000,
    );
  };

  const resetTasks = () => {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current.timer);
      pendingTimerRef.current = null;
    }
    dispatch({ type: "reset", payload: initialTasks });
    showToast("Початкові дані відновлено.");
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filter,
        setFilter,
        editingTask,
        setEditingTask,
        toast,
        hideToast,
        addTask,
        updateTask,
        toggleTask,
        requestDelete,
        undoDelete,
        clearCompleted,
        resetTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
