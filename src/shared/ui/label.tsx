import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-slate-200", className)}
      {...props}
    />
  )
);

Label.displayName = "Label";
