import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";
type SpinnerColor = "sky" | "white" | "ink-soft";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: "size-4",
  md: "size-6",
  lg: "size-10",
};

const colorMap: Record<SpinnerColor, string> = {
  sky: "text-sky",
  white: "text-white",
  "ink-soft": "text-ink-soft",
};

function LoadingSpinner({ size = "md", color = "sky", className }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin", sizeMap[size], colorMap[color], className)}
    />
  );
}

function LoadingPage({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center min-h-[50vh]", className)}>
      <LoadingSpinner size="lg" />
    </div>
  );
}

export { LoadingSpinner, LoadingPage, type LoadingSpinnerProps, type SpinnerSize };
