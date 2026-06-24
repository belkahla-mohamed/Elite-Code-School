import { NextResponse } from "next/server";
import { getTeacherId } from "@/lib/auth";
import { getTeacherDashboard } from "@/lib/store";

export async function GET() {
  try {
    const teacherId = await getTeacherId();
    if (!teacherId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const dashboard = await getTeacherDashboard(teacherId);
    if (!dashboard) {
      return NextResponse.json({ error: "Teacher introuvable" }, { status: 401 });
    }

    return NextResponse.json(dashboard);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
