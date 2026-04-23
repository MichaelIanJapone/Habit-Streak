import type { HabitDTO } from "@/features/habits/data/queries";
import { ArchivedHabitRow } from "@/features/habits/components/archived-habit-row";

type Props = { habits: HabitDTO[] };

export function ArchivedHabitsPanel({ habits }: Props) {
  if (habits.length === 0) return null;

  return (
    <details className="surface-card group overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-[var(--accent-soft)] sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-semibold tracking-tight">
          Archived habits
          <span className="ml-2 rounded-lg bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-bold tabular-nums text-foreground">{habits.length}</span>
        </span>
        <span className="arch-chevron text-xs font-medium text-[var(--muted)]" aria-hidden>
          ▼
        </span>
      </summary>
      <div className="border-t border-[var(--border)] px-4 py-4 sm:px-5">
        <ul className="flex flex-col gap-3">
          {habits.map((h) => (
            <li key={h.id}>
              <ArchivedHabitRow habit={h} />
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
