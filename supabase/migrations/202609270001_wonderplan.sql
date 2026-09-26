-- WonderPlan MVP: family-owned data plus source-verified activity inventory.
create extension if not exists postgis with schema extensions;

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null unique references auth.users(id) on delete cascade,
  city text not null default 'Islamabad',
  country_code text not null default 'PK',
  radius_km integer not null default 30 check (radius_km between 1 and 500),
  budget_label text not null default 'PKR 5,000',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 40),
  age smallint check (age between 0 and 18),
  interests text[] not null default '{}',
  goals text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists children_family_id_idx on public.children(family_id);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  summary text,
  activity_type text not null,
  tags text[] not null default '{}',
  min_age smallint check (min_age between 0 and 18),
  max_age smallint check (max_age between 0 and 18),
  start_at timestamptz,
  end_at timestamptz,
  price_min numeric(12,2),
  price_max numeric(12,2),
  currency text not null default 'PKR',
  venue_name text,
  city text not null default 'Islamabad',
  location extensions.geography(Point, 4326),
  source_name text not null,
  source_url text not null,
  source_type text not null default 'ORGANIZER',
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'DISABLED')),
  verification_status text not null default 'UNVERIFIED' check (verification_status in ('VERIFIED', 'LIKELY_VALID', 'UNVERIFIED', 'EXPIRED', 'CANCELLED')),
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (max_age is null or min_age is null or max_age >= min_age),
  check (end_at is null or start_at is null or end_at >= start_at)
);
create index if not exists activities_city_idx on public.activities(city);
create index if not exists activities_status_verification_idx on public.activities(status, verification_status);
create index if not exists activities_location_gix on public.activities using gist(location);
create index if not exists activities_tags_gin on public.activities using gin(tags);
create unique index if not exists activities_dedupe_idx on public.activities (lower(title), lower(coalesce(venue_name, '')), coalesce(start_at, 'infinity'::timestamptz));

create table if not exists public.saved_activities (
  child_id uuid not null references public.children(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (child_id, activity_id)
);

create table if not exists public.activity_feedback (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  feedback text not null check (feedback in ('INTERESTED', 'NOT_INTERESTED', 'COMPLETED')),
  reason text,
  created_at timestamptz not null default now(),
  unique (child_id, activity_id, feedback)
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  score numeric(5,2) not null check (score between 0 and 100),
  score_factors jsonb not null default '{}',
  explanation text not null,
  generated_at timestamptz not null default now(),
  expires_at timestamptz,
  unique (child_id, activity_id)
);

create or replace function public.owns_child(target_child uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.children c
    join public.families f on f.id = c.family_id
    where c.id = target_child and f.parent_id = (select auth.uid())
  );
$$;

alter table public.families enable row level security;
alter table public.children enable row level security;
alter table public.activities enable row level security;
alter table public.saved_activities enable row level security;
alter table public.activity_feedback enable row level security;
alter table public.recommendations enable row level security;

create policy "Parents read their family" on public.families for select to authenticated using (parent_id = (select auth.uid()));
create policy "Parents create their family" on public.families for insert to authenticated with check (parent_id = (select auth.uid()));
create policy "Parents update their family" on public.families for update to authenticated using (parent_id = (select auth.uid())) with check (parent_id = (select auth.uid()));

create policy "Parents manage their children" on public.children for all to authenticated using (
  exists (select 1 from public.families f where f.id = family_id and f.parent_id = (select auth.uid()))
) with check (
  exists (select 1 from public.families f where f.id = family_id and f.parent_id = (select auth.uid()))
);

create policy "Anyone can read verified published activities" on public.activities for select to anon, authenticated using (
  status = 'PUBLISHED' and verification_status = 'VERIFIED' and (end_at is null or end_at >= now())
);
create policy "Parents manage their saved activities" on public.saved_activities for all to authenticated
  using (public.owns_child(child_id)) with check (public.owns_child(child_id));
create policy "Parents manage their activity feedback" on public.activity_feedback for all to authenticated
  using (public.owns_child(child_id)) with check (public.owns_child(child_id));
create policy "Parents read their recommendations" on public.recommendations for select to authenticated
  using (public.owns_child(child_id));

grant select on public.activities to anon, authenticated;
grant select, insert, update, delete on public.families, public.children, public.saved_activities, public.activity_feedback, public.recommendations to authenticated;
