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
