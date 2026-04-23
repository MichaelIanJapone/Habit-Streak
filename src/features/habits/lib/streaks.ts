function parseISODateParts(iso: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

/** Shift a calendar YYYY-MM-DD by `deltaDays` using UTC math on date parts (no local TZ drift). */
export function addDaysToISODate(iso: string, deltaDays: number): string | null {
  const parts = parseISODateParts(iso);
  if (!parts) return null;
  const utc = Date.UTC(parts.y, parts.m - 1, parts.d + deltaDays);
  const dt = new Date(utc);
  const y = dt.getUTCFullYear();
  const mo = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

/**
 * Current streak: consecutive completed calendar days ending today or yesterday
 * (so a habit still "counts" if you completed yesterday but not yet today).
 */
export function computeCurrentStreak(sortedCompletedDesc: string[], todayISO: string): number {
  const set = new Set(sortedCompletedDesc);
  let anchor = todayISO;
  if (!set.has(todayISO)) {
    const y = addDaysToISODate(todayISO, -1);
    if (!y || !set.has(y)) return 0;
    anchor = y;
  }

  let streak = 0;
  let cursor: string | null = anchor;
  while (cursor && set.has(cursor)) {
    streak += 1;
    cursor = addDaysToISODate(cursor, -1);
  }
  return streak;
}

/** Longest run of consecutive calendar days (unique dates, sorted ascending). */
export function computeLongestStreak(uniqueSortedAsc: string[]): number {
  if (uniqueSortedAsc.length === 0) return 0;
  let max = 1;
  let cur = 1;
  for (let i = 1; i < uniqueSortedAsc.length; i++) {
    const prev = uniqueSortedAsc[i - 1];
    const next = uniqueSortedAsc[i];
    const expected = addDaysToISODate(prev, 1);
    if (expected === next) cur += 1;
    else cur = 1;
    max = Math.max(max, cur);
  }
  return max;
}

export type HabitStats = {
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
};

export function computeHabitStats(completedDates: string[], todayISO: string): HabitStats {
  const unique = [...new Set(completedDates)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const sortedDesc = [...unique].reverse();
  return {
    totalCompletions: unique.length,
    currentStreak: computeCurrentStreak(sortedDesc, todayISO),
    longestStreak: computeLongestStreak(unique),
  };
}
