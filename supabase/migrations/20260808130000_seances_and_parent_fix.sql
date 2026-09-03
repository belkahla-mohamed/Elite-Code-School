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

-- Colonnes manquantes utilisées par le store
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

-- Fix parents: student_id doit être uuid (no-op si déjà uuid, migre en douceur)
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