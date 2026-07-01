-- Migration: Cleanup actors, constraints, and enums
-- Removes teachers table, migrates project_status, enforces RG4 age constraint
-- Only 3 actors remain: Visiteur, Administrateur, Parent

begin;

-- ══════════════════════════════════════════════════════════════
-- 1. DROP teachers table and its enum
-- ══════════════════════════════════════════════════════════════

drop table if exists public.teachers cascade;
drop type if exists public.teacher_status;

-- ══════════════════════════════════════════════════════════════
-- 2. MIGRATE project_status enum (drop old, create new)
-- ══════════════════════════════════════════════════════════════

-- Create new enum with only the two valid states
create type public.project_status_new as enum ('completed', 'in_progress');

-- Migrate existing values:
--   'done'     → 'completed'
--   'progress' → 'in_progress'
--   'planned'  → 'in_progress'
--   any other  → 'in_progress' (safe fallback)
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

-- Drop old enum
drop type if exists public.project_status;

-- Rename new enum to original name
alter type public.project_status_new rename to project_status;

-- ══════════════════════════════════════════════════════════════
-- 3. ENFORCE RG4: Age constraint (7-17)
-- ══════════════════════════════════════════════════════════════

alter table public.students
  add constraint students_age_check
  check (age >= 7 and age <= 17);

alter table public.inscription_requests
  add constraint inscription_requests_age_check
  check (age >= 7 and age <= 17);

-- ══════════════════════════════════════════════════════════════
-- 4. ADD MISSING INDEXES
-- ══════════════════════════════════════════════════════════════

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

-- ══════════════════════════════════════════════════════════════
-- 5. ADD parent_first_name/parent_last_name to inscription_requests
--    (already exist per your schema, but ensure NOT NULL)
-- ══════════════════════════════════════════════════════════════

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
