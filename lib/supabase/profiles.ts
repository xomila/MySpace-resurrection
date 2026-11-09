import "server-only";
import { createClient } from "./server";

export type CurrentUser = {
  id: string;
  email: string | null;
};

export type ProfileSummary = {
  id: string;
  username: string;
  display_name: string | null;
};

/**
 * Returns the signed-in user, validated against Supabase Auth, or null.
 * Always use this (getUser) on the server, never trust getSession alone.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

export async function getProfileByUserId(
  userId: string,
): Promise<ProfileSummary | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("id", userId)
    .maybeSingle<ProfileSummary>();

  if (error) {
    console.error("getProfileByUserId failed:", error.message);
    return null;
  }
  return data;
}

export type CreateProfileResult =
  | { ok: true }
  | { ok: false; reason: "username_taken" | "unknown" };

/**
 * Creates the profile row (and a default theme row) for the signed-in user.
 * RLS only allows inserting a row whose id equals auth.uid().
 */
export async function createProfile(input: {
  userId: string;
  username: string;
  displayName: string | null;
}): Promise<CreateProfileResult> {
  const supabase = await createClient();

  const { error: profileError } = await supabase.from("profiles").insert({
    id: input.userId,
    username: input.username,
    display_name: input.displayName,
  });

  if (profileError) {
    // 23505 = unique_violation. The caller already checked that this user has
    // no profile, so a conflict here means the username is taken.
    if (profileError.code === "23505") {
      return { ok: false, reason: "username_taken" };
    }
    console.error("createProfile failed:", profileError.message);
    return { ok: false, reason: "unknown" };
  }

  // A missing theme row is recoverable (the profile page falls back to
  // defaults), so don't fail onboarding over it.
  const { error: themeError } = await supabase
    .from("themes")
    .insert({ user_id: input.userId });
  if (themeError) {
    console.error("default theme insert failed:", themeError.message);
  }

  return { ok: true };
}
