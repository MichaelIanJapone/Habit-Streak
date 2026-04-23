"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { updateHabit } from "@/features/habits/actions/habit-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HabitDTO } from "@/features/habits/data/queries";

type Props = {
  habit: HabitDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HabitEditDialog({ habit, open, onOpenChange }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) el.close();
  }, [open]);

  function handleClose() {
    setError(null);
    onOpenChange(false);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateHabit({}, formData);
      if (result.error) setError(result.error);
      else onOpenChange(false);
    });
  }

  return (
    <dialog
      ref={dialogRef}
      className="max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-2xl sm:p-6"
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      <div className="flex flex-col gap-1 pb-4">
        <h2 className="text-lg font-semibold tracking-tight">Edit habit</h2>
        <p className="text-sm text-[var(--muted)]">Update the name or accent color.</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <input type="hidden" name="habitId" value={habit.id} />
        {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        <div className="flex flex-col gap-2">
          <Label htmlFor={`edit-name-${habit.id}`}>Name</Label>
          <Input key={`${habit.id}-${habit.name}`} id={`edit-name-${habit.id}`} name="name" defaultValue={habit.name} required maxLength={120} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`edit-color-${habit.id}`}>Color</Label>
          <Input
            key={`${habit.id}-${habit.color}`}
            id={`edit-color-${habit.id}`}
            name="color"
            type="color"
            defaultValue={habit.color}
            className="h-11 w-full max-w-[8rem] cursor-pointer"
          />
        </div>
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
