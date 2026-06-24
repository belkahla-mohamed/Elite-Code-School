import Link from "next/link";

const links = [
  { href: "/student/dashboard", label: "Tableau de bord", icon: "📊" },
  { href: "/student/missions", label: "Missions", icon: "🎯" },
  { href: "/student/badges", label: "Badges", icon: "🏅" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-[#E6EEF8] bg-white/80 backdrop-blur-sm">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/student/dashboard" className="font-display text-xl font-extrabold tracking-[-0.04em] text-sky">
            🎮 Mon espace
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-sky/10 hover:text-sky">
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
