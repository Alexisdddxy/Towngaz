create table if not exists public.intern_profiles (
  id text primary key,
  name text not null,
  study text not null default '',
  desired_teams text[] not null default '{}',
  desired_themes text[] not null default '{}',
  skills text[] not null default '{}',
  goals text not null default '',
  availability text not null default '4 Fridays',
  created_at timestamptz not null default now()
);

create table if not exists public.department_needs (
  id text primary key,
  department text not null default '',
  sponsor text not null default '',
  title text not null,
  themes text[] not null default '{}',
  skills text[] not null default '{}',
  output text not null default '',
  value text not null default '',
  mentor_time text not null default '30 minutes per week',
  confidentiality text not null default 'Low',
  created_at timestamptz not null default now()
);

alter table public.intern_profiles enable row level security;
alter table public.department_needs enable row level security;

drop policy if exists "Public can read intern profiles" on public.intern_profiles;
drop policy if exists "Public can insert intern profiles" on public.intern_profiles;
drop policy if exists "Public can read department needs" on public.department_needs;
drop policy if exists "Public can insert department needs" on public.department_needs;

create policy "Public can read intern profiles"
on public.intern_profiles for select
to anon
using (true);

create policy "Public can insert intern profiles"
on public.intern_profiles for insert
to anon
with check (true);

create policy "Public can read department needs"
on public.department_needs for select
to anon
using (true);

create policy "Public can insert department needs"
on public.department_needs for insert
to anon
with check (true);
