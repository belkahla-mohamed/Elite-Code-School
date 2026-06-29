import { NextResponse } from "next/server";
import { setAdminSession, verifyAdminPassword } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limiter";
import { validateContentType } from "@/lib/xss-utils";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@elitecodeschool.com";

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const ip = request.headers.get("x-forwarded-for") ?? "admin-login";
    const { allowed, retryAfter } = rateLimit(`admin:${ip}`, 5, 60_000);
    if (!allowed) return NextResponse.json({ error: "Trop de tentatives" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const { email, password } = await request.json();
    if (!email?.trim()) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }
    if (!verifyAdminPassword(password ?? "")) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }
    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }
    await setAdminSession();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
