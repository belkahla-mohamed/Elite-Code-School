import pg from "pg"
const { Client } = pg

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function main() {
  await client.connect()

  // Test the exact query verifyAdminCredentials would do
  const email = "mouad.lamssila@gmail.com"
  const password = "mouad.lamssila@gmail.com"

  const { rows } = await client.query(
    `SELECT id, email, first_name, last_name, role, created_at 
     FROM public.admin_users 
     WHERE LOWER(email) = LOWER($1) AND password_hash = $2`,
    [email, password]
  )

  console.log("Query result:", JSON.stringify(rows, null, 2))
  console.log("Found:", rows.length > 0)

  if (rows.length === 0) {
    // Debug: check what's actually stored
    const { rows: all } = await client.query(
      "SELECT email, password_hash FROM public.admin_users"
    )
    console.log("Actual stored:", JSON.stringify(all, null, 2))
    console.log("Email match:", all.some(r => r.email.toLowerCase() === email.toLowerCase()))
    console.log("Password match:", all.some(r => r.password_hash === password))
  }

  await client.end()
}

main().catch(e => { console.error(e.message); process.exit(1) })
