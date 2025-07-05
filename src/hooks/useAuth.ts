import { useState, useEffect } from "react";
import { authService } from "../services/auth";
import type { User, AuthState } from "../types";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const currentUser = await authService.getCurrentUser();

        if (currentUser.success && currentUser.data) {
          setAuthState({
            user: currentUser.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: currentUser.error || null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Authentication failed",
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error || "Login failed",
        }));
        return false;
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    username?: string,
  ): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.register({
        email,
        password,
        username,
      });

      if (response.success && response.data) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error || "Registration failed",
        }));
        return false;
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = (user: User): void => {
    setAuthState((prev) => ({
      ...prev,
      user,
    }));
  };

  const clearError = (): void => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };
}
