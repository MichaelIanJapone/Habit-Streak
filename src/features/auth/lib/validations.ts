import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
  name: z.string().trim().max(80).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
