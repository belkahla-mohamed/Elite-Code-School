const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL:", url);
console.log("Supabase Key length:", key ? key.length : 0);

if (!url || !key) {
  console.error("Missing env vars!");
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  console.log("Testing connection to Supabase...");
  const start = Date.now();
  try {
    const { data, error } = await supabase.from("programs").select("*").limit(2);
    const duration = Date.now() - start;
    if (error) {
      console.error(`Error after ${duration}ms:`, error);
    } else {
      console.log(`Success in ${duration}ms! Data found:`, data);
    }
  } catch (err) {
    const duration = Date.now() - start;
    console.error(`Exception after ${duration}ms:`, err);
  }
}

run();
