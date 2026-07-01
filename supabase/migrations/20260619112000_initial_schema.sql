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
  icon text not null default '🧩',
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

-- DEPRECATED: teachers table removed per RG — only 3 actors: Visiteur, Administrateur, Parent
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
  emoji text not null default '💼',
  gradient text not null default 'linear-gradient(135deg,#12AEEA,#75D64B)',
  created_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  mention text not null default 'Validé',
  date_label text not null,
  emoji text not null default '🏅',
  gradient text not null default 'linear-gradient(135deg,#FFB31A,#FF6D8E)',
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  label text not null,
  emoji text not null default '📸',
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
