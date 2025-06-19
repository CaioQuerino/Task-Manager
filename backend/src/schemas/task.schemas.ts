import { z } from "zod";

export const createTaskBodySchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  completed: z.boolean().default(false)
})

export const taskIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number")
})