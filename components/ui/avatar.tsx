import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  alt: string;
  fallback: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: "size-8", text: "text-xs" },
  md: { container: "size-10", text: "text-sm" },
  lg: { container: "size-14", text: "text-lg" },
  xl: { container: "size-20", text: "text-2xl" },
};

function Avatar({ src, alt, fallback, size = "md", className }: AvatarProps) {
  const dims = sizeStyles[size];
  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden border-2 border-white shrink-0",
        "bg-gradient-to-br from-sky to-cyan",
        dims.container,
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-display font-black text-white",
            dims.text
          )}
        >
          {fallback.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export { Avatar, type AvatarProps, type AvatarSize };
