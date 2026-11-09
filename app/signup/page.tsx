import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RedirectIfSignedIn } from "@/components/auth/redirect-if-signed-in";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <SignupForm />
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline underline-offset-4">
          Log in
        </Link>
      </p>
    </main>
  );
}
