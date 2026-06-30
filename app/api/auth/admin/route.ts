import { NextResponse } from "next/server";
import { setAdminSession, generateToken } from "@/lib/auth";
import { verifyAdminCredentials, updateAdminLastLogin } from "@/lib/store";
import { rateLimit } from "@/lib/rate-limiter";
import { validateContentType } from "@/lib/xss-utils";

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const ip = request.headers.get("x-forwarded-for") ?? "admin-login";
    const { allowed, retryAfter } = rateLimit(`admin:${ip}`, 5, 60_000);
    if (!allowed) return NextResponse.json({ error: "Trop de tentatives" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const { email, password } = await request.json();
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }
    const user = await verifyAdminCredentials(email.trim(), password);
    if (!user) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }
    await updateAdminLastLogin(user.id)
    await setAdminSession();
    const token = generateToken({ id: user.id, name: `${user.firstName} ${user.lastName}`, role: "admin" });
    return NextResponse.json({ ok: true, token, user: { id: user.id, name: `${user.firstName} ${user.lastName}`, role: "admin" } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
