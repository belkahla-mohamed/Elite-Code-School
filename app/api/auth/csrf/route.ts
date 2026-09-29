import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { setCsrfCookie } from "@/lib/csrf"

export async function GET() {
  try {
    const jar = await cookies()
    setCsrfCookie(jar)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}

export const runtime = "nodejs"
