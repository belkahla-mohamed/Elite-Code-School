"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block font-body text-sm font-semibold text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-brand-sm border-2 bg-white dark:bg-surface px-4 py-2.5 font-body text-ink",
            "placeholder:text-ink-soft/50 transition duration-200",
            "focus:outline-none focus:border-sky",
            error ? "border-coral" : "border-[#E8EEF6] dark:border-border",
            props.disabled && "bg-surface opacity-60 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-coral">{error}</p>}
        {helperText && !error && <p className="text-sm text-ink-soft">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block font-body text-sm font-semibold text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-brand-sm border-2 bg-white dark:bg-surface px-4 py-2.5 font-body text-ink min-h-[100px] resize-y",
            "placeholder:text-ink-soft/50 transition duration-200",
            "focus:outline-none focus:border-sky",
            error ? "border-coral" : "border-[#E8EEF6] dark:border-border",
            props.disabled && "bg-surface opacity-60 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-coral">{error}</p>}
        {helperText && !error && <p className="text-sm text-ink-soft">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block font-body text-sm font-semibold text-ink">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full rounded-brand-sm border-2 bg-white dark:bg-surface px-4 py-2.5 font-body text-ink",
            "transition duration-200 appearance-none cursor-pointer",
            "focus:outline-none focus:border-sky",
            error ? "border-coral" : "border-[#E8EEF6] dark:border-border",
            props.disabled && "bg-surface opacity-60 cursor-not-allowed",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-coral">{error}</p>}
        {helperText && !error && <p className="text-sm text-ink-soft">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Input, Textarea, Select };
export type { InputProps, TextareaProps, SelectProps };
