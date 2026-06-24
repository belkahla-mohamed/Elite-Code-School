import { NextResponse } from "next/server";
import { setParentSession } from "@/lib/auth";
import { getStudentByParentLogin } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const { email, secret } = await request.json();
    const student = await getStudentByParentLogin(email ?? "", secret ?? "");

    if (!student) {
      return NextResponse.json({ error: "Accès parent invalide" }, { status: 401 });
    }

    await setParentSession(student.id);
    return NextResponse.json({ student });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
