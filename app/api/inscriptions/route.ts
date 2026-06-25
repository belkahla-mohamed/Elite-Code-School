import { NextResponse } from "next/server";
import { createInscriptionRequest, getDashboardSnapshot } from "@/lib/store";
import { inscriptionSchema } from "@/lib/validation";
import { isAdminAuthenticated } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limiter";
import { validateContentType } from "@/lib/xss-utils";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const snapshot = await getDashboardSnapshot();
    return NextResponse.json({ requests: snapshot.requests });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const ip = request.headers.get("x-forwarded-for") ?? "inscription";
    const { allowed, retryAfter } = rateLimit(`inscription:${ip}`, 3, 60_000);
    if (!allowed) return NextResponse.json({ error: "Trop de requêtes" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const parsed = inscriptionSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
    }

    const created = await createInscriptionRequest(parsed.data);
    return NextResponse.json({ request: created }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
