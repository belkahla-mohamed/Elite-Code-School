-- Run this in Supabase Dashboard → SQL Editor

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
