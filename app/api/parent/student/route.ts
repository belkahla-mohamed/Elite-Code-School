import { NextResponse } from "next/server";
import { getParentStudentId } from "@/lib/auth";
import { getStudentById } from "@/lib/store";

export async function GET() {
  try {
    const studentId = await getParentStudentId();
    if (!studentId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    const student = await getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Élève introuvable" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
