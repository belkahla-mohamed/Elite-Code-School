begin;

-- Siblings: one parent row per student, same family email must be allowed
drop index if exists public.parents_email_lower_key;
drop index if exists public.n_lower_key;

create index if not exists parents_email_lower_idx on public.parents(lower(email));

commit;
