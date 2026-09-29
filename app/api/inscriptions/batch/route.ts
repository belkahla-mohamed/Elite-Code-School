import { NextRequest, NextResponse } from "next/server";
import { batchAcceptEnrollments, batchRejectEnrollments } from "@/lib/store";
import { isAdminAuthenticated } from "@/lib/auth";
import { requireCsrf } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const csrfError = requireCsrf(request);
    if (csrfError) return csrfError;

    const { action, ids, rejectionMessage } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Aucun élément sélectionné" }, { status: 400 });
    }

    if (action === "accept") {
      const results = await batchAcceptEnrollments(ids);
      const accepted = results.filter((r) => !r.error);
      return NextResponse.json({
        message: `${accepted.length} demande(s) acceptée(s)`,
        results,
        failed: results.filter((r) => r.error),
      });
    }

    if (action === "reject") {
      const results = await batchRejectEnrollments(ids, rejectionMessage);
      const rejected = results.filter((r) => !r.error);
      return NextResponse.json({
        message: `${rejected.length} demande(s) refusée(s)`,
        results,
        failed: results.filter((r) => r.error),
      });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
