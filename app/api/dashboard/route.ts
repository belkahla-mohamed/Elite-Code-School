import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDashboardSnapshot, getPrograms } from "@/lib/store";
import { getActivityLog } from "@/lib/activity-log";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [snapshot, programs] = await Promise.all([
      getDashboardSnapshot(),
      getPrograms(),
    ])

    const { requests, students } = snapshot
    const programPriceMap = new Map(programs.map((p) => [p.id, p.priceMonthly ?? 0]))

    const totalStudents = students.length
    const pendingRequests = requests.filter((r) => r.status === "pending").length
    const acceptedRequests = requests.filter((r) => r.status === "accepted").length
    const totalPrograms = programs.length

    let totalProjects = 0
    let completedProjects = 0
    for (const s of students) {
      totalProjects += s.projects.length
      completedProjects += s.projects.filter((p) => p.status === "completed").length
    }
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0

    const monthlyRevenue = students.reduce((sum, s) => sum + (programPriceMap.get(s.programId) ?? 0), 0)

    const studentsByProgram = programs
      .map((p) => ({
        name: p.title,
        count: students.filter((s) => s.programId === p.id).length,
        color: p.color,
        price: p.priceMonthly ?? 0,
      }))
      .filter((p) => p.count > 0)

    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
    const currentMonth = new Date().getMonth()
    const growthData = Array.from({ length: 6 }, (_, i) => {
      const monthIdx = (currentMonth - 5 + i + 12) % 12
      const count = students.filter((s) => {
        const d = new Date(s.createdAt)
        return d.getMonth() === monthIdx && d.getFullYear() === new Date().getFullYear()
      }).length
      return { month: months[monthIdx], count }
    })

    const activities = getActivityLog(10)

    return NextResponse.json({
      stats: {
        totalStudents,
        pendingRequests,
        acceptedRequests,
        totalPrograms,
        monthlyRevenue,
        completionRate,
      },
      studentsByProgram,
      growthData,
      recentRequests: requests.slice(0, 8),
      activities,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}
