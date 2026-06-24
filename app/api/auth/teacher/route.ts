import { NextResponse } from "next/server";
import { setTeacherSession } from "@/lib/auth";
import { getTeacherByLogin } from "@/lib/store";

export async function POST(request: Request) {
  const { email, secret } = await request.json();
  const teacher = await getTeacherByLogin(email ?? "", secret ?? "");

  if (!teacher) {
    return NextResponse.json({ error: "Accès teacher invalide" }, { status: 401 });
  }

  await setTeacherSession(teacher.id);
  return NextResponse.json({ teacher });
}
