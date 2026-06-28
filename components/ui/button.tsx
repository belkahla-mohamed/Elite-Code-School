"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-sky text-white hover:bg-sky-dark active:bg-sky-dark disabled:bg-sky/50",
  secondary:
    "bg-white dark:bg-surface text-ink border-2 border-[#E8EEF6] dark:border-border hover:border-sky hover:text-sky active:border-sky disabled:opacity-50",
  ghost:
    "bg-transparent text-ink-soft hover:text-ink hover:bg-surface active:bg-surface/80 disabled:opacity-50",
  danger:
    "bg-coral/10 text-coral hover:bg-coral/20 active:bg-coral/30 disabled:opacity-50",
  icon:
    "bg-transparent text-ink-soft hover:text-ink hover:bg-surface active:bg-surface/80 disabled:opacity-50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-13 px-8 text-sm gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-black uppercase tracking-wide",
        "rounded-full transition duration-200 select-none",
        variant !== "icon" && sizeStyles[size],
        variant === "icon" && "size-10 rounded-full",
        variantStyles[variant],
        (disabled || isLoading) && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  )
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
