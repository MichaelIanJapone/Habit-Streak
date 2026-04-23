import { prisma } from "@/lib/prisma";
import { formatLocalDateISO } from "@/features/habits/lib/calendar-date";
import { computeHabitStats } from "@/features/habits/lib/streaks";

export type HabitDTO = {
  id: string;
  name: string;
  color: string;
  archived: boolean;
  completedDates: string[];
};

export async function getHabitsForUser(userId: string, opts: { archived: boolean }): Promise<HabitDTO[]> {
  const habits = await prisma.habit.findMany({
    where: { userId, archived: opts.archived },
    orderBy: { createdAt: "asc" },
    include: {
      entries: { select: { completedOn: true } },
    },
  });

  return habits.map((h) => ({
    id: h.id,
    name: h.name,
    color: h.color,
    archived: h.archived,
    completedDates: h.entries.map((e) => e.completedOn),
  }));
}

export type HabitsOverview = {
  activeCount: number;
  archivedCount: number;
  totalCheckIns: number;
  bestCurrentStreak: number;
  bestLongestStreak: number;
};

export async function getHabitsOverview(userId: string): Promise<HabitsOverview> {
  const [active, archived, activeWithEntries] = await Promise.all([
    prisma.habit.count({ where: { userId, archived: false } }),
    prisma.habit.count({ where: { userId, archived: true } }),
    prisma.habit.findMany({
      where: { userId, archived: false },
      include: { entries: { select: { completedOn: true } } },
    }),
  ]);

  const todayISO = formatLocalDateISO(new Date());
  let totalCheckIns = 0;
  let bestCurrentStreak = 0;
  let bestLongestStreak = 0;

  for (const h of activeWithEntries) {
    const dates = h.entries.map((e) => e.completedOn);
    const stats = computeHabitStats(dates, todayISO);
    totalCheckIns += stats.totalCompletions;
    bestCurrentStreak = Math.max(bestCurrentStreak, stats.currentStreak);
    bestLongestStreak = Math.max(bestLongestStreak, stats.longestStreak);
  }

  return {
    activeCount: active,
    archivedCount: archived,
    totalCheckIns,
    bestCurrentStreak,
    bestLongestStreak,
  };
}
