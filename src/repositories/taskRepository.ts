import { httpClient } from "../api/httpClient";
import type { ApiTodo, TodosResponse } from "../types/api";
import type { Task, Priority } from "../types/task";

function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: `User ID: ${todo.userId}`,
    completed: todo.completed,
    priority: "medium" as Priority,
    category: "General",
  };
}

export const taskRepository = {
  async getAll(
    limit: number = 10,
    skip: number = 0,
    signal?: AbortSignal,
  ): Promise<{ tasks: Task[]; total: number }> {
    const data = await httpClient<TodosResponse>(
      `/todos?limit=${limit}&skip=${skip}`,
      { signal },
    );
    return {
      tasks: data.todos.map(toTask),
      total: data.total,
    };
  },

  async getById(id: number | string, signal?: AbortSignal): Promise<Task> {
    const data = await httpClient<ApiTodo>(`/todos/${id}`, { signal });
    return toTask(data);
  },

  async create(task: {
    title: string;
    completed?: boolean;
    userId?: number;
  }): Promise<Task> {
    const data = await httpClient<ApiTodo>("/todos/add", {
      method: "POST",
      body: JSON.stringify({
        todo: task.title,
        completed: task.completed ?? false,
        userId: task.userId ?? 5, // Симуляція користувача
      }),
    });
    return toTask(data);
  },

  async update(
    id: number | string,
    updates: Partial<{ title: string; completed: boolean }>,
  ): Promise<Task> {
    const payload: Record<string, any> = {};
    if (updates.title !== undefined) payload.todo = updates.title;
    if (updates.completed !== undefined) payload.completed = updates.completed;

    const data = await httpClient<ApiTodo>(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return toTask(data);
  },

  async delete(id: number | string): Promise<void> {
    await httpClient<{ id: number; isDeleted: boolean; deletedOn: string }>(
      `/todos/${id}`,
      {
        method: "DELETE",
      },
    );
  },
};
