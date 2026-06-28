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
  avatar_gradient text not null default 'linear-gradient(135deg,#4f46e5,#06b6d4)',
  program_id text not null references public.programs(id),
  level_label text not null,
  join_date_label text not null,
  hours integer not null default 0 check (hours >= 0),
  is_public boolean not null default true,
  parent_email text not null,
  parent_secret_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  status text not null default 'progress' check (status in ('done', 'progress', 'planned')),
  progress integer not null default 0 check (progress between 0 and 100),
  date_label text not null,
  emoji text not null default '💼',
  gradient text not null default 'linear-gradient(135deg,#4f46e5,#818cf8)',
  created_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  mention text not null default 'Validé',
  date_label text not null,
  emoji text not null default '🏅',
  gradient text not null default 'linear-gradient(135deg,#f59e0b,#f97316)',
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  label text not null,
  emoji text not null default '📸',
  gradient text not null default 'linear-gradient(135deg,#06b6d4,#0ea5e9)',
  created_at timestamptz not null default now()
);

create index if not exists inscription_requests_status_idx on public.inscription_requests(status);
create index if not exists students_slug_idx on public.students(slug);
create index if not exists students_public_idx on public.students(is_public) where is_public = true;
create index if not exists projects_student_id_idx on public.projects(student_id);
create index if not exists certifications_student_id_idx on public.certifications(student_id);
create index if not exists gallery_items_student_id_idx on public.gallery_items(student_id);

alter table public.programs enable row level security;
alter table public.inscription_requests enable row level security;
alter table public.students enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.gallery_items enable row level security;

drop policy if exists "Public can read programs" on public.programs;
create policy "Public can read programs" on public.programs for select using (true);

drop policy if exists "Public can create inscription requests" on public.inscription_requests;
create policy "Public can create inscription requests" on public.inscription_requests for insert with check (true);

drop policy if exists "Public can read public students" on public.students;
create policy "Public can read public students" on public.students for select using (is_public = true);

drop policy if exists "Public can read projects of public students" on public.projects;
create policy "Public can read projects of public students" on public.projects
for select using (exists (select 1 from public.students s where s.id = student_id and s.is_public = true));

drop policy if exists "Public can read certifications of public students" on public.certifications;
create policy "Public can read certifications of public students" on public.certifications
for select using (exists (select 1 from public.students s where s.id = student_id and s.is_public = true));

drop policy if exists "Public can read gallery of public students" on public.gallery_items;
create policy "Public can read gallery of public students" on public.gallery_items
for select using (exists (select 1 from public.students s where s.id = student_id and s.is_public = true));

insert into public.programs (id, title, age_range, level, description, tools, price_monthly, icon, color, sort_order)
values
  ('scratch-creativite', 'Scratch & Créativité', '7–10 ans', 'debutant', 'Jeux, histoires animées et premières notions d''algorithmique avec Scratch et Micro:bit.', array['Scratch', 'Micro:bit'], 650, '🧩', 'accent', 1),
  ('robotique-mbot', 'Robotique mBot', '10–14 ans', 'intermediaire', 'Capteurs, moteurs, logique robotique et préparation aux compétitions éducatives.', array['mBot', 'Arduino', 'Thymio'], 750, '🤖', 'cyan', 2),
  ('arduino-iot', 'Arduino & IoT', '11–15 ans', 'intermediaire', 'Électronique, objets connectés, Raspberry Pi et prototypes intelligents.', array['Arduino', 'Raspberry Pi', 'Dadabit AI'], 850, '💡', 'amber', 3),
  ('python-data', 'Python & Data', '12–16 ans', 'avance', 'Python moderne, données, visualisation et automatisation utile pour les adolescents.', array['Python', 'VS Code', 'Pandas'], 850, '🐍', 'green', 4),
  ('web-development', 'Web Development', '13–17 ans', 'avance', 'Sites web, interfaces responsives, JavaScript et premières applications React.', array['HTML/CSS', 'JavaScript', 'React'], 900, '🌐', 'rose', 5),
  ('intelligence-artificielle', 'Intelligence Artificielle', '14–17 ans', 'avance', 'Vision, machine learning, projets IA éducatifs et robotique VinciBot.', array['VinciBot', 'Dadabit AI', 'Python ML'], 950, '🧠', 'purple', 6)
on conflict (id) do update set
  title = excluded.title,
  age_range = excluded.age_range,
  level = excluded.level,
  description = excluded.description,
  tools = excluded.tools,
  price_monthly = excluded.price_monthly,
  icon = excluded.icon,
  color = excluded.color,
  sort_order = excluded.sort_order;
