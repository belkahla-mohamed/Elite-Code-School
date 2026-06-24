import { cn } from "@/lib/utils";
import { Button } from "./button";
import type { ButtonProps } from "./button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps["variant"];
  };
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      {icon && <div className="mb-4 text-4xl opacity-40">{icon}</div>}
      <h3 className="font-display font-black text-xl text-ink mb-2">{title}</h3>
      {description && (
        <p className="font-body text-sm text-ink-soft max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button variant={action.variant || "primary"} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState, type EmptyStateProps };
