import { z } from "zod";
import "@/lib/zod-fr";

export const inscriptionSchema = z.object({
  studentFirstName: z.string().trim().min(2, "Prénom requis"),
  studentLastName: z.string().trim().min(2, "Nom requis"),
  age: z.coerce.number().int().min(7, "Âge minimum 7 ans").max(17, "Âge maximum 17 ans"),
  schoolLevel: z.string().trim().optional(),
  programId: z.string().trim().min(1, "Formation requise"),
  parentFirstName: z.string().trim().min(2, "Prénom du parent requis"),
  parentLastName: z.string().trim().min(2, "Nom du parent requis"),
  parentPhone: z.string().trim().min(8, "Téléphone requis"),
  parentEmail: z.string().trim().email("Email invalide"),
  message: z.string().trim().optional()
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Le titre du projet doit contenir au moins 2 caractères"),
  description: z.string().trim().min(5, "La description doit contenir au moins 5 caractères"),
  tags: z.array(z.string().trim().min(1, "Tag invalide")).default([]),
  status: z.enum(["completed", "in_progress"], { errorMap: () => ({ message: "Statut invalide" }) }).default("in_progress"),
  progress: z.coerce.number().int().min(0, "La progression doit être entre 0 et 100").max(100, "La progression doit être entre 0 et 100").default(0),
  dateLabel: z.string().trim().default("En cours"),
  emoji: z.string().trim().default("💼"),
  gradient: z.string().trim().default("linear-gradient(135deg,#4f46e5,#818cf8)"),
  coverImage: z.string().trim().optional(),
  demoUrl: z.string().trim().optional().refine((v) => !v || /^https?:\/\//.test(v), "Lien de démo invalide"),
});

export const certificationSchema = z.object({
  title: z.string().trim().min(2, "Le titre du certificat doit contenir au moins 2 caractères"),
  mention: z.string().trim().default("Validé"),
  dateLabel: z.string().trim().default("Cette année"),
  emoji: z.string().trim().default("🏅"),
  gradient: z.string().trim().default("linear-gradient(135deg,#f59e0b,#f97316)"),
  imageUrl: z.string().trim().optional(),
  serialCode: z.string().trim().optional(),
  issueDate: z.string().trim().optional(),
});export const gallerySchema = z.object({
  label: z.string().trim().min(2, "Le libellé doit contenir au moins 2 caractères"),
  emoji: z.string().trim().default("📸"),
  gradient: z.string().trim().default("linear-gradient(135deg,#06b6d4,#0ea5e9)"),
  imageUrl: z.string().trim().optional(),
});

export const blogViewSchema = z.object({
  slug: z.string().trim().min(1, "Slug requis").max(120, "Slug trop long (120 caractères maximum)").regex(/^[a-z0-9-]+$/, "Slug invalide"),
});

export const followRequestSchema = z.object({
  targetId: z.string().trim().min(1, "Élève requis"),
});

export const studentRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("certificate"),
    title: z.string().trim().min(3, "Titre du certificat requis"),
    description: z.string().trim().min(10, "Explique ta demande (au moins 10 caractères)"),
    certificateTitle: z.string().trim().optional(),
    certificateMention: z.string().trim().optional(),
    certificateDateLabel: z.string().trim().optional(),
    certificateEmoji: z.string().trim().optional(),
    certificateGradient: z.string().trim().optional(),
  }),
  z.object({
    type: z.literal("hours"),
    title: z.string().trim().min(3, "Titre de la demande requis"),
    description: z.string().trim().min(10, "Décris le justificatif (ex : projet bonus réalisé à la maison)"),
    hours: z.coerce.number().int().min(1, "Heures à ajouter (minimum 1)").max(500, "Maximum 500 heures"),
  }),
]);

export const studentMessageSchema = z.object({
  message: z.string().trim().min(3, "Message trop court").max(1000, "Message trop long (1000 caractères max)"),
});

export const studentAlertSchema = z.object({
  title: z.string().trim().min(3, "Titre requis"),
  description: z.string().trim().min(5, "Description requise"),
  emoji: z.string().trim().default("📣"),
  studentId: z.string().trim().default("all"),
});

export const requestActionSchema = z.object({
  action: z.enum(["approve", "refuse"]),
  adminNotes: z.string().trim().optional(),
});

export const messageReplySchema = z.object({
  reply: z.string().trim().min(1, "Réponse requise").max(1000, "Réponse trop longue (1000 caractères maximum)"),
});
