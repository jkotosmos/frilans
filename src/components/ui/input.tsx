import { forwardRef } from "react";
import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border border-ink-200 bg-cream-50 px-3.5 text-[0.95rem] text-ink-900 placeholder:text-ink-300",
        "outline-none transition-colors focus:border-rust-400 focus:ring-2 focus:ring-rust-100",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-ink-200 bg-cream-50 px-3.5 py-3 text-[0.95rem] text-ink-900 placeholder:text-ink-300",
        "outline-none transition-colors focus:border-rust-400 focus:ring-2 focus:ring-rust-100",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-ink-700", className)} {...props} />;
}

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border border-ink-200 bg-cream-50 px-3.5 text-[0.95rem] text-ink-900",
        "outline-none transition-colors focus:border-rust-400 focus:ring-2 focus:ring-rust-100",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
