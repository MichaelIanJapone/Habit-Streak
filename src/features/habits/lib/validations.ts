import { z } from "zod";

export const dateISOSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date.");

export const createHabitSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Pick a valid hex color.")
    .optional()
    .default("#6366f1"),
});

export const updateHabitSchema = createHabitSchema.extend({
  habitId: z.string().min(1),
});

export const toggleCompletionSchema = z.object({
  habitId: z.string().min(1),
  completedOn: dateISOSchema,
});
