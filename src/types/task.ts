export type Priority = "low" | "medium" | "high";

export interface Task {
  id: number | string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  completed: boolean;
  isPendingDelete?: boolean;
}
