"use client";

import { useState, useCallback } from "react";
import { getOptimizedUrl } from "@/lib/image-url";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackInitial?: string;
  sizes?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height,
  className = "",
  fallbackInitial,
  sizes,
  priority = false,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  const handleError = useCallback(() => setError(true), []);

  if (!src || src === "" || error) {
    const initial = fallbackInitial || "?";
    return (
      <div className={`bg-gradient-to-br from-surface to-border flex items-center justify-center ${className}`}>
        <span className="text-4xl font-black text-ink-soft/30">{initial}</span>
      </div>
    );
  }

  const optimizedSrc = getOptimizedUrl(src, { width, height });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={handleError}
      {...(sizes ? { sizes } : {})}
    />
  );
}
