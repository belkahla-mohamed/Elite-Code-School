import { NextResponse } from "next/server";
import { isAdminAuthenticated, generateAccessSecret } from "@/lib/auth";
import { getParents, createParent } from "@/lib/store";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const parents = await getParents();
    return NextResponse.json({ parents });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { email, firstName, lastName, phone, studentId } = body;

    if (!email || !studentId) {
      return NextResponse.json({ error: "Email et élève requis" }, { status: 400 });
    }

    const parentSecret = `ECS-${generateAccessSecret()}`;

    const parent = await createParent({
      email,
      firstName: firstName ?? email.split("@")[0],
      lastName: lastName ?? "",
      phone: phone ?? "",
      secret: parentSecret,
      studentId,
    });

    return NextResponse.json({ parent, parentSecret }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
