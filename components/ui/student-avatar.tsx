"use client";

import { useState } from "react";

type StudentAvatarProps = {
  avatar: string;
  avatarGradient?: string;
  firstName?: string;
  lastName?: string;
  className?: string;
  /** Extra classes for the text fallback (size, font weight) */
  textClassName?: string;
};

function initials(firstName?: string, lastName?: string) {
  const a = firstName?.trim()?.[0] ?? "";
  const b = lastName?.trim()?.[0] ?? "";
  const result = `${a}${b}`.toUpperCase();
  return result || "?";
}

/**
 * Renders a student avatar: uploaded image URL when available, gradient + initials otherwise.
 * `avatar` holds either an http(s)/data URL (upload) or legacy initials text.
 */
export function StudentAvatar({ avatar, avatarGradient, firstName, lastName, className = "", textClassName = "" }: StudentAvatarProps) {
  const isImage = /^https?:\/\//.test(avatar) || avatar.startsWith("data:image/");

  if (isImage) {
    return <StudentAvatarImage src={avatar} alt={initials(firstName, lastName)} className={className} />;
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-display font-black text-white ${className}`}
      style={{ background: avatarGradient }}
      aria-hidden="true"
    >
      <span className={textClassName}>{initials(firstName, lastName)}</span>
    </div>
  );
}

function StudentAvatarImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`flex shrink-0 items-center justify-center bg-surface font-display font-black text-ink-soft ${className}`} aria-hidden="true">
        <span>{alt}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`shrink-0 object-cover ${className}`} onError={() => setFailed(true)} />
  );
}
