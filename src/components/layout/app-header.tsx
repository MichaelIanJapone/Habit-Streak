import Link from "next/link";
import { SignOutButton } from "@/features/auth/components/sign-out-button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-10">
        <Link href="/habits" className="text-sm font-bold tracking-tight sm:text-base">
          Habit Streaks
        </Link>
        <SignOutButton />
      </div>
    </header>
  );
}
