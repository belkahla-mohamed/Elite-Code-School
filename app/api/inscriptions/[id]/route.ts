import { NextResponse } from "next/server";
import { acceptInscriptionRequest, refuseInscriptionRequest } from "@/lib/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    if (action === "accept") {
      const result = await acceptInscriptionRequest(id);
      return NextResponse.json({
        student: result.student,
        parentSecret: result.parentSecret,
        message: "Inscription acceptée. Le parent peut se connecter.",
      });
    }

    if (action === "reject") {
      const result = await refuseInscriptionRequest(id);
      return NextResponse.json({ request: result, message: "Demande refusée." });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
