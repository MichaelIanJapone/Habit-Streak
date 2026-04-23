"use client";

import { useMemo, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { formatLocalDateISO } from "@/features/habits/lib/calendar-date";
import { toggleHabitCompletion } from "@/features/habits/actions/habit-actions";
import { Button } from "@/components/ui/button";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type Cell = { kind: "empty" } | { kind: "day"; iso: string; day: number };

function buildMonthCells(year: number, month: number): Cell[] {
  const first = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const padMonFirst = (first.getDay() + 6) % 7;
  const cells: Cell[] = [];
  for (let i = 0; i < padMonFirst; i++) cells.push({ kind: "empty" });
  for (let d = 1; d <= lastDay; d++) {
    cells.push({
      kind: "day",
      day: d,
      iso: formatLocalDateISO(new Date(year, month, d)),
    });
  }
  while (cells.length % 7 !== 0) cells.push({ kind: "empty" });
  return cells;
}

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

type Props = {
  habitId: string;
  completed: Set<string>;
  accentColor: string;
};

export function HabitMonthCalendar({ habitId, completed, accentColor }: Props) {
  const [pending, startTransition] = useTransition();
  const today = useMemo(() => new Date(), []);
  const todayISO = formatLocalDateISO(today);
  const todayY = today.getFullYear();
  const todayM = today.getMonth();

  const [view, setView] = useState(() => ({ year: todayY, month: todayM }));

  const cells = useMemo(() => buildMonthCells(view.year, view.month), [view.year, view.month]);
  const isCurrentMonth = view.year === todayY && view.month === todayM;
  const canGoNext = view.year < todayY || (view.year === todayY && view.month < todayM);

  function goPrevMonth() {
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }));
  }

  function goNextMonth() {
    if (!canGoNext) return;
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }));
  }

  function jumpToToday() {
    setView({ year: todayY, month: todayM });
  }

  function onDayClick(iso: string) {
    if (iso > todayISO) return;
    startTransition(async () => {
      await toggleHabitCompletion(habitId, iso);
    });
  }

  return (
    <div className={cn("flex flex-col gap-3", pending && "opacity-60")} aria-busy={pending}>
      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="secondary" size="icon" className="shrink-0" onClick={goPrevMonth} aria-label="Previous month">
          ‹
        </Button>
        <span className="min-w-0 flex-1 text-center text-sm font-bold tracking-tight sm:text-base">{monthLabel(view.year, view.month)}</span>
        <Button type="button" variant="secondary" size="icon" className="shrink-0" disabled={!canGoNext} onClick={goNextMonth} aria-label="Next month">
          ›
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)] sm:text-xs">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {cells.map((cell, i) => {
          if (cell.kind === "empty") {
            return <div key={`e-${i}`} className="aspect-square min-h-[2.5rem] sm:min-h-10" />;
          }
          const { iso, day } = cell;
          const isFuture = iso > todayISO;
          const isOn = completed.has(iso);
          const isToday = iso === todayISO;
          return (
            <button
              key={iso}
              type="button"
              disabled={isFuture}
              title={iso}
              onClick={() => onDayClick(iso)}
              className={cn(
                "flex aspect-square min-h-[2.75rem] min-w-0 items-center justify-center rounded-xl border text-sm font-semibold tabular-nums transition-[transform,box-shadow,colors] active:scale-[0.96] sm:min-h-10 sm:text-base",
                isFuture && "cursor-not-allowed border-transparent bg-[var(--border)]/30 text-[var(--muted)]/50",
                !isFuture && !isOn && "border-[var(--border)] bg-[var(--surface-solid)]/80 text-foreground hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]",
                !isFuture && isOn && "border-transparent text-white shadow-md",
                isToday && !isFuture && "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--background)]",
              )}
              style={!isFuture && isOn ? { backgroundColor: accentColor } : undefined}
            >
              {day}
            </button>
          );
        })}
      </div>
      {!isCurrentMonth ? (
        <Button type="button" variant="ghost" size="sm" className="self-center text-xs" onClick={jumpToToday}>
          Jump to this month
        </Button>
      ) : null}
    </div>
  );
}
