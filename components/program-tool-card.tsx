interface ToolInfo {
  name: string
  description: string
}

const toolEmoji: Record<string, string> = {
  scratch: "🧩",
  "micro:bit": "🔧",
  mbot: "🤖",
  arduino: "⚡",
  thymio: "🦾",
  "raspberry pi": "🍓",
  "dadabit ai": "🧠",
  python: "🐍",
  "vs code": "💻",
  pandas: "📊",
  "html/css": "🌐",
  javascript: "⚡",
  react: "⚛️",
  vincibot: "🦾",
  "python ml": "🤖",
}

function getEmoji(tool: string): string {
  return toolEmoji[tool.toLowerCase()] ?? "🛠️"
}

export function parseToolsDescription(raw: string | undefined, tools: string[]): ToolInfo[] {
  if (!raw?.trim()) {
    return tools.map((t) => ({ name: t, description: "" }))
  }
  const lines = raw.split("\n").filter(Boolean)
  const map = new Map<string, string>()
  for (const line of lines) {
    const idx = line.indexOf(":")
    if (idx === -1) continue
    const key = line.slice(0, idx).trim().toLowerCase()
    const desc = line.slice(idx + 1).trim()
    map.set(key, desc)
  }
  return tools.map((t) => ({
    name: t,
    description: map.get(t.toLowerCase()) ?? "",
  }))
}

export function ProgramToolCard({ tool }: { tool: ToolInfo }) {
  return (
    <div className="flex items-start gap-3 rounded-brand border border-border bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-sm dark:border-white/10 dark:bg-[#1e293b]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-brand-sm bg-brand/10 text-xl">
        {getEmoji(tool.name)}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink dark:text-white">{tool.name}</p>
        {tool.description && (
          <p className="mt-0.5 text-xs leading-5 text-ink-soft dark:text-slate-400">{tool.description}</p>
        )}
      </div>
    </div>
  )
}
