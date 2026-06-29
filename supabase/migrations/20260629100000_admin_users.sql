begin;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text not null,
  last_name text not null,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login timestamptz
);

create unique index if not exists admin_users_email_lower_idx on public.admin_users(lower(email));

alter table public.admin_users enable row level security;

grant usage on schema public to anon, authenticated;
grant all on public.admin_users to anon, authenticated;

drop policy if exists "Admin users can read admin_users" on public.admin_users;
create policy "Admin users can read admin_users"
on public.admin_users
for select
using (true);

drop policy if exists "Admin users can insert admin_users" on public.admin_users;
create policy "Admin users can insert admin_users"
on public.admin_users
for insert
with check (true);

drop policy if exists "Admin users can update admin_users" on public.admin_users;
create policy "Admin users can update admin_users"
on public.admin_users
for update
using (true);

drop policy if exists "Admin users can delete admin_users" on public.admin_users;
create policy "Admin users can delete admin_users"
on public.admin_users
for delete
using (true);

comment on table public.admin_users is 'Admin user accounts for the dashboard. Managed server-side only.';

commit;
