import { NextResponse } from "next/server";
import { getParentStudentId } from "@/lib/auth";
import { getStudentPlanning } from "@/lib/store";

export async function GET() {
  try {
    const studentId = await getParentStudentId();
    if (!studentId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    const planning = await getStudentPlanning(studentId);
    if (!planning) {
      return NextResponse.json({ error: "Planning introuvable" }, { status: 404 });
    }

    return NextResponse.json({ planning });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
