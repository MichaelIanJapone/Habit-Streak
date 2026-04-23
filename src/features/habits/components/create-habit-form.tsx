"use client";

import { useActionState } from "react";
import { createHabit, type ActionState } from "@/features/habits/actions/habit-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export function CreateHabitForm() {
  const [state, formAction, pending] = useActionState(createHabit, initial);

  return (
    <form action={formAction} className="surface-card flex flex-col gap-5 p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">New habit</h2>
        <p className="mt-1.5 text-sm text-[var(--muted)]">Name it, pick an accent color, then use the calendar on each habit to log days in any month.</p>
      </div>
      {state.error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{state.error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="flex flex-col gap-2">
          <Label htmlFor="habit-name">Habit name</Label>
          <Input id="habit-name" name="name" placeholder="Morning stretch, Read, Walk…" required maxLength={120} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="habit-color">Accent</Label>
          <Input id="habit-color" name="color" type="color" defaultValue="#6366f1" className="h-11 w-full max-w-full cursor-pointer sm:w-28" />
        </div>
      </div>
      <div>
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
          {pending ? "Saving…" : "Add habit"}
        </Button>
      </div>
    </form>
  );
}
