import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createProgram, getPrograms } from "@/lib/store";

export async function GET() {
  try {
    return NextResponse.json(await getPrograms());
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const body = await request.json();
    await createProgram(body);
    return NextResponse.json({ programs: await getPrograms() }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
