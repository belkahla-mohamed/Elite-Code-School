# Supabase setup

This folder contains the database setup for Elite Code School.

## Files

- `migrations/20260619112000_initial_schema.sql` — tables, indexes, RLS policies, grants, comments.
- `seed.sql` — required program catalog seed data.
- `schema.sql` — legacy combined SQL kept as a quick SQL Editor fallback.

## Recommended setup with Supabase CLI

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase db reset --linked
```

Use `supabase db push` for remote migrations. Use `supabase db reset --linked` only when you intentionally want to reset the linked database.

## Manual setup from Supabase dashboard

1. Open Supabase Dashboard.
2. Go to SQL Editor.
3. Run `migrations/20260619112000_initial_schema.sql`.
4. Run `seed.sql`.
5. Start the app with the `.env` keys filled.

## Security model

- Public visitors can read programs and public portfolios only.
- Public visitors can create inscription requests only.
- Teachers are stored in `teachers`, but public clients have no direct read access.
- Admin and teacher operations run through Next.js API routes using `SUPABASE_SERVICE_ROLE_KEY`.
- Parent access is created only when admin accepts an inscription request.
