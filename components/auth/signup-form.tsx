"use client";

import { useActionState } from "react";
import { signUp } from "@/lib/auth/actions";
import type { AuthFormState } from "@/lib/auth/types";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/validation";
import { FormField } from "./form-field";

const initialState: AuthFormState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={PASSWORD_MIN_LENGTH}
        hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
        error={state.fieldErrors?.password}
      />
      <div aria-live="polite">
        {state.error ? (
          <p className="text-sm text-red-700 dark:text-red-400">{state.error}</p>
        ) : null}
        {state.message ? <p className="text-sm">{state.message}</p> : null}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-md bg-foreground px-4 font-medium text-background disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}
