import Link from "next/link";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-ink-soft mb-6">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-border">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-brand transition font-medium">{item.label}</Link>
          ) : (
            <span className="text-ink font-bold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
