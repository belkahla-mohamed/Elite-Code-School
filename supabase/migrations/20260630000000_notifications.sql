begin;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('student', 'project', 'certification', 'request', 'contact')),
  title text not null,
  description text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_read_idx on public.notifications(read);
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);

alter table public.notifications enable row level security;

grant all on public.notifications to anon, authenticated;

drop policy if exists "Admin can read notifications" on public.notifications;
create policy "Admin can read notifications"
on public.notifications for select using (true);

drop policy if exists "Admin can insert notifications" on public.notifications;
create policy "Admin can insert notifications"
on public.notifications for insert with check (true);

drop policy if exists "Admin can update notifications" on public.notifications;
create policy "Admin can update notifications"
on public.notifications for update using (true);

comment on table public.notifications is 'In-app admin notifications generated from activity log.';

commit;
