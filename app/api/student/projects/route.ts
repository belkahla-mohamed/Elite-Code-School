import { NextResponse } from "next/server";
import { getParentStudentId, isAdminAuthenticated, isTeacherAuthenticated } from "@/lib/auth";
import { getStudentById, addProject } from "@/lib/store";
import { projectSchema } from "@/lib/validation";

export async function GET() {
  try {
    let studentId = await getParentStudentId();
    if (!studentId) {
      if (await isAdminAuthenticated()) studentId = "";
      else return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!studentId) return NextResponse.json({ projects: [] });
    const student = await getStudentById(studentId);
    return NextResponse.json({ projects: student?.projects ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const studentId = await getParentStudentId();
    if (!studentId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const parsed = projectSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

    const project = await addProject(studentId, { ...parsed.data, status: "pending" });
    return NextResponse.json({ project }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
