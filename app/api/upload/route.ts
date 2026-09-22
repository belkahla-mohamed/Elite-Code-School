import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/upload";
import { isAdminAuthenticated, getParentStudentId } from "@/lib/auth";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    const parentId = await getParentStudentId();
    if (!isAdmin && !parentId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file") as File | null;
    const rawFolder = (form.get("folder") as string) || "general";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json({ error: "Format d'image non supporté" }, { status: 415 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 5 Mo)" }, { status: 413 });
    }

    // Whitelist folder characters to avoid path traversal (".." etc).
    const cleanFolder = rawFolder
      .split("/")
      .map((seg) => seg.replace(/[^a-zA-Z0-9_-]/g, ""))
      .filter(Boolean)
      .join("/");

    // Parents may only upload into their own student's folder.
    const folder = parentId && !isAdmin ? `parents/${parentId}` : cleanFolder;

    const result = await uploadFile(file, folder);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

    return NextResponse.json({ url: result.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export const runtime = "nodejs";
