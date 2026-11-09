import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RedirectIfSignedIn } from "@/components/auth/redirect-if-signed-in";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Log in</h1>
      {/* searchParams and cookies are request-time data, so they stream in. */}
      <Suspense fallback={null}>
        <ConfirmationNotice searchParams={searchParams} />
        <RedirectIfSignedIn />
      </Suspense>
      <LoginForm />
      <p className="text-sm">
        New here?{" "}
        <Link href="/signup" className="font-medium underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </main>
  );
}

async function ConfirmationNotice({
  searchParams,
}: {
  searchParams: PageProps<"/login">["searchParams"];
}) {
  const { error } = await searchParams;
  if (error !== "confirmation_failed") return null;

  return (
    <p role="alert" className="text-sm text-red-700 dark:text-red-400">
      That confirmation link is invalid or has expired. Log in, or sign up
      again to get a new one.
    </p>
  );
}
