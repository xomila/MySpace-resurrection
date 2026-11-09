// Pure validation helpers shared by Server Actions. No "use server" here, so
// these can export non-async values.

export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
export const PASSWORD_MIN_LENGTH = 8;
// bcrypt (used by Supabase Auth) ignores everything past 72 bytes.
export const PASSWORD_MAX_LENGTH = 72;
export const DISPLAY_NAME_MAX_LENGTH = 50;

// Usernames become URLs (app/[username]), so they must never collide with
// real routes. Add every new top-level route segment here.
const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "auth",
  "login",
  "logout",
  "signup",
  "signin",
  "onboarding",
  "settings",
  "profile",
  "profiles",
  "explore",
  "search",
  "friends",
  "comments",
  "music",
  "help",
  "about",
  "terms",
  "privacy",
  "support",
  "static",
  "public",
  "myspace",
  "root",
  "null",
  "undefined",
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function validateEmail(email: string): string | null {
  if (!email) return "Enter your email address.";
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Use at most ${PASSWORD_MAX_LENGTH} characters.`;
  }
  return null;
}

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function validateUsername(username: string): string | null {
  if (!USERNAME_PATTERN.test(username)) {
    return "Use 3 to 20 characters: lowercase letters, numbers or underscores.";
  }
  if (RESERVED_USERNAMES.has(username)) {
    return "That username is reserved. Pick another one.";
  }
  return null;
}

export function validateDisplayName(displayName: string): string | null {
  if (displayName.length > DISPLAY_NAME_MAX_LENGTH) {
    return `Use at most ${DISPLAY_NAME_MAX_LENGTH} characters.`;
  }
  return null;
}

/**
 * Only allow same-site relative paths in `next` parameters, to avoid open
 * redirects (e.g. `//evil.com` or `https://evil.com`).
 */
export function safeNextPath(next: string | null, fallback: string): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  return next;
}
