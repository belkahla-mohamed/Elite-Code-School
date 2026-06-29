import pg from "pg"

const { Client } = pg

const sql = `
-- Admin users table
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text not null,
  last_name text not null,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login timestamptz
);

create unique index if not exists admin_users_email_lower_idx on public.admin_users(lower(email));
alter table public.admin_users enable row level security;
grant usage on schema public to anon, authenticated;

drop policy if exists "Admin users can read admin_users" on public.admin_users;
create policy "Admin users can read admin_users"
on public.admin_users for select using (true);

drop policy if exists "Admin users can insert admin_users" on public.admin_users;
create policy "Admin users can insert admin_users"
on public.admin_users for insert with check (true);

drop policy if exists "Admin users can delete admin_users" on public.admin_users;
create policy "Admin users can delete admin_users"
on public.admin_users for delete using (true);

-- Missing columns on projects
alter table public.projects add column if not exists cover_image text;

-- Missing columns on certifications
alter table public.certifications add column if not exists image_url text;

-- Missing columns on gallery_items
alter table public.gallery_items add column if not exists image_url text;

-- Missing columns on inscription_requests
alter table public.inscription_requests add column if not exists admin_notes text;
alter table public.inscription_requests add column if not exists rejection_message text;

-- Grant admin access to all tables
grant all on public.admin_users to anon, authenticated;
grant all on public.programs to anon, authenticated;
grant all on public.inscription_requests to anon, authenticated;
grant all on public.students to anon, authenticated;
grant all on public.projects to anon, authenticated;
grant all on public.certifications to anon, authenticated;
grant all on public.gallery_items to anon, authenticated;
`

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })

  try {
    await client.connect()
    console.log("Connected to Supabase PostgreSQL")
    await client.query(sql)
    console.log("Migration completed successfully!")
    
    // Verify
    const tables = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name IN ('admin_users', 'projects', 'certifications', 'gallery_items', 'inscription_requests')
      ORDER BY table_name, ordinal_position
    `)
    console.log("\nVerification - Tables and columns:")
    for (const row of tables.rows) {
      console.log(`  ${row.table_name}.${row.column_name} (${row.data_type})`)
    }
  } catch (err) {
    console.error("Migration failed:", err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
