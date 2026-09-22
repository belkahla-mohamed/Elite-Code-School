-- Project demo links (portfolio project details)
alter table public.projects add column if not exists demo_url text;

-- Blog view counters
create table if not exists public.blog_views (
  slug text primary key,
  views integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.blog_views enable row level security;

drop policy if exists "Public can read blog views" on public.blog_views;
create policy "Public can read blog views"
on public.blog_views
for select
using (true);

grant select on public.blog_views to anon, authenticated;
