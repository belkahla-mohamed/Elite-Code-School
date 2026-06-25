import { NextResponse } from "next/server";
import { setParentSession } from "@/lib/auth";
import { getStudentByParentLogin } from "@/lib/store";
import { rateLimit } from "@/lib/rate-limiter";
import { validateContentType } from "@/lib/xss-utils";

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const ip = request.headers.get("x-forwarded-for") ?? "parent-login";
    const { allowed, retryAfter } = rateLimit(`parent:${ip}`, 10, 60_000);
    if (!allowed) return NextResponse.json({ error: "Trop de tentatives" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const { email, secret } = await request.json();
    const student = await getStudentByParentLogin(email ?? "", secret ?? "");
    if (!student) return NextResponse.json({ error: "Accès parent invalide" }, { status: 401 });

    await setParentSession(student.id);
    return NextResponse.json({ student });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
