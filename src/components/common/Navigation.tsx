import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: string | number;
}

interface NavigationProps {
  items: NavigationItem[];
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "pills" | "underline";
  className?: string;
  onItemClick?: (href: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  orientation = "horizontal",
  variant = "default",
  className,
  onItemClick,
}) => {
  const containerClasses = {
    horizontal: "flex items-center space-x-1",
    vertical: "flex flex-col space-y-1",
  };

  const itemClasses = {
    default: {
      base: "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-colors duration-200",
      active: "bg-deepTeal text-white",
      inactive: "text-sage-600 hover:text-sage-900 hover:bg-sage-50",
    },
    pills: {
      base: "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
      active: "bg-deepTeal text-white shadow-lg shadow-deepTeal/20",
      inactive: "text-sage-600 hover:text-sage-900 hover:bg-sage-100",
    },
    underline: {
      base: "flex items-center space-x-2 px-3 py-2 text-sm font-medium border-b-2 transition-all duration-200",
      active: "border-deepTeal text-deepTeal",
      inactive:
        "border-transparent text-sage-600 hover:text-sage-900 hover:border-sage-200",
    },
  };

  return (
    <nav className={cn(containerClasses[orientation], className)}>
      {items.map((item, index) => (
        <motion.button
          key={item.href}
          onClick={() => onItemClick?.(item.href)}
          className={cn(
            itemClasses[variant].base,
            item.isActive
              ? itemClasses[variant].active
              : itemClasses[variant].inactive,
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{
            opacity: 0,
            y: orientation === "vertical" ? 10 : 0,
            x: orientation === "horizontal" ? 10 : 0,
          }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          <span
            className={cn(
              orientation === "vertical" || "sm:inline",
              orientation === "horizontal" && "hidden sm:inline",
            )}
          >
            {item.label}
          </span>
          {item.badge && (
            <span
              className={cn(
                "ml-2 px-2 py-0.5 text-xs font-medium rounded-full",
                item.isActive
                  ? "bg-white/20 text-white"
                  : "bg-sage-100 text-sage-600",
              )}
            >
              {item.badge}
            </span>
          )}
        </motion.button>
      ))}
    </nav>
  );
};

export { Navigation, type NavigationItem };
