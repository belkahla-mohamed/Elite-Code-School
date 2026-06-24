import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createTeacher, getDashboardSnapshot } from "@/lib/store";
import { teacherSchema } from "@/lib/validation";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const snapshot = await getDashboardSnapshot();
  return NextResponse.json({ teachers: snapshot.teachers });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = teacherSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
  }

  const created = await createTeacher(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
