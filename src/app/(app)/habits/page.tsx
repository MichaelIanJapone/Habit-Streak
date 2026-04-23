import { auth } from "@/auth";
import { HabitsBoard } from "@/features/habits/components/habits-board";

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-0 sm:px-1">
      <header className="mb-8 sm:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your habits</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Each habit has a month calendar — browse with ‹ › and tap days to log. The heatmap shows the last four weeks at a glance.
        </p>
      </header>
      <HabitsBoard userId={userId} />
    </div>
  );
}
