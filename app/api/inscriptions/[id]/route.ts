import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { acceptInscriptionRequest, refuseInscriptionRequest } from "@/lib/store";
import { requireCsrf } from "@/lib/csrf";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const csrfError = requireCsrf(request);
    if (csrfError) return csrfError;

    const { id } = await params;
    const { action, notes, rejectionMessage } = await request.json();

    if (action === "accept") {
      const result = await acceptInscriptionRequest(id, notes);
      return NextResponse.json({
        student: result.student,
        parentSecret: result.parentSecret,
        message: "Inscription acceptée. Le parent peut se connecter.",
      });
    }

    if (action === "reject") {
      const result = await refuseInscriptionRequest(id, notes, rejectionMessage);
      return NextResponse.json({ request: result, message: "Demande refusée." });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
