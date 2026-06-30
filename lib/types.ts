export type ProgramLevel = "debutant" | "intermediaire" | "avance";
export type ProgramColor = "accent" | "cyan" | "amber" | "green" | "rose" | "purple";
export type RequestStatus = "pending" | "accepted" | "refused";
export type ProjectStatus = "done" | "progress" | "planned" | "pending";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
};

export type Program = {
  id: string;
  title: string;
  ageRange: string;
  level: ProgramLevel;
  description: string;
  tools: string[];
  priceMonthly?: number;
  color: ProgramColor;
  image: string;
  duration?: string;
  objectives?: string;
  prerequisites?: string;
  schedule?: string;
  categoryId?: string;
  category?: Category;
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
  adminNotes?: string;
  rejectionMessage?: string;
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

export type DashboardSnapshot = {
  requests: InscriptionRequest[];
  students: StudentPortfolio[];
  programs: Program[];
  categories: Category[];
};

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "admin";
  createdAt: string;
  lastLogin?: string;
};

export type AppSettings = {
  autoAcceptInscriptions: boolean
  emailValidation: boolean
  publicPortfoliosDefault: boolean
  maintenanceMode: boolean
  emailNotifications: boolean
  sessionDurationHours: number
  minPasswordLength: number
  contactEmail: string
}

export type AppNotification = {
  id: string;
  type: "student" | "project" | "certification" | "request" | "contact";
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
};
