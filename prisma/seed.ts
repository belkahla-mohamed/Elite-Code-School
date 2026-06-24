import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Programs
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        id: "scratch-creativite",
        title: "Scratch & Créativité",
        ageRange: "7–10 ans",
        level: "debutant",
        description: "Jeux, histoires animées et premières notions d'algorithmique avec Scratch et Micro:bit.",
        tools: ["Scratch", "Micro:bit"],
        priceMonthly: 650,
        icon: "🧩",
        color: "accent",
        sortOrder: 1,
      },
    }),
    prisma.program.create({
      data: {
        id: "robotique-mbot",
        title: "Robotique mBot",
        ageRange: "10–14 ans",
        level: "intermediaire",
        description: "Capteurs, moteurs, logique robotique et préparation aux compétitions éducatives.",
        tools: ["mBot", "Arduino", "Thymio"],
        priceMonthly: 750,
        icon: "🤖",
        color: "cyan",
        sortOrder: 2,
      },
    }),
    prisma.program.create({
      data: {
        id: "arduino-iot",
        title: "Arduino & IoT",
        ageRange: "11–15 ans",
        level: "intermediaire",
        description: "Électronique, objets connectés, Raspberry Pi et prototypes intelligents.",
        tools: ["Arduino", "Raspberry Pi", "Dadabit AI"],
        priceMonthly: 850,
        icon: "💡",
        color: "amber",
        sortOrder: 3,
      },
    }),
    prisma.program.create({
      data: {
        id: "python-data",
        title: "Python & Data",
        ageRange: "12–16 ans",
        level: "avance",
        description: "Python moderne, données, visualisation et automatisation pour les adolescents.",
        tools: ["Python", "VS Code", "Pandas"],
        priceMonthly: 850,
        icon: "🐍",
        color: "green",
        sortOrder: 4,
      },
    }),
    prisma.program.create({
      data: {
        id: "web-development",
        title: "Web Development",
        ageRange: "13–17 ans",
        level: "avance",
        description: "Sites web, interfaces responsives, JavaScript et premières applications React.",
        tools: ["HTML/CSS", "JavaScript", "React"],
        priceMonthly: 900,
        icon: "🌐",
        color: "rose",
        sortOrder: 5,
      },
    }),
    prisma.program.create({
      data: {
        id: "intelligence-artificielle",
        title: "Intelligence Artificielle",
        ageRange: "14–17 ans",
        level: "avance",
        description: "Vision, machine learning, projets IA éducatifs et robotique VinciBot.",
        tools: ["VinciBot", "Dadabit AI", "Python ML"],
        priceMonthly: 950,
        icon: "🧠",
        color: "purple",
        sortOrder: 6,
      },
    }),
  ]);

  console.log(`✅ ${programs.length} programs seeded`);

  // Students with projects, certifications, gallery
  const student1 = await prisma.student.create({
    data: {
      slug: "youssef-10ans",
      firstName: "Youssef",
      lastName: "Benali",
      age: 10,
      avatar: "Y",
      avatarGradient: "linear-gradient(135deg,#4f46e5,#06b6d4)",
      programId: "scratch-creativite",
      levelLabel: "Débutant · Scratch",
      joinDateLabel: "Sept 2024",
      hours: 24,
      isPublic: true,
      parentEmail: "parent.youssef@example.com",
      parentSecretHash: "hash-placeholder-youssef",
      projects: {
        create: [
          {
            title: "Course de voitures",
            description: "Jeu de course avec Scratch utilisant des capteurs de temps.",
            tags: ["Scratch", "Jeu"],
            status: "done",
            progress: 100,
            dateLabel: "Déc 2024",
            emoji: "🏎️",
            gradient: "linear-gradient(135deg,#4f46e5,#818cf8)",
          },
          {
            title: "Robot explorateur",
            description: "Programmation d'un robot mBot pour suivre une ligne.",
            tags: ["mBot", "Robotique"],
            status: "progress",
            progress: 65,
            dateLabel: "Fév 2025",
            emoji: "🤖",
            gradient: "linear-gradient(135deg,#06b6d4,#0ea5e9)",
          },
        ],
      },
      certifications: {
        create: [
          {
            title: "Scratch Level 1",
            mention: "Très bien",
            dateLabel: "Déc 2024",
            emoji: "🏅",
          },
        ],
      },
      galleryItems: {
        create: [
          { label: "Projet course de voitures", emoji: "🏎️" },
          { label: "Robot mBot en action", emoji: "🤖" },
        ],
      },
    },
  });

  const student2 = await prisma.student.create({
    data: {
      slug: "mariam-12ans",
      firstName: "Mariam",
      lastName: "El Amrani",
      age: 12,
      avatar: "M",
      avatarGradient: "linear-gradient(135deg,#ec4899,#f472b6)",
      programId: "robotique-mbot",
      levelLabel: "Intermédiaire · Robotique",
      joinDateLabel: "Sept 2024",
      hours: 36,
      isPublic: true,
      parentEmail: "parent.mariam@example.com",
      parentSecretHash: "hash-placeholder-mariam",
      projects: {
        create: [
          {
            title: "Robot suiveur de ligne",
            description: "Robot mBot calibré pour suivre un parcours complexe.",
            tags: ["mBot", "Robotique"],
            status: "done",
            progress: 100,
            dateLabel: "Jan 2025",
            emoji: "🤖",
            gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
          },
          {
            title: "Station météo IoT",
            description: "Capteurs de température et humidité avec affichage LED.",
            tags: ["Arduino", "IoT"],
            status: "progress",
            progress: 40,
            dateLabel: "Mar 2025",
            emoji: "🌤️",
            gradient: "linear-gradient(135deg,#10b981,#34d399)",
          },
        ],
      },
      certifications: {
        create: [
          {
            title: "Robotique mBot",
            mention: "Excellent",
            dateLabel: "Jan 2025",
            emoji: "🏆",
          },
        ],
      },
      galleryItems: {
        create: [
          { label: "Robot suiveur de ligne", emoji: "🤖" },
          { label: "Station météo", emoji: "🌤️" },
          { label: "Défi robotique", emoji: "🏆" },
        ],
      },
    },
  });

  const student3 = await prisma.student.create({
    data: {
      slug: "adam-15ans",
      firstName: "Adam",
      lastName: "Kabiri",
      age: 15,
      avatar: "A",
      avatarGradient: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
      programId: "python-data",
      levelLabel: "Avancé · Python & IA",
      joinDateLabel: "Sept 2024",
      hours: 52,
      isPublic: true,
      parentEmail: "parent.adam@example.com",
      parentSecretHash: "hash-placeholder-adam",
      projects: {
        create: [
          {
            title: "Analyse des ventes",
            description: "Dashboard interactif avec Python, Pandas et Streamlit.",
            tags: ["Python", "Data"],
            status: "done",
            progress: 100,
            dateLabel: "Fév 2025",
            emoji: "📊",
            gradient: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
          },
          {
            title: "Chatbot IA",
            description: "Agent conversationnel avec reconnaissance d'intention.",
            tags: ["Python", "IA"],
            status: "progress",
            progress: 30,
            dateLabel: "Avr 2025",
            emoji: "🤖",
            gradient: "linear-gradient(135deg,#06b6d4,#0ea5e9)",
          },
        ],
      },
      certifications: {
        create: [
          {
            title: "Python Level 2",
            mention: "Très bien",
            dateLabel: "Fév 2025",
            emoji: "🐍",
          },
          {
            title: "Data Analysis",
            mention: "Excellent",
            dateLabel: "Fév 2025",
            emoji: "📊",
          },
        ],
      },
      galleryItems: {
        create: [
          { label: "Dashboard Python", emoji: "📊" },
          { label: "Chatbot IA", emoji: "🤖" },
        ],
      },
    },
  });

  console.log(`✅ 3 students seeded (${student1.slug}, ${student2.slug}, ${student3.slug})`);

  // Seed one teacher
  const teacher = await prisma.teacher.create({
    data: {
      fullName: "Nadia Coach",
      email: "nadia@elitecodeschool.ma",
      specialty: "Robotique & IA",
      secretHash: "coach-secret-nadia",
      status: "active",
    },
  });

  console.log(`✅ 1 teacher seeded (${teacher.fullName})`);

  // Seed one pending inscription request
  const request = await prisma.inscriptionRequest.create({
    data: {
      studentFirstName: "Karim",
      studentLastName: "Benali",
      age: 9,
      schoolLevel: "CM1",
      programId: "scratch-creativite",
      parentPhone: "06 12 34 56 78",
      parentEmail: "parent.karim@example.com",
      message: "Mon fils adore les robots !",
      status: "pending",
    },
  });

  console.log(`✅ 1 pending request seeded (${request.studentFirstName} ${request.studentLastName})`);

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
