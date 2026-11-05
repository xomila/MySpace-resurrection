# Tech Stack

## Core
- **Next.js 16** (App Router) — this is a newer version with breaking changes. Always read `node_modules/next/dist/docs/` before writing Next.js-specific code; do not rely on training-data knowledge of earlier Next.js versions.
- **React 19**
- **TypeScript 5**

## Styling
- **Tailwind CSS v4** — configured via `@tailwindcss/turbopack` loader; imported with `@import "tailwindcss"` (not the v3 `@tailwind` directives)
- CSS custom properties are defined in `globals.css` using `@theme inline` and `:root`
- Fonts: Geist Sans and Geist Mono via `next/font/google`, exposed as CSS variables `--font-geist-sans` / `--font-geist-mono`

## Backend / Data
- **Supabase** (`@supabase/supabase-js` v2, `@supabase/ssr`) — use the SSR package for server-side Supabase client creation

## Build tooling
- **Turbopack** is enabled (configured in `next.config.ts`) — the dev server uses it by default
- ESLint 9 with `eslint-config-next`

## Common Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

## Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
