# Product

**myspace-resurrection** is a MySpace revival website with deep profile customization as its core feature. The goal is to mix the iconic 2000s UI style with modern elements. The app is in early bootstrapping stage; `app/page.tsx` still contains the default Next.js starter content.

## Core idea
Every user gets a personalised corner of the internet. Focus is on profile customization:
- Pixel art avatar creator
- Change everything on a profile, or pick from ready-made templates and widgets
- Music-centered social media: opening a profile can play up to 10 songs the owner chose, like a little personal radio
- Keep the comment wall and friend list

## Art direction
Modern, with touches of old MySpace. Palette for now: dark blue, violet, black and yellow (subject to change).

References:
- Old personalised MySpace profiles
- Frutiger Aero and Windows 7 aesthetic
- Pixel art avatars in the style of the artist Ptite Soeur
- PS2 advertisement material

## Key integrations
- **Supabase**: auth, database and storage (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` required in `.env.local`)
- **Music embeds**: Spotify, SoundCloud and YouTube official embed players

## Out of scope for now
Native mobile app, direct messaging, ads, audio uploads.
