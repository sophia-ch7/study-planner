export type Priority = "low" | "medium" | "high";

export interface Task {
  id: number | string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
}
