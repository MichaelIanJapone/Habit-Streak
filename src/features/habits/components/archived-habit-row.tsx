"use client";

import { useMemo, useTransition } from "react";
import { formatLocalDateISO } from "@/features/habits/lib/calendar-date";
import { computeHabitStats } from "@/features/habits/lib/streaks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteHabit, setHabitArchived } from "@/features/habits/actions/habit-actions";
import type { HabitDTO } from "@/features/habits/data/queries";

type Props = { habit: HabitDTO };

export function ArchivedHabitRow({ habit }: Props) {
  const [pending, startTransition] = useTransition();
  const todayISO = useMemo(() => formatLocalDateISO(new Date()), []);
  const stats = useMemo(() => computeHabitStats(habit.completedDates, todayISO), [habit.completedDates, todayISO]);

  function restore() {
    startTransition(async () => {
      await setHabitArchived(habit.id, false);
    });
  }

  function remove() {
    if (typeof window !== "undefined" && window.confirm(`Permanently delete “${habit.name}” and all its history?`)) {
      startTransition(async () => {
        await deleteHabit(habit.id);
      });
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full sm:h-3 sm:w-3" style={{ backgroundColor: habit.color }} aria-hidden />
        <span className="truncate font-semibold tracking-tight">{habit.name}</span>
        <div className="flex flex-wrap gap-2">
          <Badge>{stats.totalCompletions} check-ins</Badge>
          <Badge>Longest {stats.longestStreak}d</Badge>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" disabled={pending} onClick={restore}>
          Restore
        </Button>
        <Button type="button" variant="destructive" size="sm" disabled={pending} onClick={remove}>
          Delete
        </Button>
      </div>
    </div>
  );
}
