import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
}

interface Program {
  id: string
  title: string
  ageRange: string
  level: string
  description: string
  tools: string[]
  priceMonthly?: number
  color: string
  image: string
  duration?: string
  objectives?: string
  prerequisites?: string
  schedule?: string
  categoryId?: string
  category?: Category
}

type Theme = {
  headerBg: string
  darkHeaderBg: string
  accent: string
  buttonBg: string
  darkButtonBg: string
  buttonText: string
  darkButtonText: string
}

function getColorHex(color: string): string {
  const map: Record<string, string> = {
    sky: "#0EA5E9", accent: "#6366F1", cyan: "#06B6D4", amber: "#F59E0B",
    green: "#22C55E", rose: "#F43F5E", purple: "#A855F7", coral: "#FB7185",
    emerald: "#10B981", violet: "#8B5CF6", pink: "#EC4899", indigo: "#6366F1",
  }
  return map[color] || "#6366F1"
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 99, g: 102, b: 241 }
}

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23e5e7eb'/%3E%3Ctext x='400' y='210' text-anchor='middle' fill='%239ca3af' font-size='40' font-weight='bold' font-family='sans-serif'%3EImage%3C/text%3E%3C/svg%3E"

const categoryThemes: Record<string, Theme> = {
  "cat-creativite": {
    headerBg: "#FDF2F8",
    darkHeaderBg: "rgba(236,72,153,0.12)",
    accent: "#DB2777",
    buttonBg: "#FDF2F8",
    darkButtonBg: "rgba(236,72,153,0.12)",
    buttonText: "#DB2777",
    darkButtonText: "#F472B6",
  },
  "cat-robotique": {
    headerBg: "#ECFDF5",
    darkHeaderBg: "rgba(16,185,129,0.12)",
    accent: "#059669",
    buttonBg: "#ECFDF5",
    darkButtonBg: "rgba(16,185,129,0.12)",
    buttonText: "#059669",
    darkButtonText: "#34D399",
  },
  "cat-iot": {
    headerBg: "#FEF3C7",
    darkHeaderBg: "rgba(245,158,11,0.12)",
    accent: "#D97706",
    buttonBg: "#FEF3C7",
    darkButtonBg: "rgba(245,158,11,0.12)",
    buttonText: "#D97706",
    darkButtonText: "#FBBF24",
  },
  "cat-programmation": {
    headerBg: "#EEF2FF",
    darkHeaderBg: "rgba(99,102,241,0.12)",
    accent: "#4F46E5",
    buttonBg: "#EEF2FF",
    darkButtonBg: "rgba(99,102,241,0.12)",
    buttonText: "#4F46E5",
    darkButtonText: "#818CF8",
  },
  "cat-web": {
    headerBg: "#F0F9FF",
    darkHeaderBg: "rgba(14,165,233,0.12)",
    accent: "#0284C7",
    buttonBg: "#F0F9FF",
    darkButtonBg: "rgba(14,165,233,0.12)",
    buttonText: "#0284C7",
    darkButtonText: "#38BDF8",
  },
  "cat-ia": {
    headerBg: "#F3E8FF",
    darkHeaderBg: "rgba(168,85,247,0.12)",
    accent: "#9333EA",
    buttonBg: "#F3E8FF",
    darkButtonBg: "rgba(168,85,247,0.12)",
    buttonText: "#9333EA",
    darkButtonText: "#C084FC",
  },
}

function getTheme(program: Program): Theme {
  if (program.category && categoryThemes[program.category.id]) {
    return categoryThemes[program.category.id]
  }

  const hex = getColorHex(program.color)
  const { r, g, b } = hexToRgb(hex)
  return {
    headerBg: `rgb(${r},${g},${b},0.08)`,
    darkHeaderBg: `rgba(${r},${g},${b},0.12)`,
    accent: hex,
    buttonBg: `rgb(${r},${g},${b},0.08)`,
    darkButtonBg: `rgba(${r},${g},${b},0.12)`,
    buttonText: hex,
    darkButtonText: hex,
  }
}

export function ProgramCard({ program }: { program: Program }) {
  const theme = getTheme(program)

  const levelLabel = program.level === "debutant" ? "Débutant"
    : program.level === "intermediaire" ? "Intermédiaire"
    : "Avancé"

  return (
    <Link
      href={`/curricula/${program.id}`}
      className="group rounded-brand border border-border overflow-hidden bg-white dark:bg-slate-950 block"
    >
      {/* Top: Image Header */}
      <div
        className="relative h-40 overflow-hidden"
        style={{ backgroundColor: theme.headerBg }}
      >
        <img
          src={program.image || FALLBACK_IMAGE}
          alt={program.title}
          loading="lazy"
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Bottom: Content */}
      <div className="relative bg-white dark:bg-slate-950 p-6 pt-5">
        <ArrowUpRight className="absolute right-4 top-4 size-5 text-slate-300 dark:text-slate-600 transition-colors group-hover:text-slate-400" style={{ strokeWidth: 2.5 }} />

        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 pr-8 leading-tight">
          {program.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 line-clamp-2 font-body">
          {program.description}
        </p>

        {/* Metadata */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-500 font-body">
          <span>{program.ageRange}</span>
          {program.duration && <><span className="text-slate-300 dark:text-slate-600">·</span><span>{program.duration}</span></>}
          {program.priceMonthly && <><span className="text-slate-300 dark:text-slate-600">·</span><span>{program.priceMonthly} DH/mois</span></>}
        </div>

        {/* Level badge + Découvrir */}
        <div className="mt-5 flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${
            program.level === "debutant" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
            program.level === "intermediaire" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
            "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
          }`}>
            {levelLabel}
          </span>

          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 group-hover:gap-2.5"
            style={{
              backgroundColor: theme.buttonBg,
              color: theme.buttonText,
            }}
          >
            Découvrir <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
