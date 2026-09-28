import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let value = m[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[m[1]] = value;
  }
  return out;
}

const args = process.argv.slice(2);
function argValue(name, fallback) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const outDir = path.resolve(argValue("--out", path.join("C:", "Users", "Administrator", "Desktop", "db-backup")));
const env = { ...loadEnv(path.join(ROOT, ".env")), ...process.env };
const databaseUrl = env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL manquant dans .env");
  process.exit(1);
}

const IGNORED_TABLES = new Set(["_prisma_migrations"]);
const EXCLUDED_SCHEMAS = new Set(["pg_catalog", "information_schema", "pg_toast"]);

async function main() {
  const client = new pg.Client({ connectionString: databaseUrl, ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined });
  await client.connect();

  const tablesResult = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);
  const tables = tablesResult.rows.map((r) => r.table_name).filter((t) => !IGNORED_TABLES.has(t) && !EXCLUDED_SCHEMAS.has(t));

  fs.mkdirSync(path.join(outDir, "data"), { recursive: true });
  const schemaDir = path.join(outDir, "schema");
  fs.mkdirSync(schemaDir, { recursive: true });

  const migrationsDir = path.join(ROOT, "supabase", "migrations");
  if (fs.existsSync(migrationsDir)) {
    for (const file of fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"))) {
      fs.copyFileSync(path.join(migrationsDir, file), path.join(schemaDir, file));
    }
  }

  const manifest = {
    createdAt: new Date().toISOString(),
    source: new URL(databaseUrl).host,
    schema: "public",
    tables: {},
  };
  const dump = {};

  for (const table of tables) {
    const pkRes = await client.query(
      `SELECT kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
       WHERE tc.table_schema = 'public' AND tc.table_name = $1 AND tc.constraint_type = 'PRIMARY KEY'
       ORDER BY kcu.ordinal_position`,
      [table]
    );
    const pk = pkRes.rows.map((r) => r.column_name);

    const rows = (await client.query(`SELECT * FROM "${table}"`)).rows;
    fs.writeFileSync(path.join(outDir, "data", `${table}.json`), JSON.stringify(rows, null, 2), "utf8");
    dump[table] = rows;
    manifest.tables[table] = { rows: rows.length, primaryKey: pk, file: `data/${table}.json` };
    console.log(`${table.padEnd(28)} ${String(rows.length).padStart(6)} lignes  pk=[${pk.join(", ")}]`);
  }

  fs.writeFileSync(path.join(outDir, "dump.json"), JSON.stringify(dump, null, 2), "utf8");
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  const total = Object.values(manifest.tables).reduce((sum, t) => sum + t.rows, 0);
  console.log(`\n${tables.length} tables, ${total} lignes -> ${outDir}`);

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
