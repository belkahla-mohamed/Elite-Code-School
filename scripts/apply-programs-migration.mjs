import pg from "pg"
const { Client } = pg

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
    connectionTimeoutMillis: 15000,
  })

  try {
    await client.connect()
    console.log("Connected")

    await client.query(`
      alter table public.programs add column if not exists image text;
      alter table public.programs add column if not exists duration text not null default '';
      alter table public.programs add column if not exists objectives text not null default '';
      alter table public.programs add column if not exists prerequisites text not null default '';
      alter table public.programs add column if not exists schedule text not null default '';
    `)

    console.log("Migration applied successfully!")
    await client.end()
  } catch (e) {
    console.error("Migration failed:", e.message)
    process.exit(1)
  }
}

main()
