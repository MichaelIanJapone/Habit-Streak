"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerUser, type RegisterState } from "@/features/auth/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: RegisterState = {};

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerUser, initial);

  useEffect(() => {
    if (state.success) {
      router.push("/sign-in?registered=1");
    }
  }, [state.success, router]);

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      {state.error ? <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name (optional)</Label>
        <Input id="name" name="name" type="text" autoComplete="name" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
