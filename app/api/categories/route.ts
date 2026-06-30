import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getCategories, createCategory } from "@/lib/store";
import { validateContentType } from "@/lib/xss-utils";

export async function GET() {
  try {
    return NextResponse.json(await getCategories());
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;
    if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const body = await request.json();
    await createCategory(body);
    return NextResponse.json({ categories: await getCategories() }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
