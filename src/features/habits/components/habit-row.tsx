"use client";

import { useMemo, useState, useTransition } from "react";
import { computeHabitStats } from "@/features/habits/lib/streaks";
import { formatLocalDateISO } from "@/features/habits/lib/calendar-date";
import { HabitMonthCalendar } from "@/features/habits/components/habit-month-calendar";
import { HabitMiniHeatmap } from "@/features/habits/components/habit-mini-heatmap";
import { HabitEditDialog } from "@/features/habits/components/habit-edit-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteHabit, setHabitArchived } from "@/features/habits/actions/habit-actions";
import type { HabitDTO } from "@/features/habits/data/queries";

type Props = { habit: HabitDTO };

export function HabitRow({ habit }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const today = useMemo(() => new Date(), []);
  const todayISO = formatLocalDateISO(today);
  const completed = useMemo(() => new Set(habit.completedDates), [habit.completedDates]);
  const stats = useMemo(() => computeHabitStats(habit.completedDates, todayISO), [habit.completedDates, todayISO]);

  function archive() {
    startTransition(async () => {
      await setHabitArchived(habit.id, true);
    });
  }

  function onDelete() {
    if (typeof window !== "undefined" && window.confirm(`Delete habit “${habit.name}” and all history?`)) {
      startTransition(async () => {
        await deleteHabit(habit.id);
      });
    }
  }

  return (
    <>
      <article className="surface-card overflow-hidden">
        <div className="flex flex-col gap-5 p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2.5 gap-y-2">
                <span className="h-3 w-3 shrink-0 rounded-full ring-2 ring-[var(--border)]" style={{ backgroundColor: habit.color }} aria-hidden />
                <h3 className="min-w-0 truncate text-lg font-bold tracking-tight sm:text-xl">{habit.name}</h3>
                <Badge className="shrink-0" aria-label={`Current streak ${stats.currentStreak} days`}>
                  {stats.currentStreak}d current
                </Badge>
                <Badge className="shrink-0 bg-transparent">{stats.longestStreak}d best</Badge>
                <Badge className="shrink-0 bg-transparent">{stats.totalCompletions} total</Badge>
              </div>
              <p className="text-xs font-medium text-[var(--muted)] sm:text-sm">
                Use the calendar — tap a day to toggle. Use ‹ › to move between months (any past month).
              </p>
              <HabitMonthCalendar habitId={habit.id} completed={completed} accentColor={habit.color} />
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 lg:flex-col lg:items-stretch">
              <Button type="button" variant="secondary" size="sm" className="min-h-11 flex-1 lg:flex-none" onClick={() => setEditOpen(true)}>
                Edit
              </Button>
              <Button type="button" variant="outline" size="sm" className="min-h-11 flex-1 lg:flex-none" disabled={pending} onClick={archive}>
                Archive
              </Button>
              <Button type="button" variant="ghost" size="sm" className="min-h-11 flex-1 text-red-600 hover:bg-red-500/10 lg:flex-none" disabled={pending} onClick={onDelete}>
                Delete
              </Button>
            </div>
          </div>
          <div className="border-t border-[var(--border)] pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">28-day activity</p>
            <HabitMiniHeatmap completedDates={habit.completedDates} accentColor={habit.color} />
          </div>
        </div>
      </article>
      <HabitEditDialog habit={habit} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
