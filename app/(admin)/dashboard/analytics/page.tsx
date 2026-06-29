"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, Clock } from "lucide-react";

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false })
const LineChart = dynamic(() => import("recharts").then((m) => m.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then((m) => m.Line), { ssr: false })
const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false })
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false })
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false })

interface Program { id: string; title: string }
interface InscriptionRequest { id: string; status: string; createdAt: string }
interface Student { id: string; programId: string; createdAt: string }

const COLORS = ["#4f46e5", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AnalyticsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [requests, setRequests] = useState<InscriptionRequest[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/programs").then((r) => r.json()),
      fetch("/api/inscriptions").then((r) => r.json()),
      fetch("/api/students").then((r) => r.json()),
    ]).then(([progData, insData, stuData]) => {
      const progList = Array.isArray(progData) ? progData : (progData as any)?.programs ?? [];
      setPrograms(progList);
      setRequests((insData as any)?.requests ?? []);
      setStudents(Array.isArray(stuData) ? stuData : (stuData as any)?.students ?? []);
      setLoading(false);
    });
  }, []);

  const programMap = new Map(programs.map((p) => [p.id, p.title]));
  const studentsByProgram = programs.map((p) => ({
    name: p.title,
    value: students.filter((s) => s.programId === p.id).length,
  })).filter((p) => p.value > 0);

  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const idx = (currentMonth - 5 + i + 12) % 12;
    const m = months[idx];
    const studentsCount = students.filter((s) => {
      const d = new Date(s.createdAt);
      return d.getMonth() === idx && d.getFullYear() === new Date().getFullYear();
    }).length;
    const requestsCount = requests.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getMonth() === idx && d.getFullYear() === new Date().getFullYear();
    }).length;
    return { month: m, étudiants: studentsCount, inscriptions: requestsCount };
  });

  const statusData = [
    { name: "Acceptées", value: requests.filter((r) => r.status === "accepted").length },
    { name: "En attente", value: requests.filter((r) => r.status === "pending").length },
    { name: "Refusées", value: requests.filter((r) => r.status === "refused").length },
  ].filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-brand" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-brand" />
          <Skeleton className="h-72 rounded-brand" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black text-ink">Analytiques</h1>
        <p className="text-sm text-ink-soft">Statistiques et indicateurs clés</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="p-5 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-brand-sm bg-sky/10 text-sky"><Users className="size-5" /></span>
            <div>
              <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">Élèves</p>
              <p className="font-display text-2xl font-black text-ink">{students.length}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-brand-sm bg-lime/10 text-lime"><CheckCircle className="size-5" /></span>
            <div>
              <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">Acceptées</p>
              <p className="font-display text-2xl font-black text-ink">{requests.filter((r) => r.status === "accepted").length}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-brand-sm bg-amber/10 text-amber"><Clock className="size-5" /></span>
            <div>
              <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">En attente</p>
              <p className="font-display text-2xl font-black text-ink">{requests.filter((r) => r.status === "pending").length}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Students per Program */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-ink">Élèves par programme</h3>
          </CardHeader>
          <CardBody>
          {studentsByProgram.length === 0 ? (
            <p className="text-sm text-ink-soft py-8 text-center">Aucune donnée</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={studentsByProgram}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          </CardBody>
        </Card>

        {/* Inscriptions Over Time */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-ink">Inscriptions (6 mois)</h3>
          </CardHeader>
          <CardBody>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={last6Months}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="étudiants" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="inscriptions" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-ink">Répartition des statuts</h3>
          </CardHeader>
          <CardBody>
          {statusData.length === 0 ? (
            <p className="text-sm text-ink-soft py-8 text-center">Aucune donnée</p>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value">
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {statusData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <span className="size-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-ink-soft">{d.name}</span>
                    <span className="font-bold text-ink">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          </CardBody>
        </Card>

        {/* Programs Summary */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-ink">Résumé</h3>
          </CardHeader>
          <CardBody>
          <div className="space-y-4">
            {programs.map((p) => {
              const count = students.filter((s) => s.programId === p.id).length;
              const maxCount = Math.max(1, ...studentsByProgram.map((s) => s.value));
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={p.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink font-semibold">{p.title}</span>
                    <span className="text-ink-soft">{count} élève{count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2 rounded-full bg-sky/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky to-cyan transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
