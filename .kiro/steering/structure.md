# Project Structure

```
myspace-resurrection/
├── app/                    # Next.js App Router root
│   ├── layout.tsx          # Root layout (fonts, metadata, body wrapper)
│   ├── page.tsx            # Home page (currently starter placeholder)
│   └── globals.css         # Global styles + Tailwind import + CSS variables
├── public/                 # Static assets served at /
├── .kiro/
│   └── steering/           # Kiro AI steering documents
├── .env.local              # Local env vars (not committed)
├── next.config.ts          # Next.js config (Turbopack, experimental flags)
├── tsconfig.json           # TypeScript config
└── package.json
```

## Conventions

- **App Router only** — no `pages/` directory; all routes live under `app/`
- Pages and layouts are `.tsx` files; use React Server Components by default, add `"use client"` only when needed
- Route segments follow the Next.js App Router folder convention: `app/[segment]/page.tsx`
- Shared UI components should go in `components/` (not yet created)
- Supabase client utilities should live in `lib/supabase/` (not yet created)
- Tailwind utility classes are preferred over custom CSS; extend the theme via `@theme` in `globals.css`
- The `RootLayout` uses a `LayoutProps<"/">` generic — follow this pattern for typed layout props
