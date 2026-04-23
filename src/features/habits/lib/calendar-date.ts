/** Local calendar date as YYYY-MM-DD (browser / client convention). */
export function formatLocalDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Last `count` calendar days ending at `end` (inclusive), oldest first. */
export function lastNDatesLocal(end: Date, count: number): string[] {
  const dates: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    dates.push(formatLocalDateISO(d));
  }
  return dates;
}
