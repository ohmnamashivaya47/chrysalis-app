/**
 * API Client Service
 * Centralized API communication with error handling and authentication
 */

import type { ApiResponse, PaginatedResponse } from "../types";
import { authService } from "./auth";

class ApiClient {
  private baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  private defaultTimeout = 10000; // 10 seconds

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);

    try {
      const response = await authService.authenticatedFetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: "Request timeout",
          };
        }

        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: "Network error",
      };
    }
  }

  // Generic CRUD methods
  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestInit,
  ): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "POST",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      ...config,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      headers: { "Content-Type": "application/json" },
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      headers: { "Content-Type": "application/json" },
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // File upload method
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers = authService.getAuthHeaders();
    delete headers["Content-Type"]; // Let browser set Content-Type with boundary

    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers,
    });
  }

  // Paginated requests
  async getPaginated<T>(
    endpoint: string,
    page: number = 1,
    limit: number = 20,
    additionalParams?: Record<string, string | number>,
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(additionalParams || {}).map(([key, value]) => [
          key,
          value.toString(),
        ]),
      ),
    });

    return this.request<PaginatedResponse<T>>(
      `${endpoint}?${params.toString()}`,
    );
  }

  // Batch operations
  async batch<T>(
    requests: Array<{ endpoint: string; method: string; data?: unknown }>,
  ): Promise<ApiResponse<T[]>> {
    return this.request<T[]>("/batch", {
      method: "POST",
      body: JSON.stringify({ requests }),
    });
  }

  // Health check
  async healthCheck(): Promise<
    ApiResponse<{ status: string; timestamp: string }>
  > {
    return this.request("/health", { method: "GET" });
  }

  // Search functionality
  async search<T>(
    endpoint: string,
    query: string,
    filters?: Record<string, unknown>,
  ): Promise<ApiResponse<T[]>> {
    const params = new URLSearchParams({
      q: query,
      ...Object.fromEntries(
        Object.entries(filters || {}).map(([key, value]) => [
          key,
          JSON.stringify(value),
        ]),
      ),
    });

    return this.request<T[]>(`${endpoint}?${params.toString()}`);
  }

  // WebSocket connection URL
  getWebSocketUrl(path: string = ""): string {
    const wsUrl = this.baseUrl.replace(/^http/, "ws");
    const token = authService.getToken();
    const params = new URLSearchParams();

    if (token) {
      params.append("token", token);
    }

    const guestSession = authService.getGuestSessionId();
    if (guestSession) {
      params.append("guestSession", guestSession);
    }

    return `${wsUrl}/ws${path}?${params.toString()}`;
  }

  // Rate limiting helpers
  private rateLimitTracker = new Map<
    string,
    { count: number; resetTime: number }
  >();

  private checkRateLimit(endpoint: string): boolean {
    const now = Date.now();
    const key = endpoint;
    const limit = this.rateLimitTracker.get(key);

    if (!limit || now > limit.resetTime) {
      this.rateLimitTracker.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute window
      return true;
    }

    if (limit.count >= 100) {
      // 100 requests per minute
      return false;
    }

    limit.count++;
    return true;
  }

  async rateLimitedRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    if (!this.checkRateLimit(endpoint)) {
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      };
    }

    return this.request<T>(endpoint, options);
  }

  // Retry logic for failed requests
  async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    maxRetries: number = 3,
  ): Promise<ApiResponse<T>> {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await this.request<T>(endpoint, options);

        if (result.success) {
          return result;
        }

        // Don't retry on client errors (4xx)
        if (result.error && result.error.includes("HTTP 4")) {
          return result;
        }

        lastError = result.error;

        // Exponential backoff
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000),
          );
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : "Unknown error";

        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000),
          );
        }
      }
    }

    return {
      success: false,
      error: lastError || "Request failed after retries",
    };
  }

  // Cache management
  private cache = new Map<string, { data: unknown; expiry: number }>();

  async getCached<T>(
    endpoint: string,
    ttl: number = 300000, // 5 minutes default
  ): Promise<ApiResponse<T>> {
    const now = Date.now();
    const cached = this.cache.get(endpoint);

    if (cached && now < cached.expiry) {
      return {
        success: true,
        data: cached.data as T,
      };
    }

    const result = await this.get<T>(endpoint);

    if (result.success && result.data) {
      this.cache.set(endpoint, {
        data: result.data,
        expiry: now + ttl,
      });
    }

    return result;
  }

  clearCache(endpoint?: string): void {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }

  // Network status monitoring
  private isOnline = navigator.onLine;
  private networkListeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.networkListeners.forEach((listener) => listener(true));
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.networkListeners.forEach((listener) => listener(false));
    });
  }

  onNetworkChange(listener: (isOnline: boolean) => void): void {
    this.networkListeners.push(listener);
  }

  removeNetworkListener(listener: (isOnline: boolean) => void): void {
    const index = this.networkListeners.indexOf(listener);
    if (index > -1) {
      this.networkListeners.splice(index, 1);
    }
  }

  getNetworkStatus(): boolean {
    return this.isOnline;
  }

  // Request interceptors
  private requestInterceptors: Array<(options: RequestInit) => RequestInit> =
    [];
  private responseInterceptors: Array<
    (response: Response) => Response | Promise<Response>
  > = [];

  addRequestInterceptor(
    interceptor: (options: RequestInit) => RequestInit,
  ): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(
    interceptor: (response: Response) => Response | Promise<Response>,
  ): void {
    this.responseInterceptors.push(interceptor);
  }
}

export const apiClient = new ApiClient();
