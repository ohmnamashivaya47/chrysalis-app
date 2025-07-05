import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/cn";

interface HeaderProps {
  title?: string;
  showProfile?: boolean;
  showNotifications?: boolean;
  onMenuClick?: () => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showProfile = true,
  showNotifications = true,
  onMenuClick,
  className,
}) => {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-sage-100",
        className,
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {onMenuClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="lg:hidden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            )}

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-deepTeal to-sage-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-sage-900 hidden sm:block">
                Chrysalis
              </span>
            </div>

            {title && (
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-sage-900">{title}</h1>
              </div>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {showNotifications && (
              <Button variant="ghost" size="sm" className="relative">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM10.5 17H6a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v5.5"
                  />
                </svg>
                {/* Notification badge */}
                <Badge
                  variant="error"
                  size="sm"
                  className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            )}

            {showProfile && user && (
              <div className="flex items-center space-x-3">
                {/* User streak */}
                <div className="hidden sm:flex items-center space-x-1">
                  <span className="text-sm text-sage-600">🔥</span>
                  <span className="text-sm font-medium text-sage-700">
                    {user.totalMeditationMinutes || 0} min
                  </span>
                </div>

                {/* Profile button */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-warmGold to-deepTeal rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.username?.charAt(0) || user.email.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-sage-700">
                      {user.username || user.email.split("@")[0]}
                    </span>
                  </Button>
                </div>

                {/* Quick actions */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-sage-500 hover:text-sage-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export { Header };
