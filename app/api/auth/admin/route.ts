import { NextResponse } from "next/server";
import { z } from "zod";
import { setAdminSession, generateToken } from "@/lib/auth";
import { verifyAdminCredentials, updateAdminLastLogin } from "@/lib/store";
import { rateLimit } from "@/lib/rate-limiter";
import { validateContentType } from "@/lib/xss-utils";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email requis").max(200),
  password: z.string().min(1, "Mot de passe requis").max(200),
});

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const ip = request.headers.get("x-forwarded-for") ?? "admin-login";
    const { allowed, retryAfter } = rateLimit(`admin:${ip}`, 20, 60_000);
    if (!allowed) return NextResponse.json({ error: "Trop de tentatives" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }
    const { email, password } = parsed.data;
    const user = await verifyAdminCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }
    await updateAdminLastLogin(user.id)
    await setAdminSession({ id: user.id, role: user.role, permissions: user.permissions });
    const token = generateToken({ id: user.id, name: `${user.firstName} ${user.lastName}`, role: user.role, permissions: user.permissions });
    return NextResponse.json({ ok: true, token, user: { id: user.id, name: `${user.firstName} ${user.lastName}`, role: user.role, permissions: user.permissions } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
