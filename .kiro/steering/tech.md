# Tech Stack

## Core
- **Next.js 16** (App Router). This version has breaking changes. Always read `node_modules/next/dist/docs/` before writing Next.js-specific code; do not rely on training-data knowledge of earlier versions.
- **React 19**
- **TypeScript 5**
- **Backend:** Supabase (Postgres, Auth, Storage)

## Styling
- **Tailwind CSS v4**, configured via the `@tailwindcss/turbopack` loader; imported with `@import "tailwindcss"` (not the v3 `@tailwind` directives)
- CSS custom properties are defined in `globals.css` using `@theme inline` and `:root`
- Fonts: Geist Sans and Geist Mono via `next/font/google`, exposed as `--font-geist-sans` / `--font-geist-mono`

## Backend / Data
- `@supabase/supabase-js` v2 and `@supabase/ssr`. Use the SSR package for server-side client creation.

## Build tooling
- **Turbopack** enabled (configured in `next.config.ts`)
- ESLint 9 with `eslint-config-next`

## Common Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

## Code rules
- TypeScript strict; no `any`.
- Components are server components by default. Add `"use client"` only when a component needs state, effects, or browser APIs (theme editor, music player, etc.).
- Create separate Supabase clients for browser and server code using `@supabase/ssr`. Prefer server-side data access.
- Validate the logged-in user on the server with `supabase.auth.getUser()`.
- Keep Supabase queries in a dedicated folder (`lib/supabase/`), not scattered through components.
- Mobile-first responsive design.

## Environment variables
Stored in `.env.local` (never committed, never read or printed by agents):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Do not use the old `NEXT_PUBLIC_SUPABASE_ANON_KEY` name. Never use or reference a service_role or secret key in client code.

## Database and security
- Enable Row Level Security (RLS) on every table.
- Users may only edit their own rows (profile, theme, comments they wrote).
- Public profile data is readable by anyone.
- Schema changes go in SQL migration files saved in the repo.

## Profile customization safety
Custom CSS is the riskiest feature, so these rules are mandatory:
- Scope all custom CSS to the profile container (e.g. `.profile-root`).
- Sanitize before saving and before rendering:
  - No `@import`
  - No external `url()` (only approved image sources)
  - No `position: fixed` or anything that escapes the profile container
  - No `expression()`, `javascript:`, or behavior properties
- Prefer structured theme settings (colors, fonts, backgrounds, layout stored as JSON) over raw CSS. Raw CSS is an optional "advanced" mode.
- Never render user-supplied HTML or scripts.

## Music
- Music is embedded from third-party providers (Spotify, SoundCloud, YouTube) via their official embed players.
- Do not host or upload copyrighted audio.
- Validate and whitelist embed URLs before saving them.
