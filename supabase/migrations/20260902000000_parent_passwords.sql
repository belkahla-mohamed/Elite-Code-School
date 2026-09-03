begin;

-- Connexion parent par mot de passe (en complément du code d'accès legacy)
alter table public.parents add column if not exists password_hash text;

-- Tokens de réinitialisation de mot de passe parent (usage unique, expiry 1h)
create table if not exists public.parent_password_resets (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists parent_password_resets_token_idx on public.parent_password_resets (token_hash);

alter table public.parent_password_resets enable row level security;

commit;