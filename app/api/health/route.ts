export const runtime = "nodejs";

export async function GET() {
  const checks: Record<string, "ok" | "missing" | "error"> = {};
  let dbConnected = false;
  let tableCount = 0;

  // Check Prisma client
  try {
    const { prisma } = await import("@/lib/prisma");
    checks.prisma = "ok";

    // Try a simple query
    const programCount = await prisma.program.count();
    tableCount = programCount;
    dbConnected = true;
    checks.database = "ok";
  } catch (e) {
    checks.database = e instanceof Error && e.message.includes("env") ? "missing" : "error";
  }

  const { hasSupabaseConfig, getPrograms } = await import("@/lib/store");
  const storeMode: "supabase" | "demo" = hasSupabaseConfig() ? "supabase" : "demo";
  let storePrograms = 0;

  if (storeMode === "supabase") {
    try {
      storePrograms = (await getPrograms()).length;
      checks.supabaseStore = "ok";
    } catch {
      checks.supabaseStore = "error";
    }
  } else {
    checks.supabaseStore = "missing";
  }

  const nodeEnv = process.env.NODE_ENV ?? "development";
  const storeOk = storeMode === "supabase" ? checks.supabaseStore === "ok" : nodeEnv !== "production";
  const healthy = dbConnected && storeOk;

  let note = "";
  if (storeMode === "supabase" && checks.supabaseStore === "ok") {
    note = `Supabase store reachable. ${storePrograms} programs.`;
  } else if (storeMode === "supabase") {
    note = "Supabase env present but store queries failing — public data unavailable.";
  } else if (nodeEnv === "production") {
    note = "WARNING: Supabase env vars missing in production — running with in-memory demo data.";
  } else {
    note = "Supabase env not set — demo mode with in-memory data (expected locally).";
  }

  return Response.json({
    status: healthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks,
    storeMode,
    note: dbConnected ? note : `DATABASE_URL not configured. ${note}`,
    env: {
      hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      nodeEnv,
    },
  });
}
