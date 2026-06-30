begin;

-- 1. Add parent name columns to inscription_requests
alter table public.inscription_requests
  add column if not exists parent_first_name text not null default '',
  add column if not exists parent_last_name text not null default '';

-- 2. Add parent name columns to students (for auto-creating parent records)
alter table public.students
  add column if not exists parent_first_name text not null default '',
  add column if not exists parent_last_name text not null default '';

-- 3. Create parents table
create table if not exists public.parents (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text not null,
  last_name text not null,
  phone text not null default '',
  secret_hash text not null,
  student_id text not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists parents_email_lower_key on public.parents(lower(email));
create index if not exists parents_student_id_idx on public.parents(student_id);

alter table public.parents enable row level security;

-- Admin service role can do everything (our backend uses service_role key)
-- Anon can read their own parent record during login (handled server-side)
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.parents to service_role;

-- For the login flow: anon needs to be able to select parents by email
drop policy if exists "Authenticated users can read parents" on public.parents;
create policy "Authenticated users can read parents"
on public.parents
for select
using (true);

drop policy if exists "Service role can insert parents" on public.parents;
create policy "Service role can insert parents"
on public.parents
for insert
with check (true);

comment on table public.parents is 'Parent accounts auto-created when an inscription is accepted. Used for parent login.';

commit;
