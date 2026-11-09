"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createProfile,
  getCurrentUser,
  getProfileByUserId,
} from "@/lib/supabase/profiles";
import type { AuthFormState } from "./types";
import {
  getString,
  normalizeUsername,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validateUsername,
} from "./validation";

// NOTE: redirect() works by throwing, so it must never sit inside try/catch.

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getString(formData, "email").trim().toLowerCase();
  const password = getString(formData, "password");

  const fieldErrors: Record<string, string> = {};
  const emailError = validateEmail(email);
  if (emailError) fieldErrors.email = emailError;
  const passwordError = validatePassword(password);
  if (passwordError) fieldErrors.password = passwordError;
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: { email } };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return {
      error:
        error.status === 429
          ? "Too many attempts. Wait a moment and try again."
          : "We couldn't create your account. Try again.",
      values: { email },
    };
  }

  // Email confirmation off: a session exists right away.
  if (data.session) {
    redirect("/onboarding");
  }

  // Email confirmation on. The same message is shown whether or not the
  // address is already registered, so signup can't be used to probe accounts.
  return {
    message:
      "Check your email for a confirmation link to finish creating your account.",
    values: { email },
  };
}

export async function logIn(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getString(formData, "email").trim().toLowerCase();
  const password = getString(formData, "password");

  const fieldErrors: Record<string, string> = {};
  const emailError = validateEmail(email);
  if (emailError) fieldErrors.email = emailError;
  if (!password) fieldErrors.password = "Enter your password.";
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: { email } };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      error:
        error?.status === 429
          ? "Too many attempts. Wait a moment and try again."
          : "Invalid email or password.",
      values: { email },
    };
  }

  const profile = await getProfileByUserId(data.user.id);
  redirect(profile ? "/" : "/onboarding");
}

export async function logOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createProfileAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  // Re-verify the user inside the action; the page check is not enough.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (await getProfileByUserId(user.id)) redirect("/");

  const username = normalizeUsername(getString(formData, "username"));
  const displayName = getString(formData, "display_name").trim();
  const values = { username, display_name: displayName };

  const fieldErrors: Record<string, string> = {};
  const usernameError = validateUsername(username);
  if (usernameError) fieldErrors.username = usernameError;
  const displayNameError = validateDisplayName(displayName);
  if (displayNameError) fieldErrors.display_name = displayNameError;
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  const result = await createProfile({
    userId: user.id,
    username,
    displayName: displayName || null,
  });

  if (!result.ok) {
    if (result.reason === "username_taken") {
      return {
        fieldErrors: { username: "That username is taken. Try another one." },
        values,
      };
    }
    return { error: "We couldn't create your profile. Try again.", values };
  }

  redirect("/");
}
