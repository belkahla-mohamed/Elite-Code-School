import { Award, Bell, Briefcase, ClipboardList, GraduationCap, Mail, Package, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<string, { icon: LucideIcon; className: string }> = {
  student: { icon: GraduationCap, className: "bg-sky/10 text-sky" },
  project: { icon: Briefcase, className: "bg-violet/10 text-violet" },
  certification: { icon: Award, className: "bg-amber/10 text-amber" },
  request: { icon: ClipboardList, className: "bg-brand/10 text-brand" },
  contact: { icon: Mail, className: "bg-mint/10 text-mint" },
  program: { icon: Package, className: "bg-pink/10 text-pink" },
};

export function NotificationIcon({ type, className }: { type: string; className?: string }) {
  const entry = TYPE_STYLES[type] ?? { icon: Bell, className: "bg-surface text-ink-soft" };
  const Icon = entry.icon;
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full", entry.className, className)}>
      <Icon className="size-1/2" />
    </span>
  );
}
