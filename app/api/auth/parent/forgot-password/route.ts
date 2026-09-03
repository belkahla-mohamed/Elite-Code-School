import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { hashSecret } from "@/lib/auth";
import { getParentByEmail, createParentPasswordReset } from "@/lib/store";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limiter";
import { validateContentType } from "@/lib/xss-utils";

const schema = z.object({
  email: z.string().trim().email(),
});

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const ip = request.headers.get("x-forwarded-for") ?? "forgot-password";
    const { allowed, retryAfter } = rateLimit(`forgot:${ip}`, 3, 600_000);
    if (!allowed) return NextResponse.json({ error: "Trop de tentatives" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Email invalide" }, { status: 400 });

    const parent = await getParentByEmail(parsed.data.email);
    if (parent) {
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 3_600_000).toISOString();
      await createParentPasswordReset(parent.id, hashSecret(token), expiresAt);

      const parentName = `${parent.firstName} ${parent.lastName}`.trim() || "Parent";
      await sendPasswordResetEmail({ parentEmail: parent.email, parentName, resetToken: token });
    }

    // Réponse identique que le compte existe ou non (pas d'énumération d'emails)
    return NextResponse.json({
      success: true,
      message: "Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export const runtime = "nodejs";