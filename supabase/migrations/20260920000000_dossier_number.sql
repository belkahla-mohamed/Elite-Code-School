ALTER TABLE public.students ADD COLUMN IF NOT EXISTS dossier_number text;

COMMENT ON COLUMN public.students.dossier_number IS 'Structured matricule number (ECS-YYYYMM-XXXX)';
