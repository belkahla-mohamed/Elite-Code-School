"use client";

import { useEffect, useCallback, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={cn(
          "fixed inset-0 bg-black/40 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "relative w-full rounded-brand bg-white border-2 border-[#E8EEF6] shadow-lg",
          "transition-all duration-200",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95",
          sizeStyles[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="font-display font-black text-xl text-ink">{title}</h2>
            <button
              onClick={onClose}
              className="text-ink-soft hover:text-ink transition rounded-full p-1"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 pt-4 pb-6 border-t-2 border-[#E8EEF6]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export { Modal, type ModalProps, type ModalSize };
