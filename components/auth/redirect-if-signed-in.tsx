import { redirect } from "next/navigation";
import { getCurrentUser, getProfileByUserId } from "@/lib/supabase/profiles";

/**
 * Sends signed-in users away from /login and /signup. Reads cookies, so it
 * must be rendered inside a <Suspense> boundary.
 */
export async function RedirectIfSignedIn() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getProfileByUserId(user.id);
  redirect(profile ? "/" : "/onboarding");
}
