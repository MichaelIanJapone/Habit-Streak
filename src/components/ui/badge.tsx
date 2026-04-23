import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-foreground",
        className,
      )}
      {...props}
    />
  );
}
