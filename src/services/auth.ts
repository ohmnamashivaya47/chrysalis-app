/**
 * Mock Auth Service - Frontend Only
 * Provides local storage authentication without backend
 */

import type {
  User,
  LoginCredentials,
  RegisterData,
  ApiResponse,
} from "../types";

class MockAuthService {
  private users: Map<string, User> = new Map();
  private currentUserId: string | null = null;

  constructor() {
    // Initialize with some demo users
    this.initializeDemoUsers();
    // Check if user is already logged in
    const savedUserId = localStorage.getItem("currentUserId");
    if (savedUserId && this.users.has(savedUserId)) {
      this.currentUserId = savedUserId;
    }
  }

  private initializeDemoUsers() {
    const demoUsers: User[] = [
      {
        id: "demo1",
        email: "demo@chrysalis.app",
        username: "demo_user",
        bio: "Demo meditation practitioner",
        avatarUrl: undefined,
        createdAt: new Date(),
        isPublic: true,
        totalMeditationMinutes: 120,
        emailVerified: true,
        lastActive: new Date(),
        qrCode: "demo1_qr_code"
      }
    ];

    demoUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check for demo login
      if (credentials.email === "demo@chrysalis.app" && credentials.password === "demo") {
        const user = this.users.get("demo1")!;
        this.currentUserId = user.id;
        localStorage.setItem("currentUserId", user.id);
        localStorage.setItem("auth_token", "demo_token_" + user.id);

        return {
          success: true,
          data: {
            user,
            token: "demo_token_" + user.id,
          },
        };
      }

      // For any other credentials, create a new user
      const newUser: User = {
        id: "user_" + Date.now(),
        email: credentials.email,
        username: credentials.email.split("@")[0],
        bio: undefined,
        avatarUrl: undefined,
        createdAt: new Date(),
        isPublic: true,
        totalMeditationMinutes: 0,
        emailVerified: true,
        lastActive: new Date(),
        qrCode: "qr_" + Date.now()
      };

      this.users.set(newUser.id, newUser);
      this.currentUserId = newUser.id;
      localStorage.setItem("currentUserId", newUser.id);
      localStorage.setItem("auth_token", "token_" + newUser.id);

      return {
        success: true,
        data: {
          user: newUser,
          token: "token_" + newUser.id,
        },
      };
    } catch {
      return {
        success: false,
        error: "Login failed",
      };
    }
  }

  async register(
    userData: RegisterData,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newUser: User = {
        id: "user_" + Date.now(),
        email: userData.email,
        username: userData.username,
        bio: userData.bio || undefined,
        avatarUrl: undefined,
        createdAt: new Date(),
        isPublic: true,
        totalMeditationMinutes: 0,
        emailVerified: true,
        lastActive: new Date(),
        qrCode: "qr_" + Date.now()
      };

      this.users.set(newUser.id, newUser);
      this.currentUserId = newUser.id;
      localStorage.setItem("currentUserId", newUser.id);
      localStorage.setItem("auth_token", "token_" + newUser.id);

      return {
        success: true,
        data: {
          user: newUser,
          token: "token_" + newUser.id,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: "Registration failed",
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const token = localStorage.getItem("auth_token");
      const userId = localStorage.getItem("currentUserId");

      if (!token || !userId || !this.users.has(userId)) {
        return {
          success: false,
          error: "No authenticated user",
        };
      }

      const user = this.users.get(userId)!;
      this.currentUserId = userId;

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to get current user",
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      this.currentUserId = null;
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("auth_token");

      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: "Logout failed",
      };
    }
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      if (!this.currentUserId || !this.users.has(this.currentUserId)) {
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      const currentUser = this.users.get(this.currentUserId)!;
      const updatedUser = { ...currentUser, ...updates };
      this.users.set(this.currentUserId, updatedUser);

      return {
        success: true,
        data: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        error: "Profile update failed",
      };
    }
  }

  // Mock methods for other features  
  async verifyEmail(_token: string): Promise<ApiResponse<void>> {
    return { success: true, data: undefined };
  }

  async resetPassword(_email: string): Promise<ApiResponse<void>> {
    return { success: true, data: undefined };
  }

  async changePassword(_currentPassword: string, _newPassword: string): Promise<ApiResponse<void>> {
    return { success: true, data: undefined };
  }

  // Additional methods needed by API service
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem("auth_token");
    const headers = {
      ...options.headers,
      "Authorization": token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    };

    return fetch(url, { ...options, headers });
  }

  getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("auth_token");
    return {
      "Authorization": token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    };
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  getGuestSessionId(): string | null {
    return localStorage.getItem("guest_session_id");
  }
}

export const authService = new MockAuthService();
