import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { getCurrentUser, getProfileByUserId } from "@/lib/supabase/profiles";

export const metadata: Metadata = { title: "Create your profile" };

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Create your profile</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <OnboardingGate />
      </Suspense>
    </main>
  );
}

/** Only signed-in users without a profile may see the form. */
async function OnboardingGate() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getProfileByUserId(user.id);
  if (profile) redirect("/");

  return <OnboardingForm />;
}
