"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/features/auth/lib/validations";

export type RegisterState = { error?: string; success?: boolean };

export async function registerUser(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email, password, name } = parsed.data;
  const normalized = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.create({
    data: {
      email: normalized,
      name: name || null,
      passwordHash,
    },
  });

  return { success: true };
}
