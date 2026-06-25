import { NextResponse } from "next/server";
import { getCertificationById } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const result = await getCertificationById(id);
    if (!result) return NextResponse.json({ error: "Certification introuvable" }, { status: 404 });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
