-- ══════════════════════════════════════════════════════════════
-- FIX DATABASE — Elite Code School
-- Execute dans Supabase SQL Editor ou psql (dans une transaction)
-- ══════════════════════════════════════════════════════════════

BEGIN;

-- ── 1. SUPPRIMER teachers (table + type enum) ────────────────
DROP TABLE IF EXISTS public.teachers CASCADE;
DROP TYPE IF EXISTS public.teacher_status;

-- ── 2. MIGRER project_status ─────────────────────────────────
-- Créer le nouveau type avec les 2 seules valeurs valides
CREATE TYPE public.project_status_new AS ENUM ('completed', 'in_progress');

-- Enlever la valeur par défaut temporairement
ALTER TABLE public.projects ALTER COLUMN status DROP DEFAULT;

-- Convertir les anciennes valeurs
ALTER TABLE public.projects
  ALTER COLUMN status TYPE public.project_status_new
  USING (
    CASE status::text
      WHEN 'done'     THEN 'completed'::public.project_status_new
      WHEN 'progress' THEN 'in_progress'::public.project_status_new
      WHEN 'planned'  THEN 'in_progress'::public.project_status_new
      ELSE                 'in_progress'::public.project_status_new
    END
  );

-- Remettre la valeur par défaut
ALTER TABLE public.projects ALTER COLUMN status SET DEFAULT 'in_progress'::public.project_status_new;

-- Supprimer l'ancien type
DROP TYPE IF EXISTS public.project_status;

-- Renommer le nouveau type
ALTER TYPE public.project_status_new RENAME TO project_status;

-- ── 3. CONTRAINTE ÂGE RG4 (7-17 ans) ────────────────────────
ALTER TABLE public.students
  ADD CONSTRAINT students_age_check
  CHECK (age >= 7 AND age <= 17);

ALTER TABLE public.inscription_requests
  ADD CONSTRAINT inscription_requests_age_check
  CHECK (age >= 7 AND age <= 17);

-- ── 4. INDEX MANQUANTS ───────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS students_slug_idx ON public.students(slug);
CREATE INDEX IF NOT EXISTS students_public_idx ON public.students(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS students_program_id_idx ON public.students(program_id);
CREATE INDEX IF NOT EXISTS inscription_requests_status_idx ON public.inscription_requests(status);
CREATE INDEX IF NOT EXISTS inscription_requests_created_at_idx ON public.inscription_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS projects_student_id_idx ON public.projects(student_id);
CREATE INDEX IF NOT EXISTS certifications_student_id_idx ON public.certifications(student_id);
CREATE INDEX IF NOT EXISTS gallery_items_student_id_idx ON public.gallery_items(student_id);

-- ── 5. VÉRIFICATION FINALE ───────────────────────────────────
-- Vérifier qu'il n'y a plus de trace de teachers
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'teachers';
-- → doit retourner 0 lignes

-- Vérifier les valeurs possibles de project_status
SELECT enum_range(NULL::project_status);
-- → doit retourner {completed,in_progress}

COMMIT;
