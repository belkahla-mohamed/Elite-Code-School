begin;

-- Abonnements entre élèves (Communauté)
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  target_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (student_id, target_id)
);

create index if not exists follows_student_idx on public.follows (student_id);
create index if not exists follows_target_idx on public.follows (target_id);

-- Demandes des élèves (certificats & heures de code) validées par l'admin
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

-- Alertes & annonces pour les familles (student_id = 'all' pour une diffusion générale)
create table if not exists public.student_alerts (
  id uuid primary key default gen_random_uuid(),
  student_id text not null default 'all',
  title text not null,
  description text not null default '',
  emoji text not null default '📣',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists student_alerts_student_idx on public.student_alerts (student_id, created_at desc);

commit;
