/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

import type {
  User,
  LoginCredentials,
  RegisterData,
  ApiResponse,
} from "../types";

class AuthService {
  private baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Login failed",
        };
      }

      // Store JWT token
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      return {
        success: true,
        data: {
          user: data.user,
          token: data.token,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async register(
    userData: RegisterData,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Registration failed",
        };
      }

      // Store JWT token
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      return {
        success: true,
        data: {
          user: data.user,
          token: data.token,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const token = this.getToken();

      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
      }

      // Clear local storage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      // Clear local storage even if request fails
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      return {
        success: false,
        error: error instanceof Error ? error.message : "Logout failed",
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const token = this.getToken();

      if (!token) {
        return {
          success: false,
          error: "No authentication token found",
        };
      }

      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // Invalid token, clear storage
        if (response.status === 401) {
          this.clearAuth();
        }

        return {
          success: false,
          error: data.message || "Failed to get user data",
        };
      }

      return {
        success: true,
        data: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message,
        error: response.ok ? undefined : data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async requestPasswordReset(email: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message,
        error: response.ok ? undefined : data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message,
        error: response.ok ? undefined : data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const token = this.getToken();

      if (!token) {
        return {
          success: false,
          error: "No authentication token found",
        };
      }

      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Profile update failed",
        };
      }

      return {
        success: true,
        data: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    try {
      const token = this.getToken();

      if (!token) {
        return {
          success: false,
          error: "No authentication token found",
        };
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${this.baseUrl}/auth/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Avatar upload failed",
        };
      }

      return {
        success: true,
        data: { avatarUrl: data.avatarUrl },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async deleteAccount(): Promise<ApiResponse> {
    try {
      const token = this.getToken();

      if (!token) {
        return {
          success: false,
          error: "No authentication token found",
        };
      }

      const response = await fetch(`${this.baseUrl}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        this.clearAuth();
      }

      return {
        success: response.ok,
        message: data.message,
        error: response.ok ? undefined : data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  clearAuth(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  }

  // Guest session functionality
  async startGuestSession(): Promise<ApiResponse<{ sessionId: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Failed to start guest session",
        };
      }

      // Store guest session ID
      localStorage.setItem("guest_session", data.sessionId);

      return {
        success: true,
        data: { sessionId: data.sessionId },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  getGuestSessionId(): string | null {
    return localStorage.getItem("guest_session");
  }

  isGuestSession(): boolean {
    return !!this.getGuestSessionId() && !this.isAuthenticated();
  }

  clearGuestSession(): void {
    localStorage.removeItem("guest_session");
  }

  // Utility methods for API requests
  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async authenticatedFetch(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const headers = this.getAuthHeaders();

    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      credentials: "include",
    });
  }
}

export const authService = new AuthService();
