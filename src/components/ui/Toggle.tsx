import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  description?: string;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  label,
  description,
  className,
}) => {
  const sizeClasses = {
    sm: {
      track: "w-8 h-4",
      thumb: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      track: "w-10 h-5",
      thumb: "w-4 h-4",
      translate: "translate-x-5",
    },
    lg: {
      track: "w-12 h-6",
      thumb: "w-5 h-5",
      translate: "translate-x-6",
    },
  };

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-deepTeal focus:ring-offset-2",
          sizeClasses[size].track,
          checked ? "bg-deepTeal" : "bg-sage-200",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <motion.span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
            sizeClasses[size].thumb,
          )}
          animate={{
            x: checked
              ? sizeClasses[size].translate.replace("translate-x-", "")
              : "0",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label
              className="text-sm font-medium text-sage-900 cursor-pointer"
              onClick={handleToggle}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-sage-600">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export { Toggle };
