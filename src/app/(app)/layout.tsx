import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppHeader } from "@/components/layout/app-header";

export default async function AppSectionLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <>
      <AppHeader />
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">{children}</main>
    </>
  );
}
