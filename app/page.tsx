import { Suspense } from "react";
import { AccountNav } from "@/components/auth/account-nav";

// Placeholder home page. Real design and profile links come in later steps.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">
        myspace-resurrection
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Your own corner of the internet.
      </p>
      <Suspense fallback={<div className="h-6" aria-hidden="true" />}>
        <AccountNav />
      </Suspense>
    </main>
  );
}
