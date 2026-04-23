import type { HabitsOverview } from "@/features/habits/data/queries";

type Props = { overview: HabitsOverview };

export function HabitStatsOverview({ overview }: Props) {
  const tiles = [
    { label: "Active habits", value: overview.activeCount, unit: "" as const },
    { label: "Total check-ins", value: overview.totalCheckIns, unit: "" as const },
    { label: "Best current streak", value: overview.bestCurrentStreak, unit: "d" as const },
    { label: "Best longest streak", value: overview.bestLongestStreak, unit: "d" as const },
  ];

  return (
    <section aria-label="Overview statistics" className="surface-card p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)]">Overview</h2>
          <p className="text-base font-semibold tracking-tight text-foreground">Your momentum</p>
        </div>
        {overview.archivedCount > 0 ? (
          <p className="text-xs font-medium text-[var(--muted)]">
            {overview.archivedCount} archived — expand below to restore.
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/80 px-3 py-3 sm:px-4 sm:py-4"
          >
            <p className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-[var(--muted)] sm:text-xs">{t.label}</p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
              {t.value}
              {t.unit ? <span className="ml-0.5 text-lg font-semibold text-[var(--muted)]">{t.unit}</span> : null}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
