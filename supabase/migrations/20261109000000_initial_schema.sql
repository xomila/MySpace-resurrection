-- Initial schema: profiles, themes, comments, friendships, playlist_tracks.
-- DRAFT: review before applying. Row Level Security is enabled on every table.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- One row per auth user. Created by the app during onboarding.
-- ---------------------------------------------------------------------------

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  username      text not null unique
                  check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name  text check (char_length(display_name) <= 50),
  bio           text check (char_length(bio) <= 2000),
  mood          text check (char_length(mood) <= 60),
  -- Pixel art avatar as structured data (e.g. grid size + palette + pixels).
  avatar_pixels jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Profiles are readable by anyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can delete their own profile"
  on public.profiles for delete
  to authenticated
  using ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- themes
-- One row per profile. Structured JSON settings are the primary format.
-- Raw CSS is an optional "advanced" mode.
-- ---------------------------------------------------------------------------

create table public.themes (
  user_id     uuid primary key references public.profiles (id) on delete cascade,
  template_id text,
  -- Colors, fonts, backgrounds, layout, widgets. Validated in the app.
  settings    jsonb not null default '{}'::jsonb,
  custom_css  text
                check (char_length(custom_css) <= 20000)
                -- Database backstop only. The app MUST still sanitize and scope
                -- CSS to .profile-root before saving and before rendering.
                check (
                  custom_css is null or custom_css !~* (
                    '@import|url\s*\(|expression\s*\(|javascript:|behaviou?r\s*:'
                    || '|-moz-binding|position\s*:\s*fixed|</?style|<script'
                  )
                ),
  updated_at  timestamptz not null default now()
);

create trigger themes_set_updated_at
  before update on public.themes
  for each row execute function public.set_updated_at();

alter table public.themes enable row level security;

create policy "Themes are readable by anyone"
  on public.themes for select
  using (true);

create policy "Users can insert their own theme"
  on public.themes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own theme"
  on public.themes for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own theme"
  on public.themes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- comments (comment wall)
-- profile_id = wall owner, author_id = who wrote it.
-- ---------------------------------------------------------------------------

create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index comments_profile_id_created_at_idx
  on public.comments (profile_id, created_at desc);
create index comments_author_id_idx
  on public.comments (author_id);

create trigger comments_set_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();

alter table public.comments enable row level security;

create policy "Comments are readable by anyone"
  on public.comments for select
  using (true);

create policy "Users can post comments as themselves"
  on public.comments for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

create policy "Authors can edit their own comments"
  on public.comments for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

-- Authors can delete their comments. Wall owners can also remove comments
-- from their own wall (moderation). Remove the second clause if you do not
-- want that.
create policy "Authors and wall owners can delete comments"
  on public.comments for delete
  to authenticated
  using (
    (select auth.uid()) = author_id
    or (select auth.uid()) = profile_id
  );

-- Only the body may change on update, never who wrote it or where.
revoke update on public.comments from authenticated, anon;
grant update (body) on public.comments to authenticated;

-- ---------------------------------------------------------------------------
-- friendships
-- One row per pair. requester sends, addressee accepts.
-- ---------------------------------------------------------------------------

create table public.friendships (
  id           uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status       text not null default 'pending'
                 check (status in ('pending', 'accepted')),
  created_at   timestamptz not null default now(),
  check (requester_id <> addressee_id)
);

-- Only one friendship row per pair, regardless of direction.
create unique index friendships_pair_unique_idx
  on public.friendships (
    least(requester_id, addressee_id),
    greatest(requester_id, addressee_id)
  );
create index friendships_addressee_id_idx
  on public.friendships (addressee_id);
create index friendships_requester_id_idx
  on public.friendships (requester_id);

alter table public.friendships enable row level security;

-- Accepted friendships form the public friend list. Pending requests are
-- visible only to the two people involved.
create policy "Accepted friendships are public, pending are private"
  on public.friendships for select
  using (
    status = 'accepted'
    or (select auth.uid()) in (requester_id, addressee_id)
  );

create policy "Users can send friend requests as themselves"
  on public.friendships for insert
  to authenticated
  with check (
    (select auth.uid()) = requester_id
    and status = 'pending'
  );

-- Only the addressee can accept, and only the status column can change.
create policy "Addressee can accept a request"
  on public.friendships for update
  to authenticated
  using ((select auth.uid()) = addressee_id)
  with check ((select auth.uid()) = addressee_id and status = 'accepted');

revoke update on public.friendships from authenticated, anon;
grant update (status) on public.friendships to authenticated;

create policy "Either party can remove a friendship"
  on public.friendships for delete
  to authenticated
  using ((select auth.uid()) in (requester_id, addressee_id));

-- ---------------------------------------------------------------------------
-- playlist_tracks (profile radio, up to 10 songs)
-- Embeds only. No audio is hosted.
-- ---------------------------------------------------------------------------

create table public.playlist_tracks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  -- Position 1..10 enforces the 10-song limit per profile.
  position   smallint not null check (position between 1 and 10),
  provider   text not null check (provider in ('spotify', 'soundcloud', 'youtube')),
  -- Database backstop for the allowlist. The app must validate before saving.
  embed_url  text not null
               check (
                 char_length(embed_url) <= 500
                 and embed_url ~* (
                   '^https://('
                   || 'open\.spotify\.com/'
                   || '|w\.soundcloud\.com/player/'
                   || '|soundcloud\.com/'
                   || '|www\.youtube\.com/'
                   || '|www\.youtube-nocookie\.com/'
                   || '|youtu\.be/'
                   || ')'
                 )
               ),
  title      text check (char_length(title) <= 120),
  artist     text check (char_length(artist) <= 120),
  created_at timestamptz not null default now(),
  unique (user_id, position) deferrable initially deferred
);

alter table public.playlist_tracks enable row level security;

create policy "Playlists are readable by anyone"
  on public.playlist_tracks for select
  using (true);

create policy "Users can add tracks to their own playlist"
  on public.playlist_tracks for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can edit their own tracks"
  on public.playlist_tracks for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own tracks"
  on public.playlist_tracks for delete
  to authenticated
  using ((select auth.uid()) = user_id);
