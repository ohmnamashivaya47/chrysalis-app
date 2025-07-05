/**
 * PWA Service
 * Handles service worker registration, installation prompts, and offline functionality
 */

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface ServiceWorkerMessage {
  type: string;
  [key: string]: unknown;
}

class PWAService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private isStandalone = false;
  private swRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // Check if app is installed
    this.checkInstallationStatus();

    // Register service worker
    this.registerServiceWorker();

    // Setup install prompt handling
    this.setupInstallPrompt();

    // Setup offline handling
    this.setupOfflineHandling();
  }

  // Service Worker Registration
  private async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        this.swRegistration = registration;

        console.log("Service Worker registered successfully:", registration);

        // Handle service worker updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker is available
                this.notifyUpdate();
              }
            });
          }
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
          this.handleServiceWorkerMessage(event.data);
        });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  // Installation Status
  private checkInstallationStatus() {
    // Check if running in standalone mode (installed PWA)
    this.isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    // Check if app is installed (various methods)
    this.isInstalled =
      this.isStandalone ||
      document.referrer.includes("android-app://") ||
      window.location.search.includes("utm_source=homescreen");

    console.log("PWA Installation Status:", {
      isInstalled: this.isInstalled,
      isStandalone: this.isStandalone,
    });
  }

  // Install Prompt Handling
  private setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      console.log("Install prompt captured");

      // Notify app that installation is available
      this.dispatchEvent("installAvailable");
    });

    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.dispatchEvent("appInstalled");
    });
  }

  // Public methods
  public async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log("Install prompt not available");
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      console.log("Install prompt result:", outcome);

      if (outcome === "accepted") {
        this.deferredPrompt = null;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error showing install prompt:", error);
      return false;
    }
  }

  public get canInstall(): boolean {
    return !!this.deferredPrompt && !this.isInstalled;
  }

  public get isAppInstalled(): boolean {
    return this.isInstalled;
  }

  public get isRunningStandalone(): boolean {
    return this.isStandalone;
  }

  // Offline functionality
  private setupOfflineHandling() {
    window.addEventListener("online", () => {
      console.log("App came online");
      this.dispatchEvent("online");
      this.syncOfflineData();
    });

    window.addEventListener("offline", () => {
      console.log("App went offline");
      this.dispatchEvent("offline");
    });
  }

  public get isOnline(): boolean {
    return navigator.onLine;
  }

  // Background sync (simplified - requires proper service worker support)
  public async requestBackgroundSync(tag: string): Promise<void> {
    console.log("Background sync requested:", tag);
    // In a real implementation, this would use the Background Sync API
    // For now, we'll just log it
  }

  // Push notifications
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported");
      return "denied";
    }

    let permission = Notification.permission;

    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    console.log("Notification permission:", permission);
    return permission;
  }

  public async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.warn("Service worker not registered");
      return null;
    }

    try {
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      const options: PushSubscriptionOptions = {
        userVisibleOnly: true,
        ...(vapidKey && { applicationServerKey: vapidKey }),
      };

      const subscription =
        await this.swRegistration.pushManager.subscribe(options);

      console.log("Push subscription created:", subscription);
      return subscription;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      return null;
    }
  }

  // Cache management
  public async clearCache(): Promise<void> {
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName)),
      );
      console.log("All caches cleared");
    }
  }

  public async getCacheSize(): Promise<number> {
    if (!("storage" in navigator) || !("estimate" in navigator.storage)) {
      return 0;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    } catch (error) {
      console.error("Error getting cache size:", error);
      return 0;
    }
  }

  // Service worker update handling
  private notifyUpdate() {
    this.dispatchEvent("updateAvailable");
  }

  public async skipWaiting(): Promise<void> {
    if (this.swRegistration?.waiting) {
      this.swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  }

  // App shortcuts (for installed PWAs)
  public async updateAppBadge(count?: number): Promise<void> {
    const nav = navigator as {
      setAppBadge?: (count: number) => Promise<void>;
      clearAppBadge?: () => Promise<void>;
    };

    if ("setAppBadge" in navigator) {
      try {
        if (count && count > 0) {
          await nav.setAppBadge?.(count);
        } else {
          await nav.clearAppBadge?.();
        }
      } catch (error) {
        console.error("Error updating app badge:", error);
      }
    }
  }

  // Share API
  public async share(data: ShareData): Promise<boolean> {
    if ("share" in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("Share cancelled by user");
        } else {
          console.error("Error sharing:", error);
        }
        return false;
      }
    }

    // Fallback to clipboard
    const nav = navigator as {
      clipboard?: { writeText: (text: string) => Promise<void> };
    };
    if (nav.clipboard && data.url) {
      try {
        await nav.clipboard.writeText(data.url);
        console.log("URL copied to clipboard");
        return true;
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        return false;
      }
    }

    return false;
  }

  // File handling (for installed PWAs)
  public handleFileOpen(files: FileList): void {
    this.dispatchEvent("filesOpened", { files });
  }

  // Private helpers
  private dispatchEvent(type: string, detail?: unknown): void {
    window.dispatchEvent(new CustomEvent(`pwa:${type}`, { detail }));
  }

  private handleServiceWorkerMessage(data: ServiceWorkerMessage): void {
    switch (data.type) {
      case "CACHE_UPDATED":
        this.dispatchEvent("cacheUpdated", data);
        break;
      case "OFFLINE_FALLBACK":
        this.dispatchEvent("offlineFallback", data);
        break;
      default:
        console.log("Unknown service worker message:", data);
    }
  }

  private async syncOfflineData(): Promise<void> {
    // Trigger sync for different data types
    await this.requestBackgroundSync("sync-meditation-data");
    await this.requestBackgroundSync("sync-social-actions");
    await this.requestBackgroundSync("sync-achievements");
  }

  // Development helpers
  public async getServiceWorkerStatus(): Promise<{
    registration: ServiceWorkerRegistration | null;
    isControlled: boolean;
    scope: string;
    state: string;
  }> {
    return {
      registration: this.swRegistration,
      isControlled: !!navigator.serviceWorker.controller,
      scope: this.swRegistration?.scope || "",
      state: this.swRegistration?.active?.state || "unknown",
    };
  }
}

// Singleton instance
export const pwaService = new PWAService();

// React hook for PWA functionality
export const usePWA = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleInstallAvailable = () => setCanInstall(true);
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };
    const handleUpdateAvailable = () => setUpdateAvailable(true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("pwa:installAvailable", handleInstallAvailable);
    window.addEventListener("pwa:appInstalled", handleAppInstalled);
    window.addEventListener("pwa:updateAvailable", handleUpdateAvailable);
    window.addEventListener("pwa:online", handleOnline);
    window.addEventListener("pwa:offline", handleOffline);

    // Initial state
    setCanInstall(pwaService.canInstall);
    setIsInstalled(pwaService.isAppInstalled);

    return () => {
      window.removeEventListener(
        "pwa:installAvailable",
        handleInstallAvailable,
      );
      window.removeEventListener("pwa:appInstalled", handleAppInstalled);
      window.removeEventListener("pwa:updateAvailable", handleUpdateAvailable);
      window.removeEventListener("pwa:online", handleOnline);
      window.removeEventListener("pwa:offline", handleOffline);
    };
  }, []);

  return {
    canInstall,
    isInstalled,
    updateAvailable,
    isOnline,
    install: () => pwaService.showInstallPrompt(),
    skipWaiting: () => pwaService.skipWaiting(),
    share: (data: ShareData) => pwaService.share(data),
    updateBadge: (count?: number) => pwaService.updateAppBadge(count),
  };
};
