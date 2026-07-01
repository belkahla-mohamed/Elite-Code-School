import { randomBytes } from "crypto";
import ImageKit from "@imagekit/nodejs";
import { getImageKit, hasImageKitConfig } from "@/lib/imagekit";

const ROOT_FOLDER = "elite-code-school";

type UploadResult = { url: string; error?: undefined } | { error: string; url?: undefined };

export async function uploadFile(file: File, folder: string): Promise<UploadResult> {
  if (!hasImageKitConfig()) {
    return uploadBase64(file);
  }
  try {
    const ik = getImageKit();
    const ext = file.name.split(".").pop() || "png";
    const fileName = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
    const ikFolder = `${ROOT_FOLDER}/${folder}`;

    const result = await ik.files.upload({
      file: file,
      fileName,
      folder: ikFolder,
    });

    if (!result.url) return { error: "Upload failed: no URL returned" };
    return { url: result.url };
  } catch (e: any) {
    return { error: e.message ?? "Upload failed" };
  }
}

async function uploadBase64(file: File): Promise<UploadResult> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return { url: `data:${file.type};base64,${base64}` };
}

export async function deleteFile(url: string) {
  if (!hasImageKitConfig()) return;
  try {
    const ik = getImageKit();
    const urlObj = new URL(url);
    const filePath = decodeURIComponent(urlObj.pathname);
    await ik.files.delete(filePath);
  } catch {}
}

export function getOptimizedUrl(src: string, opts?: { width?: number; height?: number; quality?: number }): string {
  if (!src || src.startsWith("data:")) return src;
  if (!hasImageKitConfig()) return src;
  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT!;
  try {
    const url = new URL(src);
    if (!url.hostname.includes("imagekit.io")) return src;
    const w = opts?.width ?? 800;
    const q = opts?.quality ?? 80;
    const h = opts?.height;
    const tr = h ? `w-${w},h-${h},c-maintain_ratio,q-${q},f-auto` : `w-${w},q-${q},f-auto`;
    url.searchParams.set("tr", tr);
    return url.toString();
  } catch {
    return src;
  }
}
