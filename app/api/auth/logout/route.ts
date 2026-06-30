import { NextResponse } from "next/server";
import { clearSessions } from "@/lib/auth";

export async function POST() {
  try {
    await clearSessions();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await clearSessions();
    return NextResponse.redirect(new URL("/admin-login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  } catch {
    return NextResponse.redirect(new URL("/admin-login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" } });
}
