"use client";

import { useActionState } from "react";
import { logIn } from "@/lib/auth/actions";
import type { AuthFormState } from "@/lib/auth/types";
import { FormField } from "./form-field";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(logIn, initialState);

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
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
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
        {pending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
