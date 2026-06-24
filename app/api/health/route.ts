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

  return Response.json({
    status: dbConnected ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks,
    note: dbConnected
      ? `Database reachable. ${tableCount} programs found.`
      : "DATABASE_URL not configured. Running in demo mode with in-memory data.",
    env: {
      hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      nodeEnv: process.env.NODE_ENV ?? "development",
    },
  });
}
