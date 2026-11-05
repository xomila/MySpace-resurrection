# Product

**myspace-resurrection** is a Next.js web application that is currently in early bootstrapping stage. The project name implies a social networking or profile-page concept inspired by the original MySpace.

The app is not yet feature-built — `app/page.tsx` still contains the default Next.js starter content. Supabase is wired in as the backend (auth + database), suggesting user accounts and persistent data are core to the product.

## Key integrations
- **Supabase** — backend-as-a-service for authentication and data storage (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are required in `.env.local`)
