import Link from "next/link";
import { logOut } from "@/lib/auth/actions";
import { getCurrentUser, getProfileByUserId } from "@/lib/supabase/profiles";

const linkClass = "font-medium underline underline-offset-4";

/**
 * Account links for the signed-in/out state. Reads cookies, so it must be
 * rendered inside a <Suspense> boundary.
 */
export async function AccountNav() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <nav aria-label="Account" className="flex gap-4">
        <Link href="/login" className={linkClass}>
          Log in
        </Link>
        <Link href="/signup" className={linkClass}>
          Sign up
        </Link>
      </nav>
    );
  }

  const profile = await getProfileByUserId(user.id);

  return (
    <nav aria-label="Account" className="flex flex-wrap items-center gap-4">
      {profile ? (
        <p>
          Signed in as <strong>@{profile.username}</strong>
        </p>
      ) : (
        <Link href="/onboarding" className={linkClass}>
          Finish setting up your profile
        </Link>
      )}
      <form action={logOut}>
        <button type="submit" className={linkClass}>
          Log out
        </button>
      </form>
    </nav>
  );
}
