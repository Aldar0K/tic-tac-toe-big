import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-slate-800 bg-slate-950/60 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-500/30",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
