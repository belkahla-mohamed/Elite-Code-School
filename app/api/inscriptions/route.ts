import { NextResponse } from "next/server";
import { createInscriptionRequest, getDashboardSnapshot } from "@/lib/store";
import { inscriptionSchema } from "@/lib/validation";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const snapshot = await getDashboardSnapshot();
  return NextResponse.json({ requests: snapshot.requests });
}

export async function POST(request: Request) {
  const parsed = inscriptionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
  }

  const created = await createInscriptionRequest(parsed.data);
  return NextResponse.json({ request: created }, { status: 201 });
}
