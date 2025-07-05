import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      variant = "default",
      size = "md",
      icon,
      iconPosition = "left",
      disabled,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-3 text-sm",
      lg: "h-11 px-4 text-base",
    };

    const variantClasses = {
      default:
        "border border-sage-200 bg-white focus:border-deepTeal focus:ring-2 focus:ring-deepTeal/20",
      filled:
        "border-0 bg-sage-50 focus:bg-white focus:ring-2 focus:ring-deepTeal/20",
      outlined: "border-2 border-sage-300 bg-transparent focus:border-deepTeal",
    };

    const iconClasses = {
      left: icon ? "pl-10" : "",
      right: icon ? "pr-10" : "",
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-sage-700">{label}</label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex w-full rounded-xl transition-all duration-200 placeholder:text-sage-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size],
              variantClasses[variant],
              iconClasses[iconPosition],
              error &&
                "border-red-300 focus:border-red-500 focus:ring-red-500/20",
              className,
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
