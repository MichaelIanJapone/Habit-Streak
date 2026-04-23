import type { HabitDTO } from "@/features/habits/data/queries";
import { HabitRow } from "@/features/habits/components/habit-row";

type Props = { habits: HabitDTO[] };

export function HabitList({ habits }: Props) {
  if (habits.length === 0) {
    return (
      <div className="surface-card px-6 py-14 text-center">
        <p className="text-sm font-medium text-[var(--muted)] sm:text-base">No active habits yet.</p>
        <p className="mt-2 text-xs text-[var(--muted)] sm:text-sm">Create one above — pick a color you will enjoy seeing every day.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitRow habit={habit} />
        </li>
      ))}
    </ul>
  );
}
