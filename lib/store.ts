import {
  certifications as seedCertifications,
  galleryItems as seedGalleryItems,
  inscriptionRequests as seedRequests,
  programs as seedPrograms,
  projects as seedProjects,
  students as seedStudents,
  teachers as seedTeachers
} from "@/data/seed";
import { hashSecret } from "@/lib/auth";
import { hasSupabaseConfig, getSupabaseAdmin } from "@/lib/supabase";
import type {
  Certification,
  DashboardSnapshot,
  GalleryItem,
  InscriptionRequest,
  Program,
  Project,
  Student,
  StudentPortfolio,
  Teacher
} from "@/lib/types";
import { slugify } from "@/lib/utils";

type DemoStore = {
  requests: InscriptionRequest[];
  students: Student[];
  projects: Project[];
  certifications: Certification[];
  gallery: GalleryItem[];
  teachers: Teacher[];
};

const globalForStore = globalThis as unknown as { eliteCodeSchoolStore?: DemoStore };

function demoStore() {
  if (!globalForStore.eliteCodeSchoolStore) {
    globalForStore.eliteCodeSchoolStore = {
      requests: structuredClone(seedRequests),
      students: structuredClone(seedStudents),
      projects: structuredClone(seedProjects),
      certifications: structuredClone(seedCertifications),
      gallery: structuredClone(seedGalleryItems),
      teachers: structuredClone(seedTeachers)
    };
  }

  return globalForStore.eliteCodeSchoolStore;
}

function withPortfolio(student: Student, programs: Program[] = seedPrograms): StudentPortfolio {
  const store = demoStore();
  return {
    ...student,
    program: programs.find((program) => program.id === student.programId),
    projects: store.projects.filter((project) => project.studentId === student.id),
    certifications: store.certifications.filter((certification) => certification.studentId === student.id),
    gallery: store.gallery.filter((item) => item.studentId === student.id)
  };
}

export async function getPrograms(): Promise<Program[]> {
  if (!hasSupabaseConfig()) return seedPrograms;

  const { data, error } = await getSupabaseAdmin().from("programs").select("*").order("sort_order");
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    ageRange: row.age_range,
    level: row.level,
    description: row.description,
    tools: row.tools ?? [],
    priceMonthly: row.price_monthly,
    icon: row.icon,
    color: row.color
  }));
}

export async function createInscriptionRequest(payload: Omit<InscriptionRequest, "id" | "status" | "createdAt">) {
  if (!hasSupabaseConfig()) {
    const request: InscriptionRequest = {
      ...payload,
      id: `req-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    demoStore().requests.unshift(request);
    return request;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("inscription_requests")
    .insert({
      student_first_name: payload.studentFirstName,
      student_last_name: payload.studentLastName,
      age: payload.age,
      school_level: payload.schoolLevel,
      program_id: payload.programId,
      parent_phone: payload.parentPhone,
      parent_email: payload.parentEmail,
      message: payload.message
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRequest(data);
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!hasSupabaseConfig()) {
    const store = demoStore();
    return {
      requests: store.requests,
      students: store.students.map((student) => withPortfolio(student)),
      teachers: store.teachers,
      programs: seedPrograms
    };
  }

  const supabase = getSupabaseAdmin();
  const [requestsResult, studentsResult, teachersResult, programs] = await Promise.all([
    supabase.from("inscription_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("students").select("*, projects(*), certifications(*), gallery_items(*)").order("created_at", { ascending: false }),
    supabase.from("teachers").select("*").order("created_at", { ascending: false }),
    getPrograms()
  ]);

  if (requestsResult.error) throw requestsResult.error;
  if (studentsResult.error) throw studentsResult.error;
  if (teachersResult.error) throw teachersResult.error;

  return {
    requests: requestsResult.data.map(mapRequest),
    students: studentsResult.data.map((row) => mapStudentPortfolio(row, programs)),
    teachers: teachersResult.data.map(mapTeacher),
    programs
  };
}

export async function createTeacher(payload: { fullName: string; email: string; specialty?: string }) {
  const teacherSecret = `TCH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const teacher: Teacher = {
    id: `teacher-${Date.now()}`,
    fullName: payload.fullName,
    email: payload.email,
    specialty: payload.specialty,
    secretHash: hashSecret(teacherSecret),
    status: "active",
    createdAt: new Date().toISOString()
  };

  if (!hasSupabaseConfig()) {
    demoStore().teachers.unshift(teacher);
    return { teacher, teacherSecret };
  }

  const { data, error } = await getSupabaseAdmin()
    .from("teachers")
    .insert({
      full_name: payload.fullName,
      email: payload.email,
      specialty: payload.specialty,
      secret_hash: hashSecret(teacherSecret),
      status: "active"
    })
    .select("*")
    .single();

  if (error) throw error;
  return { teacher: mapTeacher(data), teacherSecret };
}

export async function getTeacherByLogin(email: string, secret: string) {
  const secretHash = hashSecret(secret);

  if (!hasSupabaseConfig()) {
    return (
      demoStore().teachers.find(
        (teacher) => teacher.email.toLowerCase() === email.toLowerCase() && teacher.secretHash === secretHash && teacher.status === "active"
      ) ?? null
    );
  }

  const { data, error } = await getSupabaseAdmin()
    .from("teachers")
    .select("*")
    .ilike("email", email)
    .eq("secret_hash", secretHash)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  return data ? mapTeacher(data) : null;
}

export async function getTeacherDashboard(teacherId: string) {
  if (!hasSupabaseConfig()) {
    const store = demoStore();
    const teacher = store.teachers.find((item) => item.id === teacherId && item.status === "active");
    if (!teacher) return null;
    return {
      teacher,
      students: store.students.map((student) => withPortfolio(student))
    };
  }

  const supabase = getSupabaseAdmin();
  const [teacherResult, studentsResult, programs] = await Promise.all([
    supabase.from("teachers").select("*").eq("id", teacherId).eq("status", "active").maybeSingle(),
    supabase.from("students").select("*, projects(*), certifications(*), gallery_items(*)").order("created_at", { ascending: false }),
    getPrograms()
  ]);

  if (teacherResult.error) throw teacherResult.error;
  if (studentsResult.error) throw studentsResult.error;
  if (!teacherResult.data) return null;

  return {
    teacher: mapTeacher(teacherResult.data),
    students: studentsResult.data.map((row) => mapStudentPortfolio(row, programs))
  };
}

export async function acceptInscriptionRequest(id: string) {
  const parentSecret = `ECS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  if (!hasSupabaseConfig()) {
    const store = demoStore();
    const request = store.requests.find((item) => item.id === id);
    if (!request) throw new Error("Demande introuvable");
    request.status = "accepted";

    const student: Student = {
      id: `stu-${Date.now()}`,
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
    return { student: withPortfolio(student), parentSecret };
  }

  const supabase = getSupabaseAdmin();
  const { data: request, error: requestError } = await supabase
    .from("inscription_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (requestError) throw requestError;

  const { data: student, error: studentError } = await supabase
    .from("students")
    .insert({
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

  await supabase.from("inscription_requests").update({ status: "accepted" }).eq("id", id);
  return { student: mapStudentPortfolio({ ...student, projects: [], certifications: [], gallery_items: [] }, await getPrograms()), parentSecret };
}

export async function refuseInscriptionRequest(id: string) {
  if (!hasSupabaseConfig()) {
    const request = demoStore().requests.find((item) => item.id === id);
    if (!request) throw new Error("Demande introuvable");
    request.status = "refused";
    return request;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("inscription_requests")
    .update({ status: "refused" })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
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

export async function addProject(studentId: string, payload: Omit<Project, "id" | "studentId">) {
  if (!hasSupabaseConfig()) {
    const project: Project = { ...payload, id: `proj-${Date.now()}`, studentId };
    demoStore().projects.unshift(project);
    return project;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("projects")
    .insert({
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
    if (cert) return { certification: cert, student: { firstName: student.firstName, lastName: student.lastName } };
  }
  return null;
}

function mapRequest(row: any): InscriptionRequest {
  return {
    id: row.id,
    studentFirstName: row.student_first_name,
    studentLastName: row.student_last_name,
    age: row.age,
    schoolLevel: row.school_level ?? undefined,
    programId: row.program_id,
    parentPhone: row.parent_phone,
    parentEmail: row.parent_email,
    message: row.message ?? undefined,
    status: row.status,
    createdAt: row.created_at
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

function mapTeacher(row: any): Teacher {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    specialty: row.specialty ?? undefined,
    secretHash: row.secret_hash,
    status: row.status,
    createdAt: row.created_at
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
