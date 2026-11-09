import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./env";

/**
 * Supabase client for Server Components, Server Functions and Route Handlers.
 *
 * Create a new client per request; never share one across requests.
 * `cookies()` is a request-time API, so with Cache Components enabled, call
 * this from inside a <Suspense> boundary (or a Server Function / Route Handler).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies cannot be written.
          // Safe to ignore: proxy.ts refreshes the session and writes cookies.
        }
      },
    },
  });
}
