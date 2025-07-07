import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Spinner } from "../ui/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/cn";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  className?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  className,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email &&
      password &&
      confirmPassword &&
      agreedToTerms &&
      password === confirmPassword
    ) {
      await register(email, password, username || undefined);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 8;
  };

  const passwordsMatch = password === confirmPassword;

  const canSubmit =
    email &&
    password &&
    confirmPassword &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    passwordsMatch &&
    agreedToTerms &&
    !isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full max-w-md mx-auto", className)}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-deepTeal to-sage-500 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <CardTitle className="text-2xl font-bold text-sage-900">
            Join Chrysalis
          </CardTitle>
          <CardDescription>
            Begin your journey through mindful practice
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={
                email && !isValidEmail(email)
                  ? "Please enter a valid email"
                  : undefined
              }
              icon={
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
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              }
              disabled={isLoading}
              required
            />

            <Input
              type="text"
              placeholder="Choose a username (optional)"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={
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
              }
              disabled={isLoading}
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={
                password && !isValidPassword(password)
                  ? "Password must be at least 8 characters"
                  : undefined
              }
              icon={
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              disabled={isLoading}
              required
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={
                confirmPassword && !passwordsMatch
                  ? "Passwords do not match"
                  : undefined
              }
              icon={
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              disabled={isLoading}
              required
            />

            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-sage-300 text-deepTeal focus:ring-deepTeal"
                />
                <span className="text-sm text-sage-600">Show passwords</span>
              </label>

              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-sage-300 text-deepTeal focus:ring-deepTeal"
                  required
                />
                <span className="text-sm text-sage-600">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-deepTeal hover:text-deepTeal/80 font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-deepTeal hover:text-deepTeal/80 font-medium"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!canSubmit}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Spinner size="sm" color="white" />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {onSwitchToLogin && (
            <div className="mt-6 text-center">
              <p className="text-sm text-sage-600">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="font-medium text-deepTeal hover:text-deepTeal/80"
                >
                  Sign in here
                </button>
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-sage-100">
            <p className="text-xs text-sage-500 text-center">
              Join thousands of users on their meditation journey
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { RegisterForm };
