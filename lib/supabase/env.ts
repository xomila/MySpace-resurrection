// NEXT_PUBLIC_* variables must be referenced statically so Next.js can inline
// them into the browser bundle. Do not read them via dynamic keys.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabasePublishableKey) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  );
}

export const SUPABASE_URL: string = supabaseUrl;
export const SUPABASE_PUBLISHABLE_KEY: string = supabasePublishableKey;
