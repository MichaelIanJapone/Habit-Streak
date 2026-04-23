"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createHabitSchema, toggleCompletionSchema, updateHabitSchema } from "@/features/habits/lib/validations";

export type ActionState = { error?: string };

async function habitForUser(habitId: string, userId: string) {
  return prisma.habit.findFirst({
    where: { id: habitId, userId },
  });
}

export async function createHabit(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in." };

  const parsed = createHabitSchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid habit." };

  await prisma.habit.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      color: parsed.data.color,
    },
  });

  revalidatePath("/habits");
  return {};
}

export async function updateHabit(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in." };

  const parsed = updateHabitSchema.safeParse({
    habitId: formData.get("habitId"),
    name: formData.get("name"),
    color: formData.get("color") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid habit." };

  const habit = await habitForUser(parsed.data.habitId, session.user.id);
  if (!habit) return { error: "Habit not found." };

  await prisma.habit.update({
    where: { id: habit.id },
    data: { name: parsed.data.name, color: parsed.data.color },
  });

  revalidatePath("/habits");
  return {};
}

export async function setHabitArchived(habitId: string, archived: boolean): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in." };

  const habit = await habitForUser(habitId, session.user.id);
  if (!habit) return { error: "Habit not found." };

  await prisma.habit.update({
    where: { id: habitId },
    data: { archived },
  });

  revalidatePath("/habits");
  return {};
}

export async function deleteHabit(habitId: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in." };

  const habit = await habitForUser(habitId, session.user.id);
  if (!habit) return { error: "Habit not found." };

  await prisma.habit.delete({ where: { id: habitId } });
  revalidatePath("/habits");
  return {};
}

export async function toggleHabitCompletion(habitId: string, completedOn: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in." };

  const parsed = toggleCompletionSchema.safeParse({ habitId, completedOn });
  if (!parsed.success) return { error: "Invalid request." };

  const habit = await habitForUser(parsed.data.habitId, session.user.id);
  if (!habit) return { error: "Habit not found." };
  if (habit.archived) return { error: "Unarchive this habit to log days." };

  const existing = await prisma.habitEntry.findUnique({
    where: { habitId_completedOn: { habitId, completedOn: parsed.data.completedOn } },
  });

  if (existing) {
    await prisma.habitEntry.delete({ where: { id: existing.id } });
  } else {
    await prisma.habitEntry.create({
      data: { habitId, completedOn: parsed.data.completedOn },
    });
  }

  revalidatePath("/habits");
  return {};
}
