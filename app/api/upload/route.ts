import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/upload";
import { isAdminAuthenticated, getParentStudentId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    const parentId = await getParentStudentId();
    if (!isAdmin && !parentId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file") as File | null;
    const folder = (form.get("folder") as string) || "general";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 5 Mo)" }, { status: 413 });
    }

    const result = await uploadFile(file, folder);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

    return NextResponse.json({ url: result.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export const runtime = "nodejs";
