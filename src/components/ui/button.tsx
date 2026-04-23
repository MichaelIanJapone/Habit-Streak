import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-tight transition-[color,box-shadow,transform,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] text-white shadow-md hover:brightness-110",
        secondary:
          "border border-[var(--border)] bg-[var(--surface-solid)] text-foreground hover:bg-[var(--accent-soft)]",
        outline:
          "border border-[var(--border)] bg-transparent text-foreground hover:bg-[var(--accent-soft)]",
        ghost: "text-foreground hover:bg-[var(--accent-soft)]",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-500",
        link: "min-h-0 min-w-0 px-0 text-[var(--accent)] underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 min-h-9 rounded-lg px-3 text-xs",
        lg: "h-11 min-h-11 rounded-xl px-6 text-base",
        icon: "h-10 w-10 min-h-10 min-w-10 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} type={asChild ? undefined : type} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  },
);
Button.displayName = "Button";
