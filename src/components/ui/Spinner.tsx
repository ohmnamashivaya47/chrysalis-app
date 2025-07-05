import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "pulse" | "meditation";
  color?: "default" | "deepTeal" | "sage" | "warmGold" | "white";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "default",
  color = "default",
  className,
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    default: "text-deepTeal",
    deepTeal: "text-deepTeal",
    sage: "text-sage-500",
    warmGold: "text-warmGold",
    white: "text-white",
  };

  if (variant === "dots") {
    const dotSize = {
      xs: "w-1 h-1",
      sm: "w-1.5 h-1.5",
      md: "w-2 h-2",
      lg: "w-2.5 h-2.5",
      xl: "w-3 h-3",
    };

    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full",
              dotSize[size],
              `bg-current ${colorClasses[color]}`,
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={cn(
          "rounded-full bg-current",
          sizeClasses[size],
          colorClasses[color],
          className,
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  if (variant === "meditation") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        {/* Outer ring */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-current opacity-20",
            colorClasses[color],
          )}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Inner circle */}
        <motion.div
          className={cn(
            "absolute inset-2 rounded-full bg-current",
            colorClasses[color],
          )}
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  // Default spinner
  return (
    <motion.div
      className={cn(
        "border-2 border-current border-t-transparent rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export { Spinner };
