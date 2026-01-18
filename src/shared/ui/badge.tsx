import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md border border-slate-700/70 bg-slate-900/60 px-2.5 py-0.5 text-xs font-medium text-slate-200",
        className
      )}
      {...props}
    />
  )
);

Badge.displayName = "Badge";
