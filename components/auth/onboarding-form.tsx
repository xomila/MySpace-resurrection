"use client";

import { useActionState } from "react";
import { createProfileAction } from "@/lib/auth/actions";
import type { AuthFormState } from "@/lib/auth/types";
import { DISPLAY_NAME_MAX_LENGTH } from "@/lib/auth/validation";
import { FormField } from "./form-field";

const initialState: AuthFormState = {};

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(
    createProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <FormField
        label="Username"
        name="username"
        type="text"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        required
        minLength={3}
        maxLength={20}
        defaultValue={state.values?.username}
        hint="3 to 20 characters: lowercase letters, numbers or underscores. This is your profile address."
        error={state.fieldErrors?.username}
      />
      <FormField
        label="Display name (optional)"
        name="display_name"
        type="text"
        autoComplete="nickname"
        maxLength={DISPLAY_NAME_MAX_LENGTH}
        defaultValue={state.values?.display_name}
        error={state.fieldErrors?.display_name}
      />
      <div aria-live="polite">
        {state.error ? (
          <p className="text-sm text-red-700 dark:text-red-400">{state.error}</p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-md bg-foreground px-4 font-medium text-background disabled:opacity-60"
      >
        {pending ? "Creating profile…" : "Create profile"}
      </button>
    </form>
  );
}
