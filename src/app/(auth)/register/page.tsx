import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/habits");

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Email and password are stored securely (hashed). Use a strong password.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <RegisterForm />
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already registered?{" "}
          <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
