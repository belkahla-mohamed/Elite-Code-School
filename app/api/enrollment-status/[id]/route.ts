import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { hasSupabaseConfig, getSupabaseAdmin } = await import("@/lib/supabase");
    const { hashSecret } = await import("@/lib/auth");

    if (!hasSupabaseConfig()) {
      return NextResponse.json({ error: "Statut non disponible en mode démo" }, { status: 503 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("inscription_requests")
      .select("id, status, student_first_name, student_last_name, program_id, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });

    return NextResponse.json({
      id: data.id,
      status: data.status,
      studentFirstName: data.student_first_name,
      studentLastName: data.student_last_name,
      createdAt: data.created_at,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur" }, { status: 500 });
  }
}
