import React from "react";
import { motion } from "framer-motion";
import { Spinner } from "../ui/Spinner";
import { LoginForm } from "./LoginForm";
import { useAuth } from "../../hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Spinner size="lg" variant="meditation" />
          <p className="mt-4 text-sage-600">Loading your meditation space...</p>
        </motion.div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white p-4">
          <LoginForm />
        </div>
      )
    );
  }

  // If authentication is not required or user is authenticated
  return <>{children}</>;
};

export { AuthGuard };
