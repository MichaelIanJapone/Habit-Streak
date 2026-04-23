import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/habits");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Habit Streaks</CardTitle>
          <CardDescription>
            A small full-stack habit tracker: reusable UI, feature-based folders, Prisma, and Auth.js credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="secondary" className="flex-1">
            <Link href="/register">Create account</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
