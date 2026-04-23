import { getHabitsForUser, getHabitsOverview } from "@/features/habits/data/queries";
import { CreateHabitForm } from "@/features/habits/components/create-habit-form";
import { HabitList } from "@/features/habits/components/habit-list";
import { HabitStatsOverview } from "@/features/habits/components/habit-stats-overview";
import { ArchivedHabitsPanel } from "@/features/habits/components/archived-habits-panel";

type Props = { userId: string };

export async function HabitsBoard({ userId }: Props) {
  const [overview, activeHabits, archivedHabits] = await Promise.all([
    getHabitsOverview(userId),
    getHabitsForUser(userId, { archived: false }),
    getHabitsForUser(userId, { archived: true }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 lg:max-w-5xl">
      <HabitStatsOverview overview={overview} />
      <CreateHabitForm />
      <section aria-label="Active habits" className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)]">Active</h2>
        <HabitList habits={activeHabits} />
      </section>
      <ArchivedHabitsPanel habits={archivedHabits} />
    </div>
  );
}
