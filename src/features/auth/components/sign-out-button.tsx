"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button type="button" variant="outline" size="sm" className="min-h-10" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out
    </Button>
  );
}
