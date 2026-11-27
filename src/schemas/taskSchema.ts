import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "Назва повинна містити як мінімум 3 символи"),
  description: z.string().optional(),
  category: z.string().min(1, "Вкажіть категорію"),
  priority: z.enum(["low", "medium", "high"]),
});

export type TaskFormData = z.infer<typeof taskSchema>;
