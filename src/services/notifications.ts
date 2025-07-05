import { apiClient } from "./api";

export type NotificationType =
  | "meditation_reminder"
  | "achievement_unlocked"
  | "friend_activity"
  | "group_invitation"
  | "streak_milestone"
  | "session_milestone"
  | "system_update"
  | "social_interaction";

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  userId: string;
  isRead: boolean;
  createdAt: Date;
  scheduledFor?: Date;
}

export interface NotificationSettings {
  enabled: boolean;
  meditationReminders: boolean;
  achievements: boolean;
  socialActivity: boolean;
  systemUpdates: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  reminderTimes: string[]; // Array of HH:MM times
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class NotificationService {
  private static instance: NotificationService;
  private settings: NotificationSettings;
  private registration: ServiceWorkerRegistration | null = null;
  private pushSubscription: globalThis.PushSubscription | null = null;

  private constructor() {
    this.settings = this.loadSettings();
    this.initializeServiceWorker();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Permission and Setup
  public async requestPermission(): Promise<boolean> {
    try {
      if (!("Notification" in window)) {
        console.warn("This browser does not support notifications");
        return false;
      }

      if (Notification.permission === "granted") {
        return true;
      }

      if (Notification.permission === "denied") {
        return false;
      }

      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      return false;
    }
  }

  public hasPermission(): boolean {
    return "Notification" in window && Notification.permission === "granted";
  }

  public async initializeServiceWorker(): Promise<void> {
    try {
      if ("serviceWorker" in navigator) {
        this.registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered successfully");

        // Set up push subscription if permission granted
        if (this.hasPermission()) {
          await this.setupPushSubscription();
        }
      }
    } catch (error) {
      console.error("Failed to register service worker:", error);
    }
  }

  private async setupPushSubscription(): Promise<void> {
    try {
      if (!this.registration) return;

      // Get existing subscription
      this.pushSubscription =
        await this.registration.pushManager.getSubscription();

      if (!this.pushSubscription) {
        // Create new subscription
        const vapidPublicKey = await this.getVapidPublicKey();

        this.pushSubscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey,
        });

        // Send subscription to server
        await this.sendSubscriptionToServer(this.pushSubscription);
      }
    } catch (error) {
      console.error("Failed to setup push subscription:", error);
    }
  }

  private async getVapidPublicKey(): Promise<string> {
    try {
      const response = await apiClient.get<{ publicKey: string }>(
        "/notifications/vapid-key",
      );
      return response.data?.publicKey || "";
    } catch (error) {
      console.error("Failed to get VAPID public key:", error);
      // Return a default key or empty string
      return "";
    }
  }

  private async sendSubscriptionToServer(
    subscription: globalThis.PushSubscription,
  ): Promise<void> {
    try {
      const subscriptionData: PushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey("p256dh")),
          auth: this.arrayBufferToBase64(subscription.getKey("auth")),
        },
      };

      await apiClient.post("/notifications/subscribe", subscriptionData);
    } catch (error) {
      console.error("Failed to send subscription to server:", error);
    }
  }

  // Settings Management
  public getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  public async updateSettings(
    updates: Partial<NotificationSettings>,
  ): Promise<boolean> {
    try {
      this.settings = { ...this.settings, ...updates };

      // Save locally
      this.saveSettings();

      // Save to server
      await apiClient.put("/notifications/settings", this.settings);

      // Update scheduled notifications
      await this.updateScheduledNotifications();

      return true;
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      return false;
    }
  }

  private loadSettings(): NotificationSettings {
    try {
      const saved = localStorage.getItem("notification_settings");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load notification settings:", error);
    }

    return {
      enabled: true,
      meditationReminders: true,
      achievements: true,
      socialActivity: true,
      systemUpdates: true,
      quietHours: {
        enabled: false,
        start: "22:00",
        end: "08:00",
      },
      reminderTimes: ["09:00", "18:00"],
    };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(
        "notification_settings",
        JSON.stringify(this.settings),
      );
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    }
  }

  // Local Notifications
  public async showLocalNotification(
    title: string,
    body: string,
    options?: {
      icon?: string;
      badge?: string;
      tag?: string;
      data?: Record<string, unknown>;
    },
  ): Promise<void> {
    try {
      if (!this.hasPermission() || !this.settings.enabled) {
        return;
      }

      // Check quiet hours
      if (this.isQuietHours()) {
        return;
      }

      const notificationOptions: NotificationOptions = {
        body,
        icon: options?.icon || "/icons/icon-192x192.png",
        badge: options?.badge || "/icons/badge-72x72.png",
        tag: options?.tag,
        data: options?.data,
        requireInteraction: false,
        silent: false,
      };

      if (this.registration && "showNotification" in this.registration) {
        // Use service worker notification
        await this.registration.showNotification(title, notificationOptions);
      } else {
        // Use browser notification
        new Notification(title, notificationOptions);
      }
    } catch (error) {
      console.error("Failed to show local notification:", error);
    }
  }

  // Scheduled Notifications (Meditation Reminders)
  public async scheduleMeditationReminder(
    time: string,
    message?: string,
  ): Promise<boolean> {
    try {
      if (!this.settings.meditationReminders) {
        return false;
      }

      const reminderData = {
        type: "meditation_reminder" as NotificationType,
        time,
        message: message || "Time for your meditation session! 🧘‍♀️",
        title: "Meditation Reminder",
      };

      await apiClient.post("/notifications/schedule", reminderData);

      // Also schedule locally as backup
      this.scheduleLocalReminder(
        time,
        reminderData.title,
        reminderData.message,
      );

      return true;
    } catch (error) {
      console.error("Failed to schedule meditation reminder:", error);
      return false;
    }
  }

  private scheduleLocalReminder(
    time: string,
    title: string,
    message: string,
  ): void {
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const now = new Date();
      const scheduledTime = new Date();

      scheduledTime.setHours(hours, minutes, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const delay = scheduledTime.getTime() - now.getTime();

      setTimeout(() => {
        this.showLocalNotification(title, message, {
          tag: "meditation-reminder",
          data: { type: "meditation_reminder", time },
        });

        // Reschedule for next day
        this.scheduleLocalReminder(time, title, message);
      }, delay);
    } catch (error) {
      console.error("Failed to schedule local reminder:", error);
    }
  }

  public async updateScheduledNotifications(): Promise<void> {
    try {
      // Cancel existing scheduled notifications
      await apiClient.delete("/notifications/scheduled");

      // Reschedule based on current settings
      if (this.settings.meditationReminders) {
        for (const time of this.settings.reminderTimes) {
          await this.scheduleMeditationReminder(time);
        }
      }
    } catch (error) {
      console.error("Failed to update scheduled notifications:", error);
    }
  }

  // Achievement Notifications
  public async showAchievementNotification(
    achievementName: string,
    description: string,
  ): Promise<void> {
    if (!this.settings.achievements) return;

    await this.showLocalNotification(
      "🏆 Achievement Unlocked!",
      `${achievementName}: ${description}`,
      {
        tag: "achievement",
        data: { type: "achievement_unlocked", achievement: achievementName },
      },
    );
  }

  // Social Notifications
  public async showSocialNotification(
    type: "follow" | "like" | "comment" | "group_invite",
    data: {
      username: string;
      content?: string;
      groupName?: string;
    },
  ): Promise<void> {
    if (!this.settings.socialActivity) return;

    let title = "";
    let body = "";

    switch (type) {
      case "follow":
        title = "New Follower";
        body = `${data.username} started following you`;
        break;
      case "like":
        title = "Post Liked";
        body = `${data.username} liked your post`;
        break;
      case "comment":
        title = "New Comment";
        body = `${data.username} commented on your post`;
        break;
      case "group_invite":
        title = "Group Invitation";
        body = `${data.username} invited you to join ${data.groupName}`;
        break;
    }

    await this.showLocalNotification(title, body, {
      tag: `social-${type}`,
      data: { type: "social_interaction", socialType: type, ...data },
    });
  }

  // Streak and Milestone Notifications
  public async showStreakNotification(streak: number): Promise<void> {
    const title = "🔥 Streak Milestone!";
    const body = `Congratulations! You've maintained a ${streak}-day meditation streak!`;

    await this.showLocalNotification(title, body, {
      tag: "streak-milestone",
      data: { type: "streak_milestone", streak },
    });
  }

  public async showSessionMilestone(totalSessions: number): Promise<void> {
    const title = "🎯 Session Milestone!";
    const body = `Amazing! You've completed ${totalSessions} meditation sessions!`;

    await this.showLocalNotification(title, body, {
      tag: "session-milestone",
      data: { type: "session_milestone", totalSessions },
    });
  }

  // Utility Methods
  private isQuietHours(): boolean {
    if (!this.settings.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMinute] = this.settings.quietHours.start
      .split(":")
      .map(Number);
    const [endHour, endMinute] = this.settings.quietHours.end
      .split(":")
      .map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime < endTime) {
      // Same day range (e.g., 22:00 to 23:00)
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight range (e.g., 22:00 to 08:00)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer | null): string {
    if (!buffer) return "";
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Cleanup
  public async unsubscribeFromPush(): Promise<boolean> {
    try {
      if (this.pushSubscription) {
        await this.pushSubscription.unsubscribe();
        await apiClient.delete("/notifications/unsubscribe");
        this.pushSubscription = null;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
      return false;
    }
  }

  public clearAllNotifications(): void {
    try {
      if (this.registration && "getNotifications" in this.registration) {
        this.registration.getNotifications().then((notifications) => {
          notifications.forEach((notification) => notification.close());
        });
      }
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  }

  // Testing (Development only)
  public async testNotification(): Promise<void> {
    await this.showLocalNotification(
      "Test Notification",
      "This is a test notification from Chrysalis",
      {
        tag: "test",
        data: { type: "system_update", test: true },
      },
    );
  }
}

export const notificationService = NotificationService.getInstance();
