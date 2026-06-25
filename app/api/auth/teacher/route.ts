import { NextResponse } from "next/server";
import { setTeacherSession } from "@/lib/auth";
import { getTeacherByLogin } from "@/lib/store";
import { rateLimit } from "@/lib/rate-limiter";
import { validateContentType } from "@/lib/xss-utils";

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const ip = request.headers.get("x-forwarded-for") ?? "teacher-login";
    const { allowed, retryAfter } = rateLimit(`teacher:${ip}`, 10, 60_000);
    if (!allowed) return NextResponse.json({ error: "Trop de tentatives" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const { email, secret } = await request.json();
    const teacher = await getTeacherByLogin(email ?? "", secret ?? "");
    if (!teacher) return NextResponse.json({ error: "Accès teacher invalide" }, { status: 401 });

    await setTeacherSession(teacher.id);
    return NextResponse.json({ teacher });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
