import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/features/auth/components/sign-in-form";

type Props = { searchParams: Promise<{ registered?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user) redirect("/habits");

  const q = await searchParams;
  const justRegistered = q.registered === "1";

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use the email and password for your account.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {justRegistered ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            Account created. You can sign in now.
          </p>
        ) : null}
        <SignInForm />
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          No account?{" "}
          <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
