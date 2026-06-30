begin;

alter table public.programs
  add column if not exists image text,
  add column if not exists duration text not null default '',
  add column if not exists objectives text not null default '',
  add column if not exists prerequisites text not null default '',
  add column if not exists schedule text not null default '';

commit;
