import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";

const BUCKET = "ecs-uploads";

type UploadResult = { url: string; error?: undefined } | { error: string; url?: undefined };

export async function ensureBucket() {
  if (!hasSupabaseConfig()) return;
  const supabase = getSupabaseAdmin();
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: 5 * 1024 * 1024 });
  }
}

export async function uploadFile(file: File, folder: string): Promise<UploadResult> {
  if (!hasSupabaseConfig()) {
    return uploadBase64(file);
  }
  const supabase = getSupabaseAdmin();
  await ensureBucket();
  const ext = file.name.split(".").pop() || "png";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: error.message };
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: pub.publicUrl };
}

async function uploadBase64(file: File): Promise<UploadResult> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return { url: `data:${file.type};base64,${base64}` };
}

export async function deleteFile(url: string) {
  if (!hasSupabaseConfig() || !url.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL + "/")) return;
  const supabase = getSupabaseAdmin();
  const parts = url.split("/");
  const path = parts.slice(parts.indexOf(BUCKET) + 1).join("/");
  await supabase.storage.from(BUCKET).remove([path]);
}
