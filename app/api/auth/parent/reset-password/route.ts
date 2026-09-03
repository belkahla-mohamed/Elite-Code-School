import { NextResponse } from "next/server";
import { z } from "zod";
import { hashSecret } from "@/lib/auth";
import { hashPassword } from "@/lib/passwords";
import { consumeParentPasswordReset, setParentPassword, getSettings } from "@/lib/store";
import { rateLimit } from "@/lib/rate-limiter";
import { validateContentType } from "@/lib/xss-utils";

const schema = z.object({
  token: z.string().trim().min(10),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const ip = request.headers.get("x-forwarded-for") ?? "reset-password";
    const { allowed, retryAfter } = rateLimit(`reset:${ip}`, 5, 600_000);
    if (!allowed) return NextResponse.json({ error: "Trop de tentatives" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Requête invalide" }, { status: 400 });

    const settings = await getSettings();
    if (parsed.data.password.length < settings.minPasswordLength) {
      return NextResponse.json({ error: `Le mot de passe doit contenir au moins ${settings.minPasswordLength} caractères` }, { status: 400 });
    }

    const parentId = await consumeParentPasswordReset(hashSecret(parsed.data.token));
    if (!parentId) return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 400 });

    await setParentPassword(parentId, await hashPassword(parsed.data.password));

    return NextResponse.json({ success: true, message: "Mot de passe mis à jour. Vous pouvez vous connecter." });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export const runtime = "nodejs";