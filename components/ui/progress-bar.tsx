"use client";

import { cn } from "@/lib/utils";

type ProgressColor = "primary" | "success" | "accent";
type ProgressSize = "sm" | "md" | "lg";

interface ProgressBarProps {
  value: number;
  color?: ProgressColor;
  size?: ProgressSize;
  showLabel?: boolean;
  className?: string;
}

function getBarColor(value: number) {
  if (value < 30) return "bg-amber";
  if (value <= 70) return "bg-sky";
  return "bg-lime";
}

const heightStyles: Record<ProgressSize, string> = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

function ProgressBar({
  value,
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex-1 rounded-full bg-[#E8EEF6] overflow-hidden",
          heightStyles[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-600 ease-out",
            getBarColor(clamped)
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-bold text-ink-soft tabular-nums shrink-0">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}

export { ProgressBar, type ProgressBarProps, type ProgressColor, type ProgressSize };
