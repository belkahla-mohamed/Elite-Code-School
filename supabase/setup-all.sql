
-- ===== 20260619112000_initial_schema.sql =====

begin;

create extension if not exists pgcrypto;

create table if not exists public.programs (
  id text primary key,
  title text not null,
  age_range text not null,
  level text not null check (level in ('debutant', 'intermediaire', 'avance')),
  description text not null,
  tools text[] not null default '{}',
  price_monthly integer,
  icon text not null default 'ðŸ§©',
  color text not null default 'accent',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inscription_requests (
  id uuid primary key default gen_random_uuid(),
  student_first_name text not null,
  student_last_name text not null,
  age integer not null check (age between 7 and 17),
  school_level text,
  program_id text not null references public.programs(id),
  parent_phone text not null,
  parent_email text not null,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'refused')),
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  first_name text not null,
  last_name text not null,
  age integer not null check (age between 7 and 17),
  avatar text not null,
  avatar_gradient text not null default 'linear-gradient(135deg,#12AEEA,#75D64B)',
  program_id text not null references public.programs(id),
  level_label text not null,
  join_date_label text not null,
  hours integer not null default 0 check (hours >= 0),
  is_public boolean not null default true,
  parent_email text not null,
  parent_secret_hash text not null,
  created_at timestamptz not null default now()
);

-- DEPRECATED: teachers table removed per RG â€” only 3 actors: Visiteur, Administrateur, Parent
-- The following table is intentionally omitted:
--   create table if not exists public.teachers ( ... );

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  status text not null default 'in_progress' check (status in ('completed', 'in_progress')),
  progress integer not null default 0 check (progress between 0 and 100),
  date_label text not null,
  emoji text not null default 'ðŸ’¼',
  gradient text not null default 'linear-gradient(135deg,#12AEEA,#75D64B)',
  created_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  mention text not null default 'ValidÃ©',
  date_label text not null,
  emoji text not null default 'ðŸ…',
  gradient text not null default 'linear-gradient(135deg,#FFB31A,#FF6D8E)',
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  label text not null,
  emoji text not null default 'ðŸ“¸',
  gradient text not null default 'linear-gradient(135deg,#12AEEA,#61D7F7)',
  created_at timestamptz not null default now()
);

create index if not exists inscription_requests_status_idx on public.inscription_requests(status);
create index if not exists inscription_requests_created_at_idx on public.inscription_requests(created_at desc);
create index if not exists students_slug_idx on public.students(slug);
create index if not exists students_program_id_idx on public.students(program_id);
create index if not exists students_public_idx on public.students(is_public) where is_public = true;
create index if not exists projects_student_id_idx on public.projects(student_id);
create index if not exists certifications_student_id_idx on public.certifications(student_id);
create index if not exists gallery_items_student_id_idx on public.gallery_items(student_id);

alter table public.programs enable row level security;
alter table public.inscription_requests enable row level security;
alter table public.students enable row level security;
alter table public.gallery_items enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.gallery_items enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.programs to anon, authenticated;
grant insert on public.inscription_requests to anon, authenticated;
grant select on public.students to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.certifications to anon, authenticated;
grant select on public.gallery_items to anon, authenticated;

drop policy if exists "Public can read programs" on public.programs;
create policy "Public can read programs"
on public.programs
for select
using (true);

drop policy if exists "Public can create inscription requests" on public.inscription_requests;
create policy "Public can create inscription requests"
on public.inscription_requests
for insert
with check (true);

drop policy if exists "Public can read public students" on public.students;
create policy "Public can read public students"
on public.students
for select
using (is_public = true);

drop policy if exists "Public can read projects of public students" on public.projects;
create policy "Public can read projects of public students"
on public.projects
for select
using (
  exists (
    select 1
    from public.students s
    where s.id = student_id
      and s.is_public = true
  )
);

drop policy if exists "Public can read certifications of public students" on public.certifications;
create policy "Public can read certifications of public students"
on public.certifications
for select
using (
  exists (
    select 1
    from public.students s
    where s.id = student_id
      and s.is_public = true
  )
);

drop policy if exists "Public can read gallery of public students" on public.gallery_items;
create policy "Public can read gallery of public students"
on public.gallery_items
for select
using (
  exists (
    select 1
    from public.students s
    where s.id = student_id
      and s.is_public = true
  )
);

comment on table public.programs is 'Public course catalog for Elite Code School.';
comment on table public.inscription_requests is 'Public enrollment requests. Accepting a request is handled server-side by admin.';
comment on table public.students is 'Student records and parent access secret hash.';
comment on table public.projects is 'Portfolio projects attached to students.';
comment on table public.certifications is 'Student certificates attached to portfolios.';
comment on table public.gallery_items is 'Student portfolio gallery items.';

commit;


-- ===== 20260629100000_admin_users.sql =====

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


-- ===== 20260630000000_notifications.sql =====

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


-- ===== 20260630100000_programs_fields.sql =====

-- Run this in Supabase Dashboard â†’ SQL Editor

begin;

-- Remove old icon column
alter table public.programs drop column if exists icon;

-- Add new columns (existing rows get empty strings)
alter table public.programs add column if not exists image text not null default '';
alter table public.programs add column if not exists duration text not null default '';
alter table public.programs add column if not exists objectives text not null default '';
alter table public.programs add column if not exists prerequisites text not null default '';
alter table public.programs add column if not exists schedule text not null default '';

commit;


-- ===== 20260630110000_categories.sql =====

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT 'sky',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add category_id to programs
ALTER TABLE programs ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_programs_category_id ON programs(category_id);


-- ===== 20260630220000_parents_table.sql =====

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
  student_id uuid not null references public.students(id) on delete cascade,
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


-- ===== 20260701000001_cleanup_actors_and_constraints.sql =====

-- Migration: Cleanup actors, constraints, and enums
-- Removes teachers table, migrates project_status, enforces RG4 age constraint
-- Only 3 actors remain: Visiteur, Administrateur, Parent

begin;

-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- 1. DROP teachers table and its enum
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

drop table if exists public.teachers cascade;
drop type if exists public.teacher_status;

-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- 2. MIGRATE project_status enum (drop old, create new)
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

-- Create new enum with only the two valid states
create type public.project_status_new as enum ('completed', 'in_progress');

-- The inline text check constraint on status blocks the column type change
-- (Postgres would try to re-evaluate it against the new enum type).
-- Drop it, migrate the column, then re-add a matching check on the enum.
alter table public.projects
  drop constraint if exists projects_status_check;

-- Migrate existing values:
--   'done'     â†’ 'completed'
--   'progress' â†’ 'in_progress'
--   'planned'  â†’ 'in_progress'
--   any other  â†’ 'in_progress' (safe fallback)
alter table public.projects
  alter column status drop default;

alter table public.projects
  alter column status type public.project_status_new
  using (
    case
      when status::text = 'done'     then 'completed'::public.project_status_new
      when status::text = 'progress' then 'in_progress'::public.project_status_new
      when status::text = 'planned'  then 'in_progress'::public.project_status_new
      else                                'in_progress'::public.project_status_new
    end
  );

alter table public.projects
  alter column status set default 'in_progress'::public.project_status_new;

alter table public.projects
  add constraint projects_status_check
  check (status in ('completed', 'in_progress'));

-- Drop old enum
drop type if exists public.project_status;

-- Rename new enum to original name
alter type public.project_status_new rename to project_status;

-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- 3. ENFORCE RG4: Age constraint (7-17)
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

alter table public.students
  drop constraint if exists students_age_check;
alter table public.students
  add constraint students_age_check
  check (age >= 7 and age <= 17);

alter table public.inscription_requests
  drop constraint if exists inscription_requests_age_check;
alter table public.inscription_requests
  add constraint inscription_requests_age_check
  check (age >= 7 and age <= 17);

-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- 4. ADD MISSING INDEXES
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

-- Student slug lookup (portfolio, auth)
create unique index if not exists students_slug_idx on public.students(slug);

-- Public portfolio filtering
create index if not exists students_public_idx on public.students(is_public) where is_public = true;

-- Inscription request status for admin dashboard
create index if not exists inscription_requests_status_idx on public.inscription_requests(status);
create index if not exists inscription_requests_created_at_idx on public.inscription_requests(created_at desc);

-- FK lookup indexes
create index if not exists projects_student_id_idx on public.projects(student_id);
create index if not exists certifications_student_id_idx on public.certifications(student_id);
create index if not exists gallery_items_student_id_idx on public.gallery_items(student_id);
create index if not exists students_program_id_idx on public.students(program_id);

-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- 5. ADD parent_first_name/parent_last_name to inscription_requests
--    (already exist per your schema, but ensure NOT NULL)
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

-- These columns already exist in your schema; this is a no-op guard
-- If they were missing, uncomment:
-- alter table public.inscription_requests
--   add column if not exists parent_first_name text not null default '',
--   add column if not exists parent_last_name  text not null default '',
--   add column if not exists admin_notes        text,
--   add column if not exists rejection_message  text;
--
-- alter table public.students
--   add column if not exists parent_first_name text not null default '',
--   add column if not exists parent_last_name  text not null default '';

commit;


-- ===== 20260702000000_app_settings.sql =====

CREATE TABLE IF NOT EXISTS public.app_settings (
  id BIGINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  auto_accept_inscriptions BOOLEAN NOT NULL DEFAULT false,
  email_validation BOOLEAN NOT NULL DEFAULT true,
  public_portfolios_default BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  session_duration_hours INTEGER NOT NULL DEFAULT 8,
  min_password_length INTEGER NOT NULL DEFAULT 6,
  contact_email TEXT NOT NULL DEFAULT 'contact@elitecode.ma',
  email_from TEXT NOT NULL DEFAULT 'Elite Code School <onboarding@resend.dev>',
  admin_email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on app_settings"
  ON public.app_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO public.app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;


-- ===== 20260808120000_community_requests.sql =====

begin;

-- Abonnements entre Ã©lÃ¨ves (CommunautÃ©)
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  target_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (student_id, target_id)
);

create index if not exists follows_student_idx on public.follows (student_id);
create index if not exists follows_target_idx on public.follows (target_id);

-- Demandes des Ã©lÃ¨ves (certificats & heures de code) validÃ©es par l'admin
create table if not exists public.student_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  type text not null check (type in ('certificate', 'hours')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'refused')),
  title text not null,
  description text not null default '',
  hours integer check (hours >= 0),
  certificate_title text,
  certificate_mention text,
  certificate_date_label text,
  certificate_emoji text,
  certificate_gradient text,
  admin_notes text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists student_requests_student_idx on public.student_requests (student_id, created_at desc);
create index if not exists student_requests_status_idx on public.student_requests (status);

-- Messages des familles vers l'administration
create table if not exists public.student_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  message text not null,
  reply text,
  created_at timestamptz not null default now(),
  replied_at timestamptz
);

create index if not exists student_messages_student_idx on public.student_messages (student_id, created_at desc);

-- Alertes & annonces pour les familles (student_id = 'all' pour une diffusion gÃ©nÃ©rale)
create table if not exists public.student_alerts (
  id uuid primary key default gen_random_uuid(),
  student_id text not null default 'all',
  title text not null,
  description text not null default '',
  emoji text not null default 'ðŸ“£',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists student_alerts_student_idx on public.student_alerts (student_id, created_at desc);

commit;


-- ===== 20260808130000_seances_and_parent_fix.sql =====

begin;

-- Planning des AclA"ves : tables manquantes (le store interroge `seances` en mode Supabase)
create table if not exists public.seances (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  program_id text not null references public.programs(id),
  title text not null,
  date text not null,
  start_time text not null,
  end_time text not null,
  status text not null default 'scheduled' check (status in ('completed', 'absent', 'scheduled', 'cancelled')),
  topic text not null default '',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists seances_student_idx on public.seances (student_id, date);

-- Colonnes manquantes utilisÃ©es par le store
alter table public.projects add column if not exists cover_image text;
alter table public.gallery_items add column if not exists image_url text;
alter table public.certifications add column if not exists image_url text;

alter table public.seances enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.seances to anon, authenticated;

drop policy if exists "Public can read seances of public students" on public.seances;
create policy "Public can read seances of public students"
on public.seances
for select
using (
  exists (
    select 1
    from public.students s
    where s.id = student_id
      and s.is_public = true
  )
);

-- Fix parents: student_id doit Ãªtre uuid (no-op si dÃ©jÃ  uuid, migre en douceur)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'parents' AND column_name = 'student_id'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE public.parents ADD COLUMN student_id_new uuid;
    UPDATE public.parents SET student_id_new = student_id::uuid;
    ALTER TABLE public.parents DROP CONSTRAINT IF EXISTS parents_student_id_fkey;
    ALTER TABLE public.parents DROP COLUMN student_id;
    ALTER TABLE public.parents RENAME COLUMN student_id_new TO student_id;
  END IF;
END $$;

commit;
