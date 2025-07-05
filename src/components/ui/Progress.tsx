import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "circular" | "meditation";
  showValue?: boolean;
  label?: string;
  color?: "default" | "deepTeal" | "sage" | "warmGold";
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showValue = false,
  label,
  color = "default",
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    default: "bg-deepTeal",
    deepTeal: "bg-deepTeal",
    sage: "bg-sage-500",
    warmGold: "bg-warmGold",
  };

  if (variant === "circular") {
    const radius = size === "sm" ? 20 : size === "md" ? 30 : 40;
    const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 5;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={cn("flex flex-col items-center", className)} {...props}>
        {label && (
          <span className="text-sm font-medium text-sage-700 mb-2">
            {label}
          </span>
        )}
        <div className="relative">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="text-sage-200"
            />
            {/* Progress circle */}
            <motion.circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className={cn("transition-all duration-300", colorClasses[color])}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          {showValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-sage-700">
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === "meditation") {
    return (
      <div className={cn("w-full", className)} {...props}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-sage-700">{label}</span>
            {showValue && (
              <span className="text-sm text-sage-600">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div className="relative w-full bg-sage-100 rounded-full h-2 overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              colorClasses[color],
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          {/* Breathing animation effect */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
            style={{ width: `${percentage}%` }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    );
  }

  // Default linear progress
  return (
    <div className={cn("w-full", className)} {...props}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-sage-700">{label}</span>
          {showValue && (
            <span className="text-sm text-sage-600">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-sage-200 rounded-full overflow-hidden",
          sizeClasses[size],
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export { Progress };
