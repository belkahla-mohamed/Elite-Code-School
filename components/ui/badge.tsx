import { cn } from "@/lib/utils";

type BadgeVariant = "pending" | "accepted" | "rejected" | "info" | "success";
type BadgeSize = "sm" | "md";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  pending: "bg-amber/15 text-amber",
  accepted: "bg-lime/15 text-lime",
  rejected: "bg-coral/15 text-coral",
  info: "bg-sky/15 text-sky",
  success: "bg-mint/15 text-mint",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2.5 py-0.5 text-[11px]",
  md: "px-3 py-1 text-xs",
};

function Badge({ variant = "info", size = "md", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-black uppercase tracking-wider rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize };
