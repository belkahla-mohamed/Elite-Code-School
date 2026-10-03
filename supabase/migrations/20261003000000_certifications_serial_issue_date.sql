alter table public.certifications add column if not exists serial_code text;
alter table public.certifications add column if not exists issue_date timestamptz not null default now();
create unique index if not exists certifications_serial_code_key on public.certifications (serial_code);
