begin;

-- CMS content blocks (was created manually in production; needed for fresh installs)
create table if not exists public.content_blocks (
  key text primary key,
  value text not null default '',
  created_at timestamp not null default CURRENT_TIMESTAMP,
  updated_at timestamp not null default CURRENT_TIMESTAMP
);

commit;
