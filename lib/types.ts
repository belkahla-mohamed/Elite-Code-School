export type ProgramLevel = "debutant" | "intermediaire" | "avance";
export type RequestStatus = "pending" | "accepted" | "refused";
export type ProjectStatus = "done" | "progress" | "planned";
export type TeacherStatus = "active" | "inactive";

export type Program = {
  id: string;
  title: string;
  ageRange: string;
  level: ProgramLevel;
  description: string;
  tools: string[];
  priceMonthly?: number;
  icon: string;
  color: "accent" | "cyan" | "amber" | "green" | "rose" | "purple";
};

export type InscriptionRequest = {
  id: string;
  studentFirstName: string;
  studentLastName: string;
  age: number;
  schoolLevel?: string;
  programId: string;
  parentPhone: string;
  parentEmail: string;
  message?: string;
  status: RequestStatus;
  createdAt: string;
};

export type Project = {
  id: string;
  studentId: string;
  title: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  progress: number;
  dateLabel: string;
  emoji: string;
  gradient: string;
  coverImage?: string;
};

export type Certification = {
  id: string;
  studentId: string;
  title: string;
  mention: string;
  dateLabel: string;
  emoji: string;
  gradient: string;
  imageUrl?: string;
};

export type GalleryItem = {
  id: string;
  studentId: string;
  label: string;
  emoji: string;
  gradient: string;
  imageUrl?: string;
};

export type Student = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  age: number;
  avatar: string;
  avatarGradient: string;
  programId: string;
  levelLabel: string;
  joinDateLabel: string;
  hours: number;
  isPublic: boolean;
  parentEmail: string;
  parentSecretHash: string;
  createdAt: string;
};

export type StudentPortfolio = Student & {
  program?: Program;
  projects: Project[];
  certifications: Certification[];
  gallery: GalleryItem[];
};

export type Teacher = {
  id: string;
  fullName: string;
  email: string;
  specialty?: string;
  secretHash: string;
  status: TeacherStatus;
  createdAt: string;
};

export type DashboardSnapshot = {
  requests: InscriptionRequest[];
  students: StudentPortfolio[];
  teachers: Teacher[];
  programs: Program[];
};
