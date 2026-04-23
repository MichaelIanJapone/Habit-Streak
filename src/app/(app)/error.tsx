"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-bold tracking-tight">Something went wrong</h1>
      <p className="text-sm text-[var(--muted)]">
        The habits page hit a server error (often database connection or missing tables). Check Vercel → Deployment → <strong>Functions</strong> logs, and confirm{" "}
        <code className="rounded bg-[var(--border)] px-1 py-0.5 text-xs">DATABASE_URL</code> uses Neon’s <strong>pooled</strong> URL with this app’s latest deploy.
      </p>
      <Button type="button" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
