import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./Header";
import { Navigation, type NavigationItem } from "./Navigation";
import { cn } from "../../utils/cn";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showNavigation?: boolean;
  navigationItems?: NavigationItem[];
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showHeader = true,
  showNavigation = true,
  navigationItems = [],
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const defaultNavigationItems: NavigationItem[] = [
    {
      label: "Meditate",
      href: "/meditate",
      icon: (
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      isActive: window.location.pathname === "/meditate",
    },
    {
      label: "Social",
      href: "/social",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
      isActive: window.location.pathname === "/social",
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      isActive: window.location.pathname === "/leaderboard",
    },
    {
      label: "QR Connect",
      href: "/qr",
      icon: (
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
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
      ),
      isActive: window.location.pathname === "/qr",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      isActive: window.location.pathname === "/profile",
    },
  ];

  const navItems =
    navigationItems.length > 0 ? navigationItems : defaultNavigationItems;

  const handleNavigationClick = (href: string) => {
    // In a real app, this would use React Router
    window.location.href = href;
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
      {showHeader && (
        <Header
          title={title}
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        {showNavigation && (
          <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
            <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-sage-100">
              <div className="flex flex-col flex-1 pt-6 pb-4 overflow-y-auto">
                <Navigation
                  items={navItems}
                  orientation="vertical"
                  variant="default"
                  className="px-4 space-y-2"
                  onItemClick={handleNavigationClick}
                />
              </div>
            </div>
          </aside>
        )}

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
              >
                <div className="flex flex-col h-full pt-16">
                  <div className="flex flex-col flex-1 pt-6 pb-4 overflow-y-auto">
                    <Navigation
                      items={navItems}
                      orientation="vertical"
                      variant="default"
                      className="px-4 space-y-2"
                      onItemClick={handleNavigationClick}
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 min-h-screen",
            showHeader && "pt-16",
            showNavigation && "lg:pl-64",
            className,
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      {showNavigation && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
          <div className="bg-white border-t border-sage-100 px-4 py-2">
            <Navigation
              items={navItems.slice(0, 4)} // Show only first 4 items on mobile
              orientation="horizontal"
              variant="pills"
              className="justify-around"
              onItemClick={handleNavigationClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { Layout };
