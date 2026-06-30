import {
  categories as seedCategories,
  certifications as seedCertifications,
  galleryItems as seedGalleryItems,
  inscriptionRequests as seedRequests,
  programs as seedPrograms,
  projects as seedProjects,
  students as seedStudents,
} from "@/data/seed";
import { hashSecret, generateAccessSecret } from "@/lib/auth";
import { hasSupabaseConfig, getSupabaseAdmin } from "@/lib/supabase";
import { sendAdminNotification, sendAcceptanceEmail, sendRejectionEmail } from "@/lib/email";
import type {
  AdminUser,
  AppNotification,
  AppSettings,
  Category,
  Certification,
  DashboardSnapshot,
  GalleryItem,
  InscriptionRequest,
  Parent,
  Program,
  ProgramColor,
  ProgramLevel,
  Project,
  Student,
  StudentPortfolio
} from "@/lib/types";
import { slugify } from "@/lib/utils";
import { addActivity, type ActivityEntry } from "@/lib/activity-log";

const notifTitles: Record<string, Record<string, string>> = {
  student: { "Élève créé": "Nouvel élève", "Élève supprimé": "Élève supprimé", "Inscription acceptée": "Inscription acceptée" },
  request: { "Inscription refusée": "Inscription refusée", "Admin créé": "Nouvel administrateur", "Admin modifié": "Admin modifié", "Admin supprimé": "Admin supprimé", "Message contact reçu": "Nouveau message contact" },
}

function addActivityAndNotify(type: ActivityEntry["type"], action: string, description: string) {
  addActivity(type, action, description)
  const title = notifTitles[type]?.[action] ?? action
  createNotification({ type: type as string, title, description }).catch(() => {})
}

type DemoStore = {
  requests: InscriptionRequest[];
  students: Student[];
  programs: Program[];
  projects: Project[];
  certifications: Certification[];
  gallery: GalleryItem[];
  categories: Category[];
};

const globalForStore = globalThis as unknown as { eliteCodeSchoolStore?: DemoStore };

function demoStore() {
  if (!globalForStore.eliteCodeSchoolStore) {
    globalForStore.eliteCodeSchoolStore = {
      requests: structuredClone(seedRequests),
      students: structuredClone(seedStudents),
      programs: structuredClone(seedPrograms),
      projects: structuredClone(seedProjects),
      certifications: structuredClone(seedCertifications),
      gallery: structuredClone(seedGalleryItems),
      categories: structuredClone(seedCategories),
    };
  }

  return globalForStore.eliteCodeSchoolStore;
}

function withPortfolio(student: Student, programs: Program[] = demoStore().programs): StudentPortfolio {
  const store = demoStore();
  return {
    ...student,
    program: programs.find((program) => program.id === student.programId),
    projects: store.projects.filter((project) => project.studentId === student.id),
    certifications: store.certifications.filter((certification) => certification.studentId === student.id),
    gallery: store.gallery.filter((item) => item.studentId === student.id)
  };
}

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23e5e7eb'/%3E%3Ctext x='400' y='210' text-anchor='middle' fill='%239ca3af' font-size='40' font-weight='bold' font-family='sans-serif'%3EImage%3C/text%3E%3C/svg%3E";

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseConfig()) return demoStore().categories;
  const { data, error } = await getSupabaseAdmin().from("categories").select("*").order("sort_order");
  if (error) return []
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    color: row.color ?? "sky",
  }));
}

export async function getPrograms(): Promise<Program[]> {
  if (!hasSupabaseConfig()) return demoStore().programs.map(fillImage).map(p => ({ ...p, category: demoStore().categories.find(c => c.id === p.categoryId) }));

  const { data, error } = await getSupabaseAdmin().from("programs").select("*").order("sort_order");
  if (error) throw error;
  const categories = await getCategories().catch(() => [] as Category[])
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    ageRange: row.age_range,
    level: row.level,
    description: row.description,
    tools: row.tools ?? [],
    priceMonthly: row.price_monthly,
    color: row.color,
    image: row.image || FALLBACK_IMAGE,
    duration: row.duration ?? "",
    objectives: row.objectives ?? "",
    prerequisites: row.prerequisites ?? "",
    schedule: row.schedule ?? "",
    categoryId: row.category_id ?? undefined,
    category: categories.find(c => c.id === row.category_id),
  }));
}

function fillImage(p: Program): Program {
  return { ...p, image: p.image || FALLBACK_IMAGE };
}

export async function createInscriptionRequest(payload: Omit<InscriptionRequest, "id" | "status" | "createdAt">) {
  if (!hasSupabaseConfig()) {
    const request: InscriptionRequest = {
      ...payload,
      parentFirstName: payload.parentFirstName ?? payload.parentEmail.split("@")[0],
      parentLastName: payload.parentLastName ?? "",
      id: `req-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    demoStore().requests.unshift(request);

    const programs = await getPrograms()
    const program = programs.find((p) => p.id === payload.programId)
    sendAdminNotification({
      studentFirstName: payload.studentFirstName,
      studentLastName: payload.studentLastName,
      age: payload.age,
      programTitle: program?.title ?? payload.programId,
      parentName: `${payload.parentFirstName} ${payload.parentLastName}`.trim() || payload.parentEmail.split("@")[0],
      parentEmail: payload.parentEmail,
      parentPhone: payload.parentPhone,
      message: payload.message,
    })

    return request;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("inscription_requests")
    .insert({
      id: crypto.randomUUID(),
      student_first_name: payload.studentFirstName,
      student_last_name: payload.studentLastName,
      age: payload.age,
      school_level: payload.schoolLevel,
      program_id: payload.programId,
      parent_first_name: payload.parentFirstName,
      parent_last_name: payload.parentLastName,
      parent_phone: payload.parentPhone,
      parent_email: payload.parentEmail,
      message: payload.message
    })
    .select("*")
    .single();

  if (error) throw error;

  const programs = await getPrograms()
  const program = programs.find((p) => p.id === payload.programId)
  sendAdminNotification({
    studentFirstName: payload.studentFirstName,
    studentLastName: payload.studentLastName,
    age: payload.age,
    programTitle: program?.title ?? payload.programId,
    parentName: `${payload.parentFirstName} ${payload.parentLastName}`.trim() || payload.parentEmail.split("@")[0],
    parentEmail: payload.parentEmail,
    parentPhone: payload.parentPhone,
    message: payload.message,
  })

  return mapRequest(data);
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!hasSupabaseConfig()) {
    const store = demoStore();
    return {
      requests: store.requests,
      students: store.students.map((student) => withPortfolio(student)),
      programs: store.programs,
      categories: store.categories
    };
  }

  const supabase = getSupabaseAdmin();
  const [requestsResult, studentsResult, programs, categoriesResult] = await Promise.all([
    supabase.from("inscription_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("students").select("*, projects(*), certifications(*), gallery_items(*)").order("created_at", { ascending: false }),
    getPrograms(),
    getCategories()
  ]);

  if (requestsResult.error) throw requestsResult.error;
  if (studentsResult.error) throw studentsResult.error;

  return {
    requests: requestsResult.data.map(mapRequest),
    students: studentsResult.data.map((row) => mapStudentPortfolio(row, programs)),
    programs,
    categories: categoriesResult
  };
}

export async function acceptInscriptionRequest(id: string, notes?: string) {
  const parentSecret = `ECS-${generateAccessSecret()}`;

  if (!hasSupabaseConfig()) {
    const store = demoStore();
    const request = store.requests.find((item) => item.id === id);
    if (!request) throw new Error("Demande introuvable");
    request.status = "accepted";
    if (notes) request.adminNotes = notes;

    const studentId = `stu-${Date.now()}`;
    const student: Student = {
      id: studentId,
      slug: slugify(`${request.studentFirstName}-${request.studentLastName}`),
      firstName: request.studentFirstName,
      lastName: request.studentLastName,
      age: request.age,
      avatar: `${request.studentFirstName[0]}${request.studentLastName[0]}`.toUpperCase(),
      avatarGradient: "linear-gradient(135deg,#4f46e5,#06b6d4)",
      programId: request.programId,
      levelLabel: "Nouveau parcours · Niveau 1",
      joinDateLabel: "Aujourd'hui",
      hours: 0,
      isPublic: true,
      parentEmail: request.parentEmail,
      parentSecretHash: hashSecret(parentSecret),
      createdAt: new Date().toISOString()
    };
    store.students.unshift(student);

    await createParent({
      email: request.parentEmail,
      firstName: request.parentFirstName || request.parentEmail.split("@")[0],
      lastName: request.parentLastName || "",
      phone: request.parentPhone,
      secret: parentSecret,
      studentId: studentId,
    })

    addActivityAndNotify("student", "Inscription acceptée", `${student.firstName} ${student.lastName} a rejoint le programme ${student.programId}`);
    sendAcceptanceEmail({
      parentName: `${request.parentFirstName} ${request.parentLastName}`.trim() || request.parentEmail.split("@")[0],
      parentEmail: request.parentEmail,
      studentFirstName: request.studentFirstName,
      studentLastName: request.studentLastName,
      parentSecret,
    })
    return { student: withPortfolio(student), parentSecret };
  }

  const supabase = getSupabaseAdmin();
  const { data: request, error: requestError } = await supabase
    .from("inscription_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (requestError) throw requestError;

  const studentId = crypto.randomUUID();
  const { data: student, error: studentError } = await supabase
    .from("students")
    .insert({
      id: studentId,
      slug: slugify(`${request.student_first_name}-${request.student_last_name}`),
      first_name: request.student_first_name,
      last_name: request.student_last_name,
      age: request.age,
      avatar: `${request.student_first_name[0]}${request.student_last_name[0]}`.toUpperCase(),
      avatar_gradient: "linear-gradient(135deg,#4f46e5,#06b6d4)",
      program_id: request.program_id,
      level_label: "Nouveau parcours · Niveau 1",
      join_date_label: "Aujourd'hui",
      hours: 0,
      is_public: true,
      parent_email: request.parent_email,
      parent_secret_hash: hashSecret(parentSecret)
    })
    .select("*")
    .single();

  if (studentError) throw studentError;

  await createParent({
    email: request.parent_email,
    firstName: request.parent_first_name || request.parent_email.split("@")[0],
    lastName: request.parent_last_name || "",
    phone: request.parent_phone,
    secret: parentSecret,
    studentId: studentId,
  })

  const updateData: Record<string, any> = { status: "accepted" };
  if (notes) updateData.admin_notes = notes;
  await supabase.from("inscription_requests").update(updateData).eq("id", id);
  addActivityAndNotify("student", "Inscription acceptée", `${request.student_first_name} ${request.student_last_name} a rejoint le programme`);
  sendAcceptanceEmail({
    parentName: `${request.parent_first_name} ${request.parent_last_name}`.trim() || request.parent_email.split("@")[0],
    parentEmail: request.parent_email,
    studentFirstName: request.student_first_name,
    studentLastName: request.student_last_name,
    parentSecret,
  })
  return { student: mapStudentPortfolio({ ...student, projects: [], certifications: [], gallery_items: [] }, await getPrograms()), parentSecret };
}

export async function refuseInscriptionRequest(id: string, notes?: string, rejectionMessage?: string) {
  if (!hasSupabaseConfig()) {
    const request = demoStore().requests.find((item) => item.id === id);
    if (!request) throw new Error("Demande introuvable");
    request.status = "refused";
    if (notes) request.adminNotes = notes;
    if (rejectionMessage) request.rejectionMessage = rejectionMessage;
    addActivityAndNotify("request", "Inscription refusée", `${request.studentFirstName} ${request.studentLastName}`);
    sendRejectionEmail({
      parentName: request.parentEmail.split("@")[0],
      parentEmail: request.parentEmail,
      studentFirstName: request.studentFirstName,
      studentLastName: request.studentLastName,
      reason: rejectionMessage,
    })
    return request;
  }

  const updateData: Record<string, any> = { status: "refused" };
  if (notes) updateData.admin_notes = notes;
  if (rejectionMessage) updateData.rejection_message = rejectionMessage;
  const { data, error } = await getSupabaseAdmin()
    .from("inscription_requests")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  addActivityAndNotify("request", "Inscription refusée", `${data.student_first_name} ${data.student_last_name}`);
  sendRejectionEmail({
    parentName: data.parent_email.split("@")[0],
    parentEmail: data.parent_email,
    studentFirstName: data.student_first_name,
    studentLastName: data.student_last_name,
    reason: rejectionMessage,
  })
  return mapRequest(data);
}

export async function getPublicPortfolios() {
  if (!hasSupabaseConfig()) {
    return demoStore().students.filter((student) => student.isPublic).map((student) => withPortfolio(student));
  }

  const programs = await getPrograms();
  const { data, error } = await getSupabaseAdmin()
    .from("students")
    .select("*, projects(*), certifications(*), gallery_items(*)")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((row) => mapStudentPortfolio(row, programs));
}

export async function getPortfolioBySlug(slug: string, allowPrivate = false) {
  if (!hasSupabaseConfig()) {
    const student = demoStore().students.find((item) => item.slug === slug);
    if (!student || (!student.isPublic && !allowPrivate)) return null;
    return withPortfolio(student);
  }

  const programs = await getPrograms();
  let query = getSupabaseAdmin().from("students").select("*, projects(*), certifications(*), gallery_items(*)").eq("slug", slug);
  if (!allowPrivate) query = query.eq("is_public", true);
  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  return data ? mapStudentPortfolio(data, programs) : null;
}

export async function getStudentByParentLogin(email: string, secret: string) {
  const secretHash = hashSecret(secret);

  if (!hasSupabaseConfig()) {
    const student = demoStore().students.find(
      (item) => item.parentEmail.toLowerCase() === email.toLowerCase() && item.parentSecretHash === secretHash
    );
    return student ? withPortfolio(student) : null;
  }

  const programs = await getPrograms();
  const { data, error } = await getSupabaseAdmin()
    .from("students")
    .select("*, projects(*), certifications(*), gallery_items(*)")
    .ilike("parent_email", email)
    .eq("parent_secret_hash", secretHash)
    .maybeSingle();

  if (error) throw error;
  return data ? mapStudentPortfolio(data, programs) : null;
}

export async function getStudentById(id: string) {
  if (!hasSupabaseConfig()) {
    const student = demoStore().students.find((item) => item.id === id);
    return student ? withPortfolio(student) : null;
  }

  const programs = await getPrograms();
  const { data, error } = await getSupabaseAdmin()
    .from("students")
    .select("*, projects(*), certifications(*), gallery_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapStudentPortfolio(data, programs) : null;
}

export async function createStudent(data: {
  firstName: string; lastName: string; age: number; programId: string;
  levelLabel?: string; hours?: number; parentEmail?: string;
  avatar?: string; avatarGradient?: string;
}) {
  if (!hasSupabaseConfig()) {
    const student: Student = {
      id: `stu-${Date.now()}`,
      slug: slugify(`${data.firstName}-${data.lastName}-${Date.now()}`),
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      avatar: data.avatar ?? `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
      avatarGradient: data.avatarGradient ?? "linear-gradient(135deg,#4f46e5,#06b6d4)",
      programId: data.programId,
      levelLabel: data.levelLabel ?? "Nouveau parcours · Niveau 1",
      joinDateLabel: "Aujourd'hui",
      hours: data.hours ?? 0,
      isPublic: true,
      parentEmail: data.parentEmail ?? "",
      parentSecretHash: hashSecret(`ECS-${generateAccessSecret()}`),
      createdAt: new Date().toISOString()
    };
    demoStore().students.unshift(student);
    addActivityAndNotify("student", "Élève créé", `${student.firstName} ${student.lastName}`);
    return withPortfolio(student);
  }
  const supabase = getSupabaseAdmin();
  const slug = slugify(`${data.firstName}-${data.lastName}-${Date.now()}`);
  const { data: student, error } = await supabase
    .from("students")
    .insert({
      id: crypto.randomUUID(),
      slug,
      first_name: data.firstName,
      last_name: data.lastName,
      age: data.age,
      avatar: data.avatar ?? `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
      avatar_gradient: data.avatarGradient ?? "linear-gradient(135deg,#4f46e5,#06b6d4)",
      program_id: data.programId,
      level_label: data.levelLabel ?? "Nouveau parcours · Niveau 1",
      join_date_label: "Aujourd'hui",
      hours: data.hours ?? 0,
      is_public: true,
      parent_email: data.parentEmail ?? "",
      parent_secret_hash: hashSecret(`ECS-${generateAccessSecret()}`),
    })
    .select("*")
    .single();
  if (error) throw error;
  addActivityAndNotify("student", "Élève créé", `${data.firstName} ${data.lastName}`);
  return mapStudentPortfolio({ ...student, projects: [], certifications: [], gallery_items: [] }, await getPrograms());
}

export async function updateStudent(id: string, data: { firstName?: string; lastName?: string; age?: number; levelLabel?: string; hours?: number; parentEmail?: string; programId?: string; avatar?: string; avatarGradient?: string }) {
  if (!hasSupabaseConfig()) {
    const student = demoStore().students.find((s) => s.id === id);
    if (!student) throw new Error("Élève introuvable");
    if (data.firstName !== undefined) student.firstName = data.firstName;
    if (data.lastName !== undefined) student.lastName = data.lastName;
    if (data.age !== undefined) student.age = data.age;
    if (data.levelLabel !== undefined) student.levelLabel = data.levelLabel;
    if (data.hours !== undefined) student.hours = data.hours;
    if (data.parentEmail !== undefined) student.parentEmail = data.parentEmail;
    if (data.programId !== undefined) student.programId = data.programId;
    if (data.avatar !== undefined) student.avatar = data.avatar;
    if (data.avatarGradient !== undefined) student.avatarGradient = data.avatarGradient;
    return withPortfolio(student);
  }
  const { error } = await getSupabaseAdmin().from("students").update({
    ...(data.firstName !== undefined && { first_name: data.firstName }),
    ...(data.lastName !== undefined && { last_name: data.lastName }),
    ...(data.age !== undefined && { age: data.age }),
    ...(data.levelLabel !== undefined && { level_label: data.levelLabel }),
    ...(data.hours !== undefined && { hours: data.hours }),
    ...(data.parentEmail !== undefined && { parent_email: data.parentEmail }),
    ...(data.programId !== undefined && { program_id: data.programId }),
    ...(data.avatar !== undefined && { avatar: data.avatar }),
    ...(data.avatarGradient !== undefined && { avatar_gradient: data.avatarGradient }),
  }).eq("id", id);
  if (error) throw error;
  return getStudentById(id);
}

export async function deleteStudent(id: string) {
  if (!hasSupabaseConfig()) {
    const store = demoStore();
    const student = store.students.find((s) => s.id === id);
    store.students = store.students.filter((s) => s.id !== id);
    store.projects = store.projects.filter((p) => p.studentId !== id);
    store.certifications = store.certifications.filter((c) => c.studentId !== id);
    store.gallery = store.gallery.filter((g) => g.studentId !== id);
    if (student) addActivityAndNotify("student", "Élève supprimé", `${student.firstName} ${student.lastName}`);
    return;
  }
  const supabase = getSupabaseAdmin();
  const { data: student } = await supabase.from("students").select("first_name, last_name").eq("id", id).single();
  if (student) addActivityAndNotify("student", "Élève supprimé", `${student.first_name} ${student.last_name}`);
  await Promise.all([
    supabase.from("projects").delete().eq("student_id", id),
    supabase.from("certifications").delete().eq("student_id", id),
    supabase.from("gallery_items").delete().eq("student_id", id),
    supabase.from("students").delete().eq("id", id),
  ]);
}

export async function createProgram(data: { title: string; ageRange: string; level: ProgramLevel; description: string; priceMonthly: number; color: ProgramColor; tools?: string[]; image: string; duration?: string; objectives?: string; prerequisites?: string; schedule?: string; categoryId?: string }) {
  const safeImage = data.image || FALLBACK_IMAGE
  if (!hasSupabaseConfig()) {
    const program: Program = { id: `prog-${Date.now()}`, ...data, image: safeImage, tools: data.tools ?? [], duration: data.duration ?? "", objectives: data.objectives ?? "", prerequisites: data.prerequisites ?? "", schedule: data.schedule ?? "", category: undefined };
    demoStore().programs.push(program);
    return program;
  }
  const id = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now()
  const extended = { id, title: data.title, age_range: data.ageRange, level: data.level, description: data.description, price_monthly: data.priceMonthly, color: data.color, tools: data.tools ?? [], sort_order: 99, image: safeImage, duration: data.duration ?? "", objectives: data.objectives ?? "", prerequisites: data.prerequisites ?? "", schedule: data.schedule ?? "", category_id: data.categoryId || null }
  const { error } = await getSupabaseAdmin().from("programs").insert(extended)
  if (error) throw error
  return data;
}

export async function updateProgram(id: string, data: { title?: string; ageRange?: string; level?: ProgramLevel; description?: string; priceMonthly?: number; color?: ProgramColor; tools?: string[]; image?: string; duration?: string; objectives?: string; prerequisites?: string; schedule?: string; categoryId?: string }) {
  if (!hasSupabaseConfig()) {
    const store = demoStore()
    const idx = store.programs.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error("Programme introuvable")
    const program = store.programs[idx]
    if (data.title !== undefined) program.title = data.title
    if (data.ageRange !== undefined) program.ageRange = data.ageRange
    if (data.level !== undefined) program.level = data.level
    if (data.description !== undefined) program.description = data.description
    if (data.priceMonthly !== undefined) program.priceMonthly = data.priceMonthly
    if (data.color !== undefined) program.color = data.color
    if (data.tools !== undefined) program.tools = data.tools
    if (data.image !== undefined) program.image = data.image || FALLBACK_IMAGE
    if (data.duration !== undefined) program.duration = data.duration
    if (data.objectives !== undefined) program.objectives = data.objectives
    if (data.prerequisites !== undefined) program.prerequisites = data.prerequisites
    if (data.schedule !== undefined) program.schedule = data.schedule
    if (data.categoryId !== undefined) program.categoryId = data.categoryId
    return
  }
  const payload: Record<string, any> = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.ageRange !== undefined && { age_range: data.ageRange }),
    ...(data.level !== undefined && { level: data.level }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.priceMonthly !== undefined && { price_monthly: data.priceMonthly }),
    ...(data.color !== undefined && { color: data.color }),
    ...(data.tools !== undefined && { tools: data.tools }),
    ...(data.image !== undefined && { image: data.image || null }),
    ...(data.duration !== undefined && { duration: data.duration }),
    ...(data.objectives !== undefined && { objectives: data.objectives }),
    ...(data.prerequisites !== undefined && { prerequisites: data.prerequisites }),
    ...(data.schedule !== undefined && { schedule: data.schedule }),
    ...(data.categoryId !== undefined && { category_id: data.categoryId || null }),
  }
  const { error } = await getSupabaseAdmin().from("programs").update(payload).eq("id", id)
  if (error) throw error
}

export async function deleteProgram(id: string) {
  if (!hasSupabaseConfig()) {
    demoStore().programs = demoStore().programs.filter((p) => p.id !== id)
    return
  }
  const { error } = await getSupabaseAdmin().from("programs").delete().eq("id", id);
  if (error) throw error;
}

export async function createCategory(data: { name: string; slug: string; description?: string; color?: string }) {
  if (!hasSupabaseConfig()) {
    const category: Category = { id: `cat-${Date.now()}`, ...data, description: data.description ?? "", color: data.color ?? "sky" };
    demoStore().categories.push(category);
    return category;
  }
  const id = data.slug
  const { error } = await getSupabaseAdmin().from("categories").insert({ id, ...data, sort_order: 99 })
  if (error) throw error
  return { id, ...data } as Category;
}

export async function updateCategory(id: string, data: { name?: string; slug?: string; description?: string; color?: string }) {
  if (!hasSupabaseConfig()) {
    const store = demoStore()
    const idx = store.categories.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Catégorie introuvable")
    const cat = store.categories[idx]
    if (data.name !== undefined) cat.name = data.name
    if (data.slug !== undefined) cat.slug = data.slug
    if (data.description !== undefined) cat.description = data.description
    if (data.color !== undefined) cat.color = data.color
    return
  }
  const payload: Record<string, any> = {}
  if (data.name !== undefined) payload.name = data.name
  if (data.slug !== undefined) payload.slug = data.slug
  if (data.description !== undefined) payload.description = data.description
  if (data.color !== undefined) payload.color = data.color
  const { error } = await getSupabaseAdmin().from("categories").update(payload).eq("id", id)
  if (error) throw error
}

export async function deleteCategory(id: string) {
  if (!hasSupabaseConfig()) {
    demoStore().categories = demoStore().categories.filter((c) => c.id !== id)
    demoStore().programs.forEach((p) => { if (p.categoryId === id) delete p.categoryId })
    return
  }
  const { error } = await getSupabaseAdmin().from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function updateStudentPrivacy(id: string, isPublic: boolean) {
  if (!hasSupabaseConfig()) {
    const student = demoStore().students.find((item) => item.id === id);
    if (!student) throw new Error("Élève introuvable");
    student.isPublic = isPublic;
    return withPortfolio(student);
  }

  const { error } = await getSupabaseAdmin().from("students").update({ is_public: isPublic }).eq("id", id);
  if (error) throw error;
  return getStudentById(id);
}

export async function deleteProject(projectId: string) {
  if (!hasSupabaseConfig()) {
    const store = demoStore()
    store.projects = store.projects.filter((p) => p.id !== projectId)
    return
  }
  const { error } = await getSupabaseAdmin().from("projects").delete().eq("id", projectId)
  if (error) throw error
}

export async function deleteCertification(certId: string) {
  if (!hasSupabaseConfig()) {
    const store = demoStore()
    store.certifications = store.certifications.filter((c) => c.id !== certId)
    return
  }
  const { error } = await getSupabaseAdmin().from("certifications").delete().eq("id", certId)
  if (error) throw error
}

export async function deleteGalleryItem(itemId: string) {
  if (!hasSupabaseConfig()) {
    const store = demoStore()
    store.gallery = store.gallery.filter((g) => g.id !== itemId)
    return
  }
  const { error } = await getSupabaseAdmin().from("gallery_items").delete().eq("id", itemId)
  if (error) throw error
}

export async function addProject(studentId: string, payload: Omit<Project, "id" | "studentId">) {
  if (!hasSupabaseConfig()) {
    const project: Project = { ...payload, id: `proj-${Date.now()}`, studentId };
    demoStore().projects.unshift(project);
    return project;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("projects")
    .insert({
      id: crypto.randomUUID(),
      student_id: studentId,
      title: payload.title,
      description: payload.description,
      tags: payload.tags,
      status: payload.status,
      progress: payload.progress,
      date_label: payload.dateLabel,
      emoji: payload.emoji,
      gradient: payload.gradient,
      cover_image: payload.coverImage ?? null
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapProject(data);
}

export async function addCertification(studentId: string, payload: Omit<Certification, "id" | "studentId">) {
  if (!hasSupabaseConfig()) {
    const certification: Certification = { ...payload, id: `cert-${Date.now()}`, studentId };
    demoStore().certifications.unshift(certification);
    return certification;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("certifications")
    .insert({
      id: crypto.randomUUID(),
      student_id: studentId,
      title: payload.title,
      mention: payload.mention,
      date_label: payload.dateLabel,
      emoji: payload.emoji,
      gradient: payload.gradient,
      image_url: payload.imageUrl ?? null
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapCertification(data);
}

export async function addGalleryItem(studentId: string, payload: Omit<GalleryItem, "id" | "studentId">) {
  if (!hasSupabaseConfig()) {
    const item: GalleryItem = { ...payload, imageUrl: payload.imageUrl, id: `gal-${Date.now()}`, studentId };
    demoStore().gallery.unshift(item);
    return item;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("gallery_items")
    .insert({
      id: crypto.randomUUID(),
      student_id: studentId,
      label: payload.label,
      emoji: payload.emoji,
      gradient: payload.gradient,
      image_url: payload.imageUrl ?? null
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapGalleryItem(data);
}

export async function getCertificationById(certId: string) {
  const snapshot = await getDashboardSnapshot();
  for (const student of snapshot.students) {
    const cert = student.certifications.find((c) => c.id === certId);
    if (cert) return { certification: cert, student: { firstName: student.firstName, lastName: student.lastName, slug: student.slug } };
  }
  return null;
}

export async function batchUpdateStudentPrivacy(ids: string[], isPublic: boolean) {
  if (!hasSupabaseConfig()) {
    const store = demoStore();
    for (const id of ids) {
      const student = store.students.find((s) => s.id === id);
      if (student) student.isPublic = isPublic;
    }
    return;
  }
  const { error } = await getSupabaseAdmin()
    .from("students")
    .update({ is_public: isPublic })
    .in("id", ids);
  if (error) throw error;
}

export async function batchDeleteStudents(ids: string[]) {
  if (!hasSupabaseConfig()) {
    const store = demoStore();
    for (const id of ids) {
      const student = store.students.find((s) => s.id === id);
      if (student) addActivityAndNotify("student", "Élève supprimé", `${student.firstName} ${student.lastName}`);
    }
    store.students = store.students.filter((s) => !ids.includes(s.id));
    store.projects = store.projects.filter((p) => !ids.includes(p.studentId));
    store.certifications = store.certifications.filter((c) => !ids.includes(c.studentId));
    store.gallery = store.gallery.filter((g) => !ids.includes(g.studentId));
    return;
  }
  const supabase = getSupabaseAdmin();
  const { data: students } = await supabase.from("students").select("first_name, last_name").in("id", ids);
  if (students) {
    for (const s of students) addActivityAndNotify("student", "Élève supprimé", `${s.first_name} ${s.last_name}`);
  }
  await Promise.all([
    supabase.from("projects").delete().in("student_id", ids),
    supabase.from("certifications").delete().in("student_id", ids),
    supabase.from("gallery_items").delete().in("student_id", ids),
    supabase.from("students").delete().in("id", ids),
  ]);
}

export async function batchAcceptEnrollments(ids: string[]) {
  if (!hasSupabaseConfig()) {
    const store = demoStore();
    for (const id of ids) {
      const req = store.requests.find((r) => r.id === id);
      if (req && req.status === "pending") {
        req.status = "accepted";
        addActivityAndNotify("request", "Inscription acceptée", `${req.studentFirstName} ${req.studentLastName}`);
      }
    }
    return;
  }
  await getSupabaseAdmin().from("inscription_requests").update({ status: "accepted" }).in("id", ids);
}

export async function batchRejectEnrollments(ids: string[], rejectionMessage?: string) {
  if (!hasSupabaseConfig()) {
    const store = demoStore();
    for (const id of ids) {
      const req = store.requests.find((r) => r.id === id);
      if (req && req.status === "pending") {
        req.status = "refused";
        if (rejectionMessage) req.rejectionMessage = rejectionMessage;
        addActivityAndNotify("request", "Inscription refusée", `${req.studentFirstName} ${req.studentLastName}`);
      }
    }
    return;
  }
  const updateData: Record<string, any> = { status: "refused" };
  if (rejectionMessage) updateData.rejection_message = rejectionMessage;
  await getSupabaseAdmin().from("inscription_requests").update(updateData).in("id", ids);
}

// ─── Admin Users ─────────────────────────────────────────────

export async function verifyAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  if (!hasSupabaseConfig()) {
    const expectedEmail = process.env.ADMIN_EMAIL ?? "admin@elitecodeschool.com";
    const expectedPassword = process.env.ADMIN_PASSWORD ?? "admin123";
    if (email.toLowerCase() !== expectedEmail.toLowerCase() || password !== expectedPassword) return null;
    return { id: "admin-0", email: expectedEmail, firstName: "Super", lastName: "Admin", role: "super_admin", createdAt: new Date().toISOString() };
  }
  const { data, error } = await getSupabaseAdmin()
    .from("admin_users")
    .select("id, email, first_name, last_name, role, created_at")
    .ilike("email", email)
    .eq("password_hash", password)
    .maybeSingle()
  if (error || !data) return null
  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    createdAt: data.created_at,
  }
}

export async function updateAdminLastLogin(id: string) {
  if (!hasSupabaseConfig()) return
  await getSupabaseAdmin().from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", id)
}

export async function updateAdminPassword(id: string, newPassword: string) {
  if (!hasSupabaseConfig()) {
    const g = globalThis as any
    g.ecsAdminPassword = newPassword
    return
  }
  const { error } = await getSupabaseAdmin().from("admin_users").update({ password_hash: newPassword }).eq("id", id)
  if (error) throw error
}

const adminSeed: AdminUser[] = [
  {
    id: "admin-1",
    email: "admin@elitecode.ma",
    firstName: "Super",
    lastName: "Admin",
    role: "super_admin",
    createdAt: new Date("2024-01-01").toISOString(),
    lastLogin: new Date().toISOString(),
  },
];

export async function getAdminUsers(): Promise<AdminUser[]> {
  if (!hasSupabaseConfig()) {
    const store = demoStore() as any;
    if (!store.adminUsers) store.adminUsers = structuredClone(adminSeed);
    return store.adminUsers;
  }
  const { data, error } = await getSupabaseAdmin()
    .from("admin_users")
    .select("id, email, first_name, last_name, role, created_at, last_login")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data.map((row: any) => ({
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    role: row.role,
    createdAt: row.created_at,
    lastLogin: row.last_login ?? undefined,
  }));
}

export async function createAdminUser(data: { email: string; firstName: string; lastName: string; password: string }) {
  if (!hasSupabaseConfig()) {
    const store = demoStore() as any;
    if (!store.adminUsers) store.adminUsers = structuredClone(adminSeed);
    const exists = store.adminUsers.find((u: AdminUser) => u.email === data.email);
    if (exists) throw new Error("Cet email est déjà utilisé");
    const user: AdminUser = {
      id: `admin-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    store.adminUsers.push(user);
    addActivityAndNotify("request", "Admin créé", `${data.firstName} ${data.lastName} (${data.email})`);
    return user;
  }
  const { error } = await getSupabaseAdmin().from("admin_users").insert({
    id: crypto.randomUUID(),
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    role: "admin",
    password_hash: data.password,
  });
  if (error) {
    if (error.code === "23505") throw new Error("Cet email est déjà utilisé");
    throw error;
  }
  addActivityAndNotify("request", "Admin créé", `${data.firstName} ${data.lastName} (${data.email})`);
  return { id: "", email: data.email, firstName: data.firstName, lastName: data.lastName, role: "admin", createdAt: new Date().toISOString() };
}

export async function updateAdminUser(id: string, data: { firstName?: string; lastName?: string; email?: string; role?: string }) {
  if (!hasSupabaseConfig()) {
    const store = (demoStore() as any);
    if (!store.adminUsers) store.adminUsers = structuredClone(adminSeed);
    const user = store.adminUsers.find((u: AdminUser) => u.id === id);
    if (!user) throw new Error("Admin introuvable");
    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;
    if (data.email !== undefined) user.email = data.email;
    if (data.role !== undefined) user.role = data.role;
    addActivityAndNotify("request", "Admin modifié", `${user.firstName} ${user.lastName} (${user.email})`);
    return user;
  }
  const updateData: Record<string, any> = {};
  if (data.firstName !== undefined) updateData.first_name = data.firstName;
  if (data.lastName !== undefined) updateData.last_name = data.lastName;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.role !== undefined) updateData.role = data.role;
  const { error } = await getSupabaseAdmin().from("admin_users").update(updateData).eq("id", id);
  if (error) throw error;
  addActivityAndNotify("request", "Admin modifié", `${data.firstName ?? ""} ${data.lastName ?? ""} (${data.email ?? ""})`);
}

export async function deleteAdminUser(id: string) {
  if (!hasSupabaseConfig()) {
    const store = demoStore() as any;
    if (!store.adminUsers) store.adminUsers = structuredClone(adminSeed);
    const idx = store.adminUsers.findIndex((u: AdminUser) => u.id === id);
    if (idx === -1) throw new Error("Admin introuvable");
    const removed = store.adminUsers.splice(idx, 1)[0];
    addActivityAndNotify("request", "Admin supprimé", `${removed.firstName} ${removed.lastName} (${removed.email})`);
    return;
  }
  const { data: user } = await getSupabaseAdmin().from("admin_users").select("first_name, last_name, email").eq("id", id).single();
  const { error } = await getSupabaseAdmin().from("admin_users").delete().eq("id", id);
  if (error) throw error;
  if (user) addActivityAndNotify("request", "Admin supprimé", `${user.first_name} ${user.last_name} (${user.email})`);
}

// ─── Notifications ─────────────────────────────────────────

const notifSeed: AppNotification[] = [
  {
    id: "notif-1",
    type: "request",
    title: "Nouvelle inscription",
    description: "Nouvelle demande d'inscription reçue",
    read: false,
    createdAt: new Date().toISOString(),
  },
]

export async function getNotifications(): Promise<AppNotification[]> {
  if (!hasSupabaseConfig()) {
    const store = demoStore() as any
    if (!store.notifications) store.notifications = structuredClone(notifSeed)
    return store.notifications
  }
  const { data, error } = await getSupabaseAdmin()
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)
  if (error) throw error
  return data.map((row: any) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    read: row.read,
    createdAt: row.created_at,
  }))
}

export async function getUnreadNotificationCount(): Promise<number> {
  if (!hasSupabaseConfig()) {
    const store = demoStore() as any
    if (!store.notifications) store.notifications = structuredClone(notifSeed)
    return store.notifications.filter((n: AppNotification) => !n.read).length
  }
  const { count, error } = await getSupabaseAdmin()
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("read", false)
  if (error) throw error
  return count ?? 0
}

export async function createNotification(data: { type: string; title: string; description: string }) {
  if (!hasSupabaseConfig()) {
    const store = demoStore() as any
    if (!store.notifications) store.notifications = structuredClone(notifSeed)
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: data.type as AppNotification["type"],
      title: data.title,
      description: data.description,
      read: false,
      createdAt: new Date().toISOString(),
    }
    store.notifications.unshift(notif)
    return notif
  }
  const { data: notif, error } = await getSupabaseAdmin()
    .from("notifications")
    .insert({
      id: crypto.randomUUID(),
      type: data.type,
      title: data.title,
      description: data.description,
      read: false,
    })
    .select("*")
    .single()
  if (error) throw error
  return {
    id: notif.id,
    type: notif.type,
    title: notif.title,
    description: notif.description,
    read: notif.read,
    createdAt: notif.created_at,
  }
}

export async function markNotificationRead(id: string) {
  if (!hasSupabaseConfig()) {
    const store = demoStore() as any
    if (!store.notifications) store.notifications = structuredClone(notifSeed)
    const notif = store.notifications.find((n: AppNotification) => n.id === id)
    if (notif) notif.read = true
    return
  }
  const { error } = await getSupabaseAdmin()
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
  if (error) throw error
}

export async function markAllNotificationsRead() {
  if (!hasSupabaseConfig()) {
    const store = demoStore() as any
    if (!store.notifications) store.notifications = structuredClone(notifSeed)
    for (const n of store.notifications) n.read = true
    return
  }
  const { error } = await getSupabaseAdmin()
    .from("notifications")
    .update({ read: true })
    .eq("read", false)
  if (error) throw error
}

// ─── Settings ─────────────────────────────────────────────

const defaultSettings: AppSettings = {
  autoAcceptInscriptions: false,
  emailValidation: true,
  publicPortfoliosDefault: true,
  maintenanceMode: false,
  emailNotifications: true,
  sessionDurationHours: 8,
  minPasswordLength: 6,
  contactEmail: "contact@elitecode.ma",
}

export async function getSettings(): Promise<AppSettings> {
  if (!hasSupabaseConfig()) {
    const g = globalThis as any
    if (!g.ecsSettings) g.ecsSettings = structuredClone(defaultSettings)
    return g.ecsSettings
  }
  const { data, error } = await getSupabaseAdmin()
    .from("app_settings")
    .select("*")
    .maybeSingle()
  if (error || !data) return defaultSettings
  return {
    autoAcceptInscriptions: data.auto_accept_inscriptions ?? false,
    emailValidation: data.email_validation ?? true,
    publicPortfoliosDefault: data.public_portfolios_default ?? true,
    maintenanceMode: data.maintenance_mode ?? false,
    emailNotifications: data.email_notifications ?? true,
    sessionDurationHours: data.session_duration_hours ?? 8,
    minPasswordLength: data.min_password_length ?? 6,
    contactEmail: data.contact_email ?? "contact@elitecode.ma",
  }
}

export async function updateSettings(data: Partial<AppSettings>) {
  if (!hasSupabaseConfig()) {
    const g = globalThis as any
    if (!g.ecsSettings) g.ecsSettings = structuredClone(defaultSettings)
    Object.assign(g.ecsSettings, data)
    return
  }
  const payload: Record<string, any> = {}
  if (data.autoAcceptInscriptions !== undefined) payload.auto_accept_inscriptions = data.autoAcceptInscriptions
  if (data.emailValidation !== undefined) payload.email_validation = data.emailValidation
  if (data.publicPortfoliosDefault !== undefined) payload.public_portfolios_default = data.publicPortfoliosDefault
  if (data.maintenanceMode !== undefined) payload.maintenance_mode = data.maintenanceMode
  if (data.emailNotifications !== undefined) payload.email_notifications = data.emailNotifications
  if (data.sessionDurationHours !== undefined) payload.session_duration_hours = data.sessionDurationHours
  if (data.minPasswordLength !== undefined) payload.min_password_length = data.minPasswordLength
  if (data.contactEmail !== undefined) payload.contact_email = data.contactEmail

  const { data: existing } = await getSupabaseAdmin()
    .from("app_settings")
    .select("id")
    .maybeSingle()

  if (existing) {
    const { error } = await getSupabaseAdmin()
      .from("app_settings")
      .update(payload)
      .eq("id", existing.id)
    if (error) throw error
  } else {
    const { error } = await getSupabaseAdmin()
      .from("app_settings")
      .insert(payload)
    if (error) throw error
  }
}

// ─── Parents ──────────────────────────────────────────────

const parentSeed: Parent[] = [
  {
    id: "parent-1",
    email: "parent.youssef@example.com",
    firstName: "Nawal",
    lastName: "Alaoui",
    phone: "+212 6XX XXX XXX",
    secretHash: hashSecret("YOUSEEF-2026"),
    studentId: "stu-youssef",
    createdAt: new Date("2025-09-01").toISOString(),
  },
  {
    id: "parent-2",
    email: "parent.mariam@example.com",
    firstName: "Hassan",
    lastName: "El Fassi",
    phone: "+212 6XX XXX XXX",
    secretHash: hashSecret("MARIAM-2026"),
    studentId: "stu-mariam",
    createdAt: new Date("2025-09-01").toISOString(),
  },
  {
    id: "parent-3",
    email: "parent.adam@example.com",
    firstName: "Fatima",
    lastName: "Berrada",
    phone: "+212 6XX XXX XXX",
    secretHash: hashSecret("ADAM-2026"),
    studentId: "stu-adam",
    createdAt: new Date("2025-09-01").toISOString(),
  },
  {
    id: "parent-4",
    email: "parent.sarah@example.com",
    firstName: "Karim",
    lastName: "Benali",
    phone: "+212 6XX XXX XXX",
    secretHash: hashSecret("SARAH-2026"),
    studentId: "stu-sarah",
    createdAt: new Date("2025-09-01").toISOString(),
  },
  {
    id: "parent-5",
    email: "parent.aymane@example.com",
    firstName: "Samira",
    lastName: "Idrissi",
    phone: "+212 6XX XXX XXX",
    secretHash: hashSecret("AYMANE-2026"),
    studentId: "stu-aymane",
    createdAt: new Date("2025-09-01").toISOString(),
  },
  {
    id: "parent-6",
    email: "parent.ines@example.com",
    firstName: "Mohamed",
    lastName: "El Mouden",
    phone: "+212 6XX XXX XXX",
    secretHash: hashSecret("INES-2026"),
    studentId: "stu-ines",
    createdAt: new Date("2025-09-01").toISOString(),
  },
  {
    id: "parent-7",
    email: "parent.oumaima@example.com",
    firstName: "Nadia",
    lastName: "Zerhouni",
    phone: "+212 6XX XXX XXX",
    secretHash: hashSecret("OUMAIMA-2026"),
    studentId: "stu-oumaima",
    createdAt: new Date("2025-09-01").toISOString(),
  },
  {
    id: "parent-8",
    email: "parent.rayan@example.com",
    firstName: "Rachid",
    lastName: "Ouali",
    phone: "+212 6XX XXX XXX",
    secretHash: hashSecret("RAYAN-2026"),
    studentId: "stu-rayan",
    createdAt: new Date("2025-09-01").toISOString(),
  },
]

export async function getParentByLogin(email: string, secret: string): Promise<{ parent: Parent; student: StudentPortfolio } | null> {
  const secretHash = hashSecret(secret)

  if (!hasSupabaseConfig()) {
    const store = demoStore() as any
    if (!store.parents) store.parents = structuredClone(parentSeed)
    const parent = store.parents.find((p: Parent) => p.email.toLowerCase() === email.toLowerCase() && p.secretHash === secretHash)
    if (!parent) return null
    const student = demoStore().students.find((s) => s.id === parent.studentId)
    if (!student) return null
    return { parent, student: withPortfolio(student) }
  }

  const { data: parentData, error: parentError } = await getSupabaseAdmin()
    .from("parents")
    .select("*")
    .ilike("email", email)
    .eq("secret_hash", secretHash)
    .maybeSingle()

  if (parentError || !parentData) return null

  const parent: Parent = {
    id: parentData.id,
    email: parentData.email,
    firstName: parentData.first_name,
    lastName: parentData.last_name,
    phone: parentData.phone,
    secretHash: parentData.secret_hash,
    studentId: parentData.student_id,
    createdAt: parentData.created_at,
  }

  const programs = await getPrograms()
  const { data: studentData, error: studentError } = await getSupabaseAdmin()
    .from("students")
    .select("*, projects(*), certifications(*), gallery_items(*)")
    .eq("id", parent.studentId)
    .maybeSingle()

  if (studentError || !studentData) return null

  return { parent, student: mapStudentPortfolio(studentData, programs) }
}

export async function createParent(data: {
  email: string
  firstName: string
  lastName: string
  phone: string
  secret: string
  studentId: string
}): Promise<Parent> {
  const secretHash = hashSecret(data.secret)

  if (!hasSupabaseConfig()) {
    const store = demoStore() as any
    if (!store.parents) store.parents = structuredClone(parentSeed)
    const parent: Parent = {
      id: `parent-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      secretHash,
      studentId: data.studentId,
      createdAt: new Date().toISOString(),
    }
    store.parents.push(parent)
    return parent
  }

  const { data: created, error } = await getSupabaseAdmin()
    .from("parents")
    .insert({
      id: crypto.randomUUID(),
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      secret_hash: secretHash,
      student_id: data.studentId,
    })
    .select("*")
    .single()

  if (error) throw error

  return {
    id: created.id,
    email: created.email,
    firstName: created.first_name,
    lastName: created.last_name,
    phone: created.phone,
    secretHash: created.secret_hash,
    studentId: created.student_id,
    createdAt: created.created_at,
  }
}

// ─── Admin Profile ─────────────────────────────────────────

export async function getAdminProfile(id: string): Promise<AdminUser | null> {
  if (!hasSupabaseConfig()) {
    const store = demoStore() as any
    if (!store.adminUsers) store.adminUsers = structuredClone(adminSeed)
    return store.adminUsers.find((u: AdminUser) => u.id === id) ?? null
  }
  const { data, error } = await getSupabaseAdmin()
    .from("admin_users")
    .select("id, email, first_name, last_name, role, created_at, last_login")
    .eq("id", id)
    .maybeSingle()
  if (error || !data) return null
  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    createdAt: data.created_at,
    lastLogin: data.last_login ?? undefined,
  }
}

export async function updateAdminProfile(id: string, data: { firstName?: string; lastName?: string; email?: string }) {
  if (!hasSupabaseConfig()) {
    const store = demoStore() as any
    if (!store.adminUsers) store.adminUsers = structuredClone(adminSeed)
    const user = store.adminUsers.find((u: AdminUser) => u.id === id)
    if (!user) throw new Error("Admin introuvable")
    if (data.firstName !== undefined) user.firstName = data.firstName
    if (data.lastName !== undefined) user.lastName = data.lastName
    if (data.email !== undefined) user.email = data.email
    return user
  }
  const payload: Record<string, any> = {}
  if (data.firstName !== undefined) payload.first_name = data.firstName
  if (data.lastName !== undefined) payload.last_name = data.lastName
  if (data.email !== undefined) payload.email = data.email
  const { error } = await getSupabaseAdmin().from("admin_users").update(payload).eq("id", id)
  if (error) throw error
}

function mapRequest(row: any): InscriptionRequest {
  return {
    id: row.id,
    studentFirstName: row.student_first_name,
    studentLastName: row.student_last_name,
    age: row.age,
    schoolLevel: row.school_level ?? undefined,
    programId: row.program_id,
    parentFirstName: row.parent_first_name ?? "",
    parentLastName: row.parent_last_name ?? "",
    parentPhone: row.parent_phone,
    parentEmail: row.parent_email,
    message: row.message ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    adminNotes: row.admin_notes ?? undefined,
    rejectionMessage: row.rejection_message ?? undefined
  };
}

function mapProject(row: any): Project {
  return {
    id: row.id,
    studentId: row.student_id,
    title: row.title,
    description: row.description,
    tags: row.tags ?? [],
    status: row.status,
    progress: row.progress,
    dateLabel: row.date_label,
    emoji: row.emoji,
    gradient: row.gradient,
    coverImage: row.cover_image ?? undefined
  };
}

function mapCertification(row: any): Certification {
  return {
    id: row.id,
    studentId: row.student_id,
    title: row.title,
    mention: row.mention,
    dateLabel: row.date_label,
    emoji: row.emoji,
    gradient: row.gradient,
    imageUrl: row.image_url ?? undefined
  };
}

function mapGalleryItem(row: any): GalleryItem {
  return {
    id: row.id,
    studentId: row.student_id,
    label: row.label,
    emoji: row.emoji,
    gradient: row.gradient,
    imageUrl: row.image_url ?? undefined
  };
}

function mapStudentPortfolio(row: any, programs: Program[]): StudentPortfolio {
  const student = {
    id: row.id,
    slug: row.slug,
    firstName: row.first_name,
    lastName: row.last_name,
    age: row.age,
    avatar: row.avatar,
    avatarGradient: row.avatar_gradient,
    programId: row.program_id,
    levelLabel: row.level_label,
    joinDateLabel: row.join_date_label,
    hours: row.hours,
    isPublic: row.is_public,
    parentEmail: row.parent_email,
    parentSecretHash: row.parent_secret_hash,
    createdAt: row.created_at
  };

  return {
    ...student,
    program: programs.find((program) => program.id === student.programId),
    projects: (row.projects ?? []).map(mapProject),
    certifications: (row.certifications ?? []).map(mapCertification),
    gallery: (row.gallery_items ?? []).map(mapGalleryItem)
  };
}
