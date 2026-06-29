import { NextRequest, NextResponse } from "next/server";
import { batchAcceptEnrollments, batchRejectEnrollments } from "@/lib/store";
import { isAdminAuthenticated } from "@/lib/auth";
import { requireCsrf } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    const csrfError = requireCsrf(request);
    if (csrfError) return csrfError;

    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { action, ids, rejectionMessage } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Aucun élément sélectionné" }, { status: 400 });
    }

    if (action === "accept") {
      await batchAcceptEnrollments(ids);
      return NextResponse.json({ message: `${ids.length} demande(s) acceptée(s)` });
    }

    if (action === "reject") {
      await batchRejectEnrollments(ids, rejectionMessage);
      return NextResponse.json({ message: `${ids.length} demande(s) refusée(s)` });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
