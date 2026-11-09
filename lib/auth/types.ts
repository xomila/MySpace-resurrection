/**
 * State returned by auth Server Actions to `useActionState` forms.
 * `values` repopulates inputs after a failed submit (React resets forms).
 * Never put passwords in here.
 */
export type AuthFormState = {
  /** Form-level error, shown above the submit button. */
  error?: string;
  /** Per-field errors keyed by input name. */
  fieldErrors?: Partial<Record<string, string>>;
  /** Non-error info, e.g. "check your email". */
  message?: string;
  values?: Partial<Record<string, string>>;
};
