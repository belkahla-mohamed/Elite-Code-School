import { NextResponse } from "next/server";
import { getDashboardSnapshot, getPublicPortfolios, createStudent } from "@/lib/store";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    if (await isAdminAuthenticated()) {
      const snapshot = await getDashboardSnapshot();
      return NextResponse.json({ students: snapshot.students });
    }

    return NextResponse.json({ students: await getPublicPortfolios() });
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
    if (!body.firstName || !body.lastName || !body.age || !body.programId) {
      return NextResponse.json({ error: "Champs requis manquants (firstName, lastName, age, programId)" }, { status: 400 });
    }
    if (!Number.isInteger(body.age) || body.age < 6 || body.age > 20) {
      return NextResponse.json({ error: "L'âge doit être compris entre 6 et 20 ans" }, { status: 400 });
    }
    if (body.createdAt && isNaN(Date.parse(body.createdAt))) {
      return NextResponse.json({ error: "Date de création invalide" }, { status: 400 });
    }
    const student = await createStudent(body);
    return NextResponse.json({ student }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
