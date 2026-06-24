import { NextResponse } from "next/server";
import { getParentStudentId, isAdminAuthenticated } from "@/lib/auth";
import { getStudentById, getPrograms } from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") || (await getParentStudentId()) || "";

    if (!studentId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const student = await getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Élève introuvable" }, { status: 404 });
    }

    const programs = await getPrograms();
    const program = programs.find((p) => p.id === student.programId);

    const doneProjects = student.projects.filter((p) => p.status === "done");
    const inProgress = student.projects.filter((p) => p.status === "progress");
    const hours = student.hours;

    const missions = [
      { id: "m1", title: "Premier projet", description: "Complète ton premier projet", icon: "🚀", xp: 50, done: doneProjects.length >= 1 },
      { id: "m2", title: "5 heures de code", description: "Atteins 5 heures de code", icon: "⏱️", xp: 30, done: hours >= 5 },
      { id: "m3", title: "3 projets terminés", description: "Termine 3 projets", icon: "🏆", xp: 100, done: doneProjects.length >= 3 },
      { id: "m4", title: "Première certification", description: "Obtiens ta première certification", icon: "🎓", xp: 75, done: student.certifications.length >= 1 },
      { id: "m5", title: "Progression 50%", description: "Atteins 50% de progression globale", icon: "📈", xp: 60, done: false },
      { id: "m6", title: "Expert en code", description: "Atteins 20 heures de code", icon: "💻", xp: 200, done: hours >= 20 },
      { id: "m7", title: "5 certifications", description: "Obtiens 5 certifications", icon: "📜", xp: 150, done: student.certifications.length >= 5 },
      { id: "m8", title: "Portfolio complet", description: "Ajoute un projet, une certification et une galerie", icon: "🌟", xp: 100, done: doneProjects.length >= 1 && student.certifications.length >= 1 && student.gallery.length >= 1 },
    ];

    const badges = [
      { id: "b1", name: "Débutant", icon: "🌱", earned: true, description: "Premier pas dans l'aventure" },
      { id: "b2", name: "Constructeur", icon: "🔨", earned: doneProjects.length >= 1, description: "Premier projet complété" },
      { id: "b3", name: "Persévérant", icon: "💪", earned: hours >= 5, description: "5 heures de code" },
      { id: "b4", name: "Champion", icon: "🏅", earned: doneProjects.length >= 3, description: "3 projets terminés" },
      { id: "b5", name: "Certifié", icon: "📜", earned: student.certifications.length >= 1, description: "Première certification" },
      { id: "b6", name: "Créatif", icon: "🎨", earned: student.gallery.length >= 1, description: "Première oeuvre dans la galerie" },
      { id: "b7", name: "Dévoué", icon: "🔥", earned: hours >= 20, description: "20 heures de code" },
      { id: "b8", name: "Expert", icon: "👑", earned: student.certifications.length >= 3, description: "3 certifications obtenues" },
    ];

    const totalXp = missions.filter((m) => m.done).reduce((acc, m) => acc + m.xp, 0);
    const nextLevelXp = 200;
    const level = Math.floor(totalXp / nextLevelXp) + 1;
    const xpInLevel = totalXp % nextLevelXp;
    const xpProgress = Math.round((xpInLevel / nextLevelXp) * 100);

    const recentActivity = [
      ...student.projects.map((p) => ({ date: p.dateLabel, text: `${p.emoji} Projet: ${p.title}`, type: "project" as const })),
      ...student.certifications.map((c) => ({ date: c.dateLabel, text: `${c.emoji} Certificat: ${c.title}`, type: "certification" as const })),
      ...student.gallery.map((g) => ({ date: "", text: `${g.emoji} Galerie: ${g.label}`, type: "gallery" as const })),
    ].filter((a) => a.date).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

    return NextResponse.json({
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        avatar: student.avatar,
        avatarGradient: student.avatarGradient,
        levelLabel: student.levelLabel,
        hours: student.hours,
        program: program ?? null,
      },
      stats: {
        projectsDone: doneProjects.length,
        projectsInProgress: inProgress.length,
        certifications: student.certifications.length,
        gallery: student.gallery.length,
        totalHours: student.hours,
      },
      level,
      xp: { current: totalXp, nextLevel: nextLevelXp, xpInLevel, progress: xpProgress },
      missions,
      badges,
      recentActivity,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
