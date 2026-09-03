import { createHash } from "crypto";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import {
  categories as seedCategories,
  programs as seedPrograms,
  students as seedStudents,
  inscriptionRequests as seedRequests,
  projects as seedProjects,
  certifications as seedCertifications,
  galleryItems as seedGallery,
  seances as seedSeances,
} from "../data/seed";

function loadEnvVar(name: string): string {
  const fromEnv = process.env[name];
  if (fromEnv) return fromEnv;
  const file = readFileSync(".env", "utf8");
  const line = file.split(/\r?\n/).find((l) => l.startsWith(`${name}=`));
  const value = line ? line.split("=", 2)[1]?.trim() : "";
  if (!value) throw new Error(`Missing ${name} in .env`);
  return value;
}

const url = loadEnvVar("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey = loadEnvVar("SUPABASE_SERVICE_ROLE_KEY");
const adminPassword = process.env.ADMIN_PASSWORD ?? loadEnvVar("ADMIN_PASSWORD") ?? "admin1234";

const db = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

function uuidFromDemo(id: string): string {
  const hash = createHash("md5").update(`ecs:${id}`).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

function iso(date: Date | string): string {
  return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
}

async function clearAll() {
  const order = [
    "seances", "follows", "student_requests", "student_messages", "student_alerts",
    "parents", "gallery_items", "certifications", "projects", "students",
    "inscription_requests", "notifications", "admin_users", "app_settings",
    "programs", "categories",
  ];
  for (const table of order) {
    const { error } = await db.from(table).delete().neq("id", errorOrPlaceholder(table));
    if (error) console.log(`  clear ${table}: ${error.message}`);
  }
}

function errorOrPlaceholder(table: string): string {
  // app_settings has a bigint id, all others uuid — use a value that can never collide
  return "00000000-0000-0000-0000-000000000000";
}

async function main() {
  console.log("Supabase seed...");

  await clearAll();

  // Categories
  for (const [i, cat] of seedCategories.entries()) {
    const { error } = await db.from("categories").insert({
      id: cat.id, name: cat.name, slug: cat.slug, description: cat.description,
      color: cat.color, sort_order: i + 1,
    });
    if (error) console.error("cat", error.message);
  }
  console.log("  OK categories");

  // Programs
  for (const [i, p] of seedPrograms.entries()) {
    const { error } = await db.from("programs").insert({
      id: p.id, title: p.title, age_range: p.ageRange, level: p.level,
      description: p.description, tools: p.tools ?? [], price_monthly: p.priceMonthly ?? 0,
      image: p.image ?? "", color: p.color, duration: p.duration ?? "",
      objectives: p.objectives ?? "", prerequisites: p.prerequisites ?? "",
      schedule: p.schedule ?? "", category_id: p.categoryId ?? null, sort_order: i + 1,
    });
    if (error) console.error("program", p.id, error.message);
  }
  console.log("OK programs");

  // Students (deterministic uuid)
  const studentUuids = new Map<string, string>();
  for (const s of seedStudents) {
    const id = uuidFromDemo(s.id);
    studentUuids.set(s.id, id);
    const { error } = await db.from("students").insert({
      id, slug: s.slug, first_name: s.firstName, last_name: s.lastName, age: s.age,
      avatar: s.avatar, avatar_gradient: s.avatarGradient, program_id: s.programId,
      level_label: s.levelLabel, join_date_label: s.joinDateLabel, hours: s.hours,
      is_public: s.isPublic, parent_email: s.parentEmail, parent_secret_hash: s.parentSecretHash,
      created_at: iso(s.createdAt),
    });
    if (error) console.error("student", s.slug, error.message);
  }
  console.log("OK students");

  // Parents
  for (const s of seedStudents) {
    const emailName = s.parentEmail.split("@")[0];
    const { error } = await db.from("parents").insert({
      id: uuidFromDemo(`parent-${s.id}`),
      email: s.parentEmail,
      first_name: emailName,
      last_name: "",
      phone: "",
      secret_hash: s.parentSecretHash,
      student_id: studentUuids.get(s.id),
    });
    if (error) console.error("parent", s.parentEmail, error.message);
  }
  console.log("OK parents");

  // Projects
  for (const p of seedProjects) {
    const { error } = await db.from("projects").insert({
      id: uuidFromDemo(p.id), student_id: studentUuids.get(p.studentId),
      title: p.title, description: p.description, tags: p.tags ?? [],
      status: p.status, progress: p.progress, date_label: p.dateLabel,
      emoji: p.emoji, gradient: p.gradient, cover_image: p.coverImage ?? null,
    });
    if (error) console.error("project", p.id, error.message);
  }
  console.log("OK projects");

  // Certifications
  for (const c of seedCertifications) {
    const { error } = await db.from("certifications").insert({
      id: uuidFromDemo(c.id), student_id: studentUuids.get(c.studentId),
      title: c.title, mention: c.mention, date_label: c.dateLabel,
      emoji: c.emoji, gradient: c.gradient, image_url: c.imageUrl ?? null,
    });
    if (error) console.error("cert", c.id, error.message);
  }
  console.log("OK certifications");

  // Gallery
  for (const g of seedGallery) {
    const { error } = await db.from("gallery_items").insert({
      id: uuidFromDemo(g.id), student_id: studentUuids.get(g.studentId),
      label: g.label, emoji: g.emoji, gradient: g.gradient, image_url: g.imageUrl ?? null,
    });
    if (error) console.error("gallery", g.id, error.message);
  }
  console.log("OK gallery");

  // Seances (planning)
  for (const s of seedSeances) {
    const { error } = await db.from("seances").insert({
      id: uuidFromDemo(s.id), student_id: studentUuids.get(s.studentId),
      program_id: s.programId, title: s.title, date: s.date,
      start_time: s.startTime, end_time: s.endTime,
      status: s.status, topic: s.topic ?? "", notes: s.notes ?? null,
    });
    if (error) { console.error("seance", s.id, error.message); break; }
  }
  console.log("OK seances");

  // Inscription requests
  for (const r of seedRequests) {
    const { error } = await db.from("inscription_requests").insert({
      id: uuidFromDemo(r.id), student_first_name: r.studentFirstName,
      student_last_name: r.studentLastName, age: r.age, school_level: r.schoolLevel ?? null,
      program_id: r.programId, parent_first_name: r.parentFirstName ?? "",
      parent_last_name: r.parentLastName ?? "", parent_phone: r.parentPhone,
      parent_email: r.parentEmail, message: r.message ?? null, status: r.status,
      admin_notes: r.adminNotes ?? null, rejection_message: r.rejectionMessage ?? null,
      created_at: iso(r.createdAt),
    });
    if (error) console.error("request", r.id, error.message);
  }
  console.log("OK requests");

  // Admin user (plaintext password, matches verifyAdminCredentials)
  const { error: adminErr } = await db.from("admin_users").insert({
    id: uuidFromDemo("admin-1"),
    email: process.env.ADMIN_EMAIL ?? "admin@elitecodeschool.com",
    first_name: "Super", last_name: "Admin", role: "super_admin",
    password_hash: adminPassword,
  });
  if (adminErr) console.error("admin", adminErr.message);

  // app_settings single row
  await db.from("app_settings").insert({ id: 1, admin_email: process.env.ADMIN_EMAIL ?? "" });
  console.log("OK admin + settings");

  // Demo alerts (Mission Planète Mars)
  for (const a of [
    ["alert-mars-1", "all", "Mission Planète Mars", "La grande compétition annuelle approche ! Prépare ton portfolio et ton projet robot.", "🚀"],
    ["alert-cours-1", "all", "Reprise des cours", "Les cours reprennent le lundi 9 septembre. Pense à réserver ton planning !", "📅"],
  ] as const) {
    await db.from("student_alerts").insert({
      id: uuidFromDemo(a[0]), student_id: a[1], title: a[2], description: a[3],
      emoji: a[4], read: false,
    });
  }
  console.log("OK alerts");

  console.log("Done ✔");
}

main().catch((e) => { console.error(e); process.exit(1); });