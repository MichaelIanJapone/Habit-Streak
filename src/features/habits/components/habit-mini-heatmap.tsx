"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { lastNDatesLocal, formatLocalDateISO } from "@/features/habits/lib/calendar-date";

type Props = {
  completedDates: string[];
  accentColor: string;
  days?: number;
};

export function HabitMiniHeatmap({ completedDates, accentColor, days = 28 }: Props) {
  const today = useMemo(() => new Date(), []);
  const range = useMemo(() => lastNDatesLocal(today, days), [today, days]);
  const done = useMemo(() => new Set(completedDates), [completedDates]);

  return (
    <div className="w-full" aria-label={`Last ${days} days activity`}>
      <div className="grid w-full grid-cols-7 gap-1">
        {range.map((d) => {
          const isOn = done.has(d);
          const isToday = d === formatLocalDateISO(today);
          return (
            <div
              key={d}
              title={d}
              className={cn(
                "aspect-square max-h-3 min-h-2.5 w-full rounded-md sm:max-h-3.5",
                isOn ? "opacity-100" : "bg-[var(--border)] opacity-60",
                isToday && "ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--background)]",
              )}
              style={isOn ? { backgroundColor: accentColor } : undefined}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-medium uppercase tracking-wider text-[var(--muted)] sm:text-xs">
        <span>{range[0]?.slice(5).replace("-", "/")}</span>
        <span className="hidden sm:inline">Last {days} days</span>
        <span>{range[range.length - 1]?.slice(5).replace("-", "/")}</span>
      </div>
    </div>
  );
}
