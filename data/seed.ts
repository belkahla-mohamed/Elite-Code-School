import { hashSecret } from "@/lib/auth";
import type { Certification, GalleryItem, InscriptionRequest, Program, Project, Student, Teacher } from "@/lib/types";

export const programs: Program[] = [
  {
    id: "scratch-creativite",
    title: "Scratch & Créativité",
    ageRange: "7–10 ans",
    level: "debutant",
    description: "Jeux, histoires animées et premières notions d'algorithmique avec Scratch et Micro:bit.",
    tools: ["Scratch", "Micro:bit"],
    priceMonthly: 650,
    icon: "🧩",
    color: "accent"
  },
  {
    id: "robotique-mbot",
    title: "Robotique mBot",
    ageRange: "10–14 ans",
    level: "intermediaire",
    description: "Capteurs, moteurs, logique robotique et préparation aux compétitions éducatives.",
    tools: ["mBot", "Arduino", "Thymio"],
    priceMonthly: 750,
    icon: "🤖",
    color: "cyan"
  },
  {
    id: "arduino-iot",
    title: "Arduino & IoT",
    ageRange: "11–15 ans",
    level: "intermediaire",
    description: "Électronique, objets connectés, Raspberry Pi et prototypes intelligents.",
    tools: ["Arduino", "Raspberry Pi", "Dadabit AI"],
    priceMonthly: 850,
    icon: "💡",
    color: "amber"
  },
  {
    id: "python-data",
    title: "Python & Data",
    ageRange: "12–16 ans",
    level: "avance",
    description: "Python moderne, données, visualisation et automatisation utile pour les adolescents.",
    tools: ["Python", "VS Code", "Pandas"],
    priceMonthly: 850,
    icon: "🐍",
    color: "green"
  },
  {
    id: "web-development",
    title: "Web Development",
    ageRange: "13–17 ans",
    level: "avance",
    description: "Sites web, interfaces responsives, JavaScript et premières applications React.",
    tools: ["HTML/CSS", "JavaScript", "React"],
    priceMonthly: 900,
    icon: "🌐",
    color: "rose"
  },
  {
    id: "intelligence-artificielle",
    title: "Intelligence Artificielle",
    ageRange: "14–17 ans",
    level: "avance",
    description: "Vision, machine learning, projets IA éducatifs et robotique VinciBot.",
    tools: ["VinciBot", "Dadabit AI", "Python ML"],
    priceMonthly: 950,
    icon: "🧠",
    color: "purple"
  }
];

export const students: Student[] = [
  {
    id: "stu-youssef",
    slug: "youssef-alaoui",
    firstName: "Youssef",
    lastName: "Alaoui",
    age: 14,
    avatar: "YA",
    avatarGradient: "linear-gradient(135deg,#2563EB,#06B6D4)",
    programId: "robotique-mbot",
    levelLabel: "Robotique mBot · Niveau 2",
    joinDateLabel: "Sept. 2023",
    hours: 120,
    isPublic: true,
    parentEmail: "parent.youssef@example.com",
    parentSecretHash: hashSecret("YOUSEEF-2026"),
    createdAt: new Date("2023-09-10").toISOString()
  },
  {
    id: "stu-mariam",
    slug: "mariam-el-fassi",
    firstName: "Mariam",
    lastName: "El Fassi",
    age: 15,
    avatar: "ME",
    avatarGradient: "linear-gradient(135deg,#8B5CF6,#FB7185)",
    programId: "intelligence-artificielle",
    levelLabel: "Python & IA · Niveau 1",
    joinDateLabel: "Jan. 2024",
    hours: 80,
    isPublic: true,
    parentEmail: "parent.mariam@example.com",
    parentSecretHash: hashSecret("MARIAM-2026"),
    createdAt: new Date("2024-01-08").toISOString()
  },
  {
    id: "stu-adam",
    slug: "adam-berrada",
    firstName: "Adam",
    lastName: "Berrada",
    age: 9,
    avatar: "AB",
    avatarGradient: "linear-gradient(135deg,#F59E0B,#84CC16)",
    programId: "scratch-creativite",
    levelLabel: "Scratch · Niveau 2",
    joinDateLabel: "Oct. 2023",
    hours: 60,
    isPublic: true,
    parentEmail: "parent.adam@example.com",
    parentSecretHash: hashSecret("ADAM-2026"),
    createdAt: new Date("2023-10-05").toISOString()
  }
];

export const teachers: Teacher[] = [
  {
    id: "teacher-demo",
    fullName: "Nadia Coach",
    email: "nadia@elitecodeschool.ma",
    specialty: "Robotique & Scratch",
    secretHash: hashSecret("TEACHER-2026"),
    status: "active",
    createdAt: new Date("2024-01-15").toISOString()
  }
];

export const inscriptionRequests: InscriptionRequest[] = [
  {
    id: "req-demo-1",
    studentFirstName: "Karim",
    studentLastName: "Benali",
    age: 12,
    schoolLevel: "6ème primaire",
    programId: "arduino-iot",
    parentPhone: "+212 600 000 000",
    parentEmail: "parent.karim@example.com",
    message: "Intéressé par une séance d'essai.",
    status: "pending",
    createdAt: new Date().toISOString()
  }
];

export const projects: Project[] = [
  {
    id: "proj-y-1",
    studentId: "stu-youssef",
    title: "Robot suiveur de ligne",
    description: "Robot mBot autonome capable de suivre un circuit, détecter les virages et ajuster sa vitesse.",
    tags: ["mBot", "Capteurs", "Compétition"],
    status: "done",
    progress: 100,
    dateLabel: "Mars 2024",
    emoji: "🤖",
    gradient: "linear-gradient(135deg,#2563EB,#06B6D4)"
  },
  {
    id: "proj-y-2",
    studentId: "stu-youssef",
    title: "Alarme intelligente Arduino",
    description: "Prototype avec capteur de mouvement, LED, buzzer et logique de notification.",
    tags: ["Arduino", "IoT", "Sécurité"],
    status: "progress",
    progress: 65,
    dateLabel: "En cours",
    emoji: "⚡",
    gradient: "linear-gradient(135deg,#F59E0B,#84CC16)"
  },
  {
    id: "proj-m-1",
    studentId: "stu-mariam",
    title: "Classificateur d'images IA",
    description: "Modèle éducatif capable de reconnaître des objets simples depuis une caméra.",
    tags: ["Python", "Vision", "IA"],
    status: "done",
    progress: 100,
    dateLabel: "Avril 2024",
    emoji: "🧠",
    gradient: "linear-gradient(135deg,#06B6D4,#8B5CF6)"
  },
  {
    id: "proj-a-1",
    studentId: "stu-adam",
    title: "Jeu de plateforme Scratch",
    description: "Jeu complet avec personnage animé, ennemis, score et trois niveaux progressifs.",
    tags: ["Scratch", "Game", "Animation"],
    status: "done",
    progress: 100,
    dateLabel: "Jan. 2024",
    emoji: "🎮",
    gradient: "linear-gradient(135deg,#F59E0B,#FB7185)"
  }
];

export const certifications: Certification[] = [
  {
    id: "cert-y-1",
    studentId: "stu-youssef",
    title: "Robotique mBot · Niveau 1",
    mention: "Très bien",
    dateLabel: "Déc. 2023",
    emoji: "🏅",
    gradient: "linear-gradient(135deg,#2563EB,#06B6D4)"
  },
  {
    id: "cert-m-1",
    studentId: "stu-mariam",
    title: "Python Fondamentaux",
    mention: "Excellent",
    dateLabel: "Mars 2024",
    emoji: "🐍",
    gradient: "linear-gradient(135deg,#84CC16,#2DD4BF)"
  },
  {
    id: "cert-a-1",
    studentId: "stu-adam",
    title: "Scratch Créativité · Niveau 1",
    mention: "Élève du mois",
    dateLabel: "Jan. 2024",
    emoji: "🧩",
    gradient: "linear-gradient(135deg,#F59E0B,#FB7185)"
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: "gal-y-1",
    studentId: "stu-youssef",
    label: "Préparation Mission Mars",
    emoji: "🚀",
    gradient: "linear-gradient(135deg,#FB7185,#F59E0B)"
  },
  {
    id: "gal-m-1",
    studentId: "stu-mariam",
    label: "Atelier IA vision",
    emoji: "📷",
    gradient: "linear-gradient(135deg,#06B6D4,#2563EB)"
  },
  {
    id: "gal-a-1",
    studentId: "stu-adam",
    label: "Jeu Scratch publié",
    emoji: "🎮",
    gradient: "linear-gradient(135deg,#F59E0B,#8B5CF6)"
  }
];
