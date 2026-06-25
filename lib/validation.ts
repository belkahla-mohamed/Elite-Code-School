import { z } from "zod";

export const inscriptionSchema = z.object({
  studentFirstName: z.string().trim().min(2, "Prénom requis"),
  studentLastName: z.string().trim().min(2, "Nom requis"),
  age: z.coerce.number().int().min(7, "Âge minimum 7 ans").max(17, "Âge maximum 17 ans"),
  schoolLevel: z.string().trim().optional(),
  programId: z.string().trim().min(1, "Formation requise"),
  parentPhone: z.string().trim().min(8, "Téléphone requis"),
  parentEmail: z.string().trim().email("Email invalide"),
  message: z.string().trim().optional()
});

export const projectSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(5),
  tags: z.array(z.string().trim().min(1)).default([]),
  status: z.enum(["done", "progress", "planned"]).default("progress"),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  dateLabel: z.string().trim().default("En cours"),
  emoji: z.string().trim().default("💼"),
  gradient: z.string().trim().default("linear-gradient(135deg,#4f46e5,#818cf8)"),
  coverImage: z.string().trim().optional(),
});

export const certificationSchema = z.object({
  title: z.string().trim().min(2),
  mention: z.string().trim().default("Validé"),
  dateLabel: z.string().trim().default("Cette année"),
  emoji: z.string().trim().default("🏅"),
  gradient: z.string().trim().default("linear-gradient(135deg,#f59e0b,#f97316)"),
  imageUrl: z.string().trim().optional(),
});

export const gallerySchema = z.object({
  label: z.string().trim().min(2),
  emoji: z.string().trim().default("📸"),
  gradient: z.string().trim().default("linear-gradient(135deg,#06b6d4,#0ea5e9)"),
  imageUrl: z.string().trim().optional(),
});

export const teacherSchema = z.object({
  fullName: z.string().trim().min(2, "Nom teacher requis"),
  email: z.string().trim().email("Email teacher invalide"),
  specialty: z.string().trim().optional()
});
