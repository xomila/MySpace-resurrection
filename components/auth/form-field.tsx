import type { InputHTMLAttributes } from "react";

type FormFieldProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "id">;

export function FormField({ label, name, error, hint, ...inputProps }: FormFieldProps) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="h-11 rounded-md border border-black/20 bg-white px-3 text-base text-black dark:border-white/25 dark:bg-zinc-900 dark:text-white"
        {...inputProps}
      />
      {hint ? (
        <p id={hintId} className="text-sm text-zinc-600 dark:text-zinc-400">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
