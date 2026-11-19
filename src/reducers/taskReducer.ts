import type { Task, Priority } from "../types/task";
import { initialTasks } from "../data/initialTasks";

export type TaskAction =
  | {
      type: "add";
      payload: {
        title: string;
        description: string;
        category: string;
        priority: Priority;
      };
    }
  | { type: "toggle"; payload: { id: number | string } }
  | {
      type: "update";
      payload: {
        id: number | string;
        title: string;
        description: string;
        category: string;
        priority: Priority;
      };
    }
  | { type: "requestDelete"; payload: { id: number | string } }
  | { type: "confirmDelete"; payload: { id: number | string } }
  | { type: "undoDelete"; payload: { id: number | string } }
  | { type: "requestClearCompleted" }
  | { type: "undoClearCompleted" }
  | { type: "clearCompleted" }
  | { type: "reset"; payload?: Task[] };

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "add": {
      const newTask: Task = {
        id: Date.now(),
        title: action.payload.title,
        description: action.payload.description,
        category: action.payload.category,
        priority: action.payload.priority,
        completed: false,
        isPendingDelete: false,
      };
      return [...state, newTask];
    }

    case "toggle": {
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed }
          : task,
      );
    }

    case "update": {
      return state.map((task) =>
        task.id === action.payload.id
          ? {
              ...task,
              title: action.payload.title,
              description: action.payload.description,
              category: action.payload.category,
              priority: action.payload.priority,
            }
          : task,
      );
    }

    case "requestDelete": {
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, isPendingDelete: true }
          : task,
      );
    }

    case "confirmDelete": {
      return state.filter((task) => task.id !== action.payload.id);
    }

    case "undoDelete": {
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, isPendingDelete: false }
          : task,
      );
    }

    case "requestClearCompleted": {
      return state.map((task) =>
        task.completed ? { ...task, isPendingDelete: true } : task,
      );
    }

    case "undoClearCompleted": {
      return state.map((task) =>
        task.completed ? { ...task, isPendingDelete: false } : task,
      );
    }

    case "clearCompleted": {
      return state.filter((task) => !task.completed);
    }

    case "reset": {
      return action.payload ?? initialTasks;
    }

    default:
      return state;
  }
}
