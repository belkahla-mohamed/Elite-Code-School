import { hashSecret } from "@/lib/auth";
import type { Category, Certification, GalleryItem, InscriptionRequest, Program, Project, Student } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-creativite", name: "Créativité Numérique", slug: "creativite-numerique", description: "Éveil à la programmation et à la créativité avec des outils visuels et ludiques.", color: "accent" },
  { id: "cat-robotique", name: "Robotique", slug: "robotique", description: "Construction et programmation de robots, capteurs et systèmes embarqués.", color: "cyan" },
  { id: "cat-iot", name: "IoT & Électronique", slug: "iot-electronique", description: "Objets connectés, Arduino, Raspberry Pi et prototypes électroniques.", color: "amber" },
  { id: "cat-programmation", name: "Programmation", slug: "programmation", description: "Langages de programmation, algorithmique et développement logiciel.", color: "green" },
  { id: "cat-web", name: "Développement Web", slug: "developpement-web", description: "Sites web, applications web et technologies du web moderne.", color: "rose" },
  { id: "cat-ia", name: "Intelligence Artificielle", slug: "intelligence-artificielle", description: "Machine learning, vision par ordinateur et projets IA.", color: "purple" },
];

export const programs: Program[] = [
  {
    id: "scratch-creativite",
    categoryId: "cat-creativite",
    title: "Scratch & Créativité",
    ageRange: "7–10 ans",
    level: "debutant",
    description: "Jeux, histoires animées et premières notions d'algorithmique avec Scratch et Micro:bit. Les enfants développent leur logique tout en s'amusant avec des projets créatifs.",
    tools: ["Scratch", "Micro:bit"],
    priceMonthly: 650,
    color: "accent",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
    duration: "3 mois · 12 séances",
    schedule: "Samedi 10h–12h",
    objectives: "• Créer des jeux et animations interactives avec Scratch\n• Découvrir les bases de l'algorithmique (boucles, conditions, variables)\n• Programmer des mini-projets avec Micro:bit\n• Développer la logique et la créativité numérique",
    prerequisites: "Aucun prérequis — ce programme est conçu pour les débutants."
  },
  {
    id: "robotique-mbot",
    categoryId: "cat-robotique",
    title: "Robotique mBot",
    ageRange: "10–14 ans",
    level: "intermediaire",
    description: "Capteurs, moteurs, logique robotique et préparation aux compétitions éducatives avec des robots mBot et Thymio.",
    tools: ["mBot", "Arduino", "Thymio"],
    priceMonthly: 750,
    color: "cyan",
    image: "https://images.unsplash.com/photo-1563770660941-10a5a10aacd0?w=800&q=80",
    duration: "4 mois · 16 séances",
    schedule: "Mercredi 14h–16h",
    objectives: "• Assembler et configurer un robot mBot\n• Programmer des capteurs (distance, lumière, son)\n• Créer des robots autonomes et téléguidés\n• Participer à des défis robotiques",
    prerequisites: "Avoir suivi Scratch & Créativité ou connaître les bases de la programmation visuelle."
  },
  {
    id: "arduino-iot",
    categoryId: "cat-iot",
    title: "Arduino & IoT",
    ageRange: "11–15 ans",
    level: "intermediaire",
    description: "Électronique, objets connectés, Raspberry Pi et prototypes intelligents. Créez vos propres appareils connectés !",
    tools: ["Arduino", "Raspberry Pi", "Dadabit AI"],
    priceMonthly: 850,
    color: "amber",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&q=80",
    duration: "4 mois · 16 séances",
    schedule: "Samedi 14h–16h",
    objectives: "• Comprendre les bases de l'électronique (LED, résistances, capteurs)\n• Programmer des cartes Arduino\n• Créer des objets connectés (IoT)\n• Prototyper des solutions intelligentes",
    prerequisites: "Notions de base en programmation (Scratch ou bloc)."
  },
  {
    id: "python-data",
    categoryId: "cat-programmation",
    title: "Python & Data",
    ageRange: "12–16 ans",
    level: "avance",
    description: "Python moderne, données, visualisation et automatisation utile pour les adolescents. Devenez autonome en programmation !",
    tools: ["Python", "VS Code", "Pandas"],
    priceMonthly: 850,
    color: "green",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
    duration: "4 mois · 16 séances",
    schedule: "Mardi & Jeudi 18h–20h",
    objectives: "• Maîtriser la syntaxe Python et les bonnes pratiques\n• Manipuler et visualiser des données avec Pandas\n• Créer des scripts d'automatisation\n• Développer une calculatrice, un dashboard, un jeu",
    prerequisites: "Avoir 12+ ans. Une familiarité avec l'ordinateur est suffisante."
  },
  {
    id: "web-development",
    categoryId: "cat-web",
    title: "Web Development",
    ageRange: "13–17 ans",
    level: "avance",
    description: "Sites web, interfaces responsives, JavaScript et premières applications React. Construisez votre présence en ligne !",
    tools: ["HTML/CSS", "JavaScript", "React"],
    priceMonthly: 900,
    color: "rose",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    duration: "5 mois · 20 séances",
    schedule: "Mercredi 16h–18h & Samedi 10h–12h",
    objectives: "• Créer des sites web responsives avec HTML & CSS\n• Programmer en JavaScript (DOM, fetch, async)\n• Construire des apps avec React\n• Mettre en ligne un portfolio personnel",
    prerequisites: "Logique de programmation acquise (Python, Scratch ou équivalent)."
  },
  {
    id: "intelligence-artificielle",
    categoryId: "cat-ia",
    title: "Intelligence Artificielle",
    ageRange: "14–17 ans",
    level: "avance",
    description: "Vision, machine learning, projets IA éducatifs et robotique VinciBot. Plongez dans le futur de la technologie !",
    tools: ["VinciBot", "Dadabit AI", "Python ML"],
    priceMonthly: 950,
    color: "purple",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    duration: "5 mois · 20 séances",
    schedule: "Mardi & Jeudi 18h–20h",
    objectives: "• Comprendre les concepts clés du Machine Learning\n• Entraîner des modèles de vision et NLP\n• Programmer des robots intelligents (VinciBot)\n• Réaliser un projet IA de A à Z",
    prerequisites: "Bonnes bases en Python (programmation orientée objet). Avoir suivi Python & Data ou équivalent."
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
  },
  {
    id: "stu-sarah",
    slug: "sarah-benali",
    firstName: "Sarah",
    lastName: "Benali",
    age: 16,
    avatar: "SB",
    avatarGradient: "linear-gradient(135deg,#EC4899,#8B5CF6)",
    programId: "web-development",
    levelLabel: "Web Development · Niveau 1",
    joinDateLabel: "Fév. 2024",
    hours: 45,
    isPublic: true,
    parentEmail: "parent.sarah@example.com",
    parentSecretHash: hashSecret("SARAH-2026"),
    createdAt: new Date("2024-02-12").toISOString()
  },
  {
    id: "stu-aymane",
    slug: "aymane-idrissi",
    firstName: "Aymane",
    lastName: "Idrissi",
    age: 13,
    avatar: "AI",
    avatarGradient: "linear-gradient(135deg,#10B981,#3B82F6)",
    programId: "python-data",
    levelLabel: "Python & Data · Niveau 1",
    joinDateLabel: "Mars 2024",
    hours: 35,
    isPublic: true,
    parentEmail: "parent.aymane@example.com",
    parentSecretHash: hashSecret("AYMANE-2026"),
    createdAt: new Date("2024-03-01").toISOString()
  },
  {
    id: "stu-ines",
    slug: "ines-elmouden",
    firstName: "Inès",
    lastName: "El Mouden",
    age: 11,
    avatar: "IE",
    avatarGradient: "linear-gradient(135deg,#F43F5E,#FBBF24)",
    programId: "arduino-iot",
    levelLabel: "Arduino & IoT · Niveau 1",
    joinDateLabel: "Avril 2024",
    hours: 25,
    isPublic: true,
    parentEmail: "parent.ines@example.com",
    parentSecretHash: hashSecret("INES-2026"),
    createdAt: new Date("2024-04-15").toISOString()
  },
  {
    id: "stu-oumaima",
    slug: "oumaima-zerhouni",
    firstName: "Oumaima",
    lastName: "Zerhouni",
    age: 17,
    avatar: "OZ",
    avatarGradient: "linear-gradient(135deg,#7C3AED,#EC4899)",
    programId: "intelligence-artificielle",
    levelLabel: "IA · Niveau 2",
    joinDateLabel: "Sept. 2023",
    hours: 150,
    isPublic: true,
    parentEmail: "parent.oumaima@example.com",
    parentSecretHash: hashSecret("OUMAIMA-2026"),
    createdAt: new Date("2023-09-05").toISOString()
  },
  {
    id: "stu-rayan",
    slug: "rayan-ouali",
    firstName: "Rayan",
    lastName: "Ouali",
    age: 8,
    avatar: "RO",
    avatarGradient: "linear-gradient(135deg,#22D3EE,#F472B6)",
    programId: "scratch-creativite",
    levelLabel: "Scratch · Niveau 1",
    joinDateLabel: "Mai 2024",
    hours: 15,
    isPublic: false,
    parentEmail: "parent.rayan@example.com",
    parentSecretHash: hashSecret("RAYAN-2026"),
    createdAt: new Date("2024-05-20").toISOString()
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
    parentFirstName: "Karim",
    parentLastName: "Benali",
    parentPhone: "+212 600 000 000",
    parentEmail: "parent.karim@example.com",
    message: "Intéressé par une séance d'essai.",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "req-demo-2",
    studentFirstName: "Lina",
    studentLastName: "Tazi",
    age: 10,
    schoolLevel: "5ème primaire",
    programId: "scratch-creativite",
    parentFirstName: "Nadia",
    parentLastName: "Tazi",
    parentPhone: "+212 600 111 111",
    parentEmail: "parent.lina@example.com",
    message: "Ma fille adore les jeux vidéo et veut apprendre à en créer.",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "req-demo-3",
    studentFirstName: "Yassine",
    studentLastName: "El Fassi",
    age: 16,
    schoolLevel: "2ème lycée",
    programId: "web-development",
    parentFirstName: "Hassan",
    parentLastName: "El Fassi",
    parentPhone: "+212 600 222 222",
    parentEmail: "parent.yassine@example.com",
    message: "Souhaite intégrer le programme Web Development pour préparer son projet d'école.",
    status: "accepted",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: "Accepté via batch"
  },
  {
    id: "req-demo-4",
    studentFirstName: "Nora",
    studentLastName: "Amrani",
    age: 14,
    schoolLevel: "3ème collège",
    programId: "python-data",
    parentFirstName: "Samira",
    parentLastName: "Amrani",
    parentPhone: "+212 600 333 333",
    parentEmail: "parent.nora@example.com",
    message: "Nora a déjà fait un peu de Python en autodidacte, elle veut aller plus loin.",
    status: "refused",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: "Groupe complet pour cette session",
    rejectionMessage: "Désolés, le groupe Python & Data est complet pour cette session. Nous vous recontacterons pour la prochaine."
  }
];

export const projects: Project[] = [
  {
    id: "proj-y-1",
    studentId: "stu-youssef",
    title: "Robot suiveur de ligne",
    description: "Robot mBot autonome capable de suivre un circuit, détecter les virages et ajuster sa vitesse en temps réel.",
    tags: ["mBot", "Capteurs", "Compétition"],
    status: "done",
    progress: 100,
    dateLabel: "Mars 2024",
    emoji: "🤖",
    gradient: "linear-gradient(135deg,#2563EB,#06B6D4)",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80"
  },
  {
    id: "proj-y-2",
    studentId: "stu-youssef",
    title: "Alarme intelligente Arduino",
    description: "Prototype avec capteur de mouvement, LED, buzzer et logique de notification en temps réel.",
    tags: ["Arduino", "IoT", "Sécurité"],
    status: "progress",
    progress: 65,
    dateLabel: "En cours",
    emoji: "⚡",
    gradient: "linear-gradient(135deg,#F59E0B,#84CC16)",
    coverImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&q=80"
  },
  {
    id: "proj-m-1",
    studentId: "stu-mariam",
    title: "Classificateur d'images IA",
    description: "Modèle éducatif capable de reconnaître des objets simples depuis une caméra en temps réel.",
    tags: ["Python", "Vision", "IA"],
    status: "done",
    progress: 100,
    dateLabel: "Avril 2024",
    emoji: "🧠",
    gradient: "linear-gradient(135deg,#06B6D4,#8B5CF6)",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80"
  },
  {
    id: "proj-m-2",
    studentId: "stu-mariam",
    title: "Chatbot NLP pour questions scolaires",
    description: "Assistant virtuel basé sur NLP qui répond aux questions sur les cours de sciences.",
    tags: ["NLP", "Python", "Chatbot"],
    status: "planned",
    progress: 20,
    dateLabel: "Planifié",
    emoji: "💬",
    gradient: "linear-gradient(135deg,#8B5CF6,#FB7185)"
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
    gradient: "linear-gradient(135deg,#F59E0B,#FB7185)",
    coverImage: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=600&q=80"
  },
  {
    id: "proj-s-1",
    studentId: "stu-sarah",
    title: "Portfolio personnel interactif",
    description: "Site web portfolio avec animations CSS, design responsive et formulaire de contact.",
    tags: ["HTML/CSS", "JavaScript", "React"],
    status: "done",
    progress: 100,
    dateLabel: "Mai 2024",
    emoji: "🌐",
    gradient: "linear-gradient(135deg,#EC4899,#8B5CF6)",
    coverImage: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80"
  },
  {
    id: "proj-s-2",
    studentId: "stu-sarah",
    title: "Application météo React",
    description: "Dashboard météo avec API OpenWeather, graphiques dynamiques et fonds adaptatifs.",
    tags: ["React", "API", "Dashboard"],
    status: "progress",
    progress: 50,
    dateLabel: "En cours",
    emoji: "☀️",
    gradient: "linear-gradient(135deg,#FBBF24,#3B82F6)"
  },
  {
    id: "proj-ay-1",
    studentId: "stu-aymane",
    title: "Analyse des ventes avec Pandas",
    description: "Script Python d'analyse de données commerciales avec visualisations et rapports automatisés.",
    tags: ["Python", "Pandas", "Data Viz"],
    status: "done",
    progress: 100,
    dateLabel: "Juin 2024",
    emoji: "📊",
    gradient: "linear-gradient(135deg,#10B981,#3B82F6)",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
  },
  {
    id: "proj-i-1",
    studentId: "stu-ines",
    title: "Serre connectée Arduino",
    description: "Système IoT qui mesure humidité, température et arrose automatiquement les plantes.",
    tags: ["Arduino", "IoT", "Capteurs"],
    status: "progress",
    progress: 70,
    dateLabel: "En cours",
    emoji: "🌱",
    gradient: "linear-gradient(135deg,#F43F5E,#FBBF24)",
    coverImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80"
  },
  {
    id: "proj-o-1",
    studentId: "stu-oumaima",
    title: "Reconnaissance faciale éthique",
    description: "Projet IA de détection faciale avec débat sur l'éthique et les biais algorithmiques.",
    tags: ["Python ML", "Vision", "Éthique"],
    status: "done",
    progress: 100,
    dateLabel: "Mai 2024",
    emoji: "🔬",
    gradient: "linear-gradient(135deg,#7C3AED,#EC4899)",
    coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80"
  },
  {
    id: "proj-o-2",
    studentId: "stu-oumaima",
    title: "Robot VinciBot autonome",
    description: "Programmation avancée d'un robot VinciBot avec navigation autonome et évitement d'obstacles.",
    tags: ["VinciBot", "Robotique", "IA"],
    status: "progress",
    progress: 40,
    dateLabel: "En cours",
    emoji: "🦾",
    gradient: "linear-gradient(135deg,#06B6D4,#7C3AED)"
  },
  {
    id: "proj-r-1",
    studentId: "stu-rayan",
    title: "Histoire animée : Le voyage spatial",
    description: "Animation Scratch interactive avec personnages, dialogues et une fusée qui décolle.",
    tags: ["Scratch", "Animation", "Histoire"],
    status: "progress",
    progress: 30,
    dateLabel: "En cours",
    emoji: "🚀",
    gradient: "linear-gradient(135deg,#22D3EE,#F472B6)"
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
    id: "cert-y-2",
    studentId: "stu-youssef",
    title: "Arduino Fondamentaux",
    mention: "Bien",
    dateLabel: "Avril 2024",
    emoji: "⚡",
    gradient: "linear-gradient(135deg,#F59E0B,#84CC16)"
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
    id: "cert-m-2",
    studentId: "stu-mariam",
    title: "IA & Machine Learning · Introduction",
    mention: "Très bien",
    dateLabel: "Juin 2024",
    emoji: "🧠",
    gradient: "linear-gradient(135deg,#8B5CF6,#06B6D4)"
  },
  {
    id: "cert-a-1",
    studentId: "stu-adam",
    title: "Scratch Créativité · Niveau 1",
    mention: "Élève du mois",
    dateLabel: "Jan. 2024",
    emoji: "🧩",
    gradient: "linear-gradient(135deg,#F59E0B,#FB7185)"
  },
  {
    id: "cert-s-1",
    studentId: "stu-sarah",
    title: "Web Development · HTML/CSS",
    mention: "Excellent",
    dateLabel: "Avril 2024",
    emoji: "🌐",
    gradient: "linear-gradient(135deg,#EC4899,#FBBF24)"
  },
  {
    id: "cert-ay-1",
    studentId: "stu-aymane",
    title: "Python Fondamentaux",
    mention: "Très bien",
    dateLabel: "Juin 2024",
    emoji: "🐍",
    gradient: "linear-gradient(135deg,#10B981,#3B82F6)"
  },
  {
    id: "cert-i-1",
    studentId: "stu-ines",
    title: "Arduino & IoT · Niveau 1",
    mention: "Bien",
    dateLabel: "Juin 2024",
    emoji: "💡",
    gradient: "linear-gradient(135deg,#F43F5E,#FBBF24)"
  },
  {
    id: "cert-o-1",
    studentId: "stu-oumaima",
    title: "Python Avancé & Data Science",
    mention: "Excellent",
    dateLabel: "Déc. 2023",
    emoji: "🏆",
    gradient: "linear-gradient(135deg,#7C3AED,#EC4899)"
  },
  {
    id: "cert-o-2",
    studentId: "stu-oumaima",
    title: "Intelligence Artificielle · Niveau 1",
    mention: "Très bien",
    dateLabel: "Mai 2024",
    emoji: "🧠",
    gradient: "linear-gradient(135deg,#06B6D4,#7C3AED)"
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: "gal-y-1",
    studentId: "stu-youssef",
    label: "Préparation Mission Mars",
    emoji: "🚀",
    gradient: "linear-gradient(135deg,#FB7185,#F59E0B)",
    imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80"
  },
  {
    id: "gal-y-2",
    studentId: "stu-youssef",
    label: "Défis robotiques inter-écoles",
    emoji: "🤖",
    gradient: "linear-gradient(135deg,#2563EB,#06B6D4)",
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80"
  },
  {
    id: "gal-m-1",
    studentId: "stu-mariam",
    label: "Atelier IA vision",
    emoji: "📷",
    gradient: "linear-gradient(135deg,#06B6D4,#2563EB)",
    imageUrl: "https://images.unsplash.com/photo-1531746790095-e5cb198c10c1?w=600&q=80"
  },
  {
    id: "gal-m-2",
    studentId: "stu-mariam",
    label: "Hackathon IA pour le climat",
    emoji: "🌍",
    gradient: "linear-gradient(135deg,#84CC16,#2DD4BF)",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80"
  },
  {
    id: "gal-a-1",
    studentId: "stu-adam",
    label: "Jeu Scratch publié en ligne",
    emoji: "🎮",
    gradient: "linear-gradient(135deg,#F59E0B,#8B5CF6)",
    imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b641f?w=600&q=80"
  },
  {
    id: "gal-s-1",
    studentId: "stu-sarah",
    label: "Site web personnel mis en ligne",
    emoji: "🌐",
    gradient: "linear-gradient(135deg,#EC4899,#FBBF24)",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
  },
  {
    id: "gal-ay-1",
    studentId: "stu-aymane",
    label: "Dashboard data visualisation",
    emoji: "📊",
    gradient: "linear-gradient(135deg,#10B981,#3B82F6)",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
  },
  {
    id: "gal-i-1",
    studentId: "stu-ines",
    label: "Prototype serre connectée",
    emoji: "🌱",
    gradient: "linear-gradient(135deg,#F43F5E,#FBBF24)",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80"
  },
  {
    id: "gal-o-1",
    studentId: "stu-oumaima",
    label: "Conférence IA éthique",
    emoji: "🎤",
    gradient: "linear-gradient(135deg,#7C3AED,#EC4899)",
    imageUrl: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&q=80"
  },
  {
    id: "gal-o-2",
    studentId: "stu-oumaima",
    label: "Projet reconnaissance faciale",
    emoji: "🔬",
    gradient: "linear-gradient(135deg,#06B6D4,#7C3AED)",
    imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80"
  },
  {
    id: "gal-r-1",
    studentId: "stu-rayan",
    label: "Première animation Scratch",
    emoji: "🎨",
    gradient: "linear-gradient(135deg,#22D3EE,#F472B6)"
  }
];
