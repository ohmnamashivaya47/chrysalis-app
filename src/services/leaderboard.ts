import { apiClient } from "./api";
import type {
  LeaderboardGroup,
  GroupMember,
  LeaderboardEntry,
  Achievement,
  UserAchievement,
} from "../types";

export interface LeaderboardStats {
  totalMinutes: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  points: number;
  level: number;
}

export interface GroupStats {
  totalMembers: number;
  totalMinutes: number;
  averageMinutesPerMember: number;
  topPerformers: LeaderboardEntry[];
  recentActivity: {
    userId: string;
    username: string;
    minutes: number;
    timestamp: Date;
  }[];
}

export class LeaderboardService {
  private static instance: LeaderboardService;
  private groupsCache: Map<string, LeaderboardGroup> = new Map();
  private statsCache: Map<string, LeaderboardStats> = new Map();
  private lastFetchTime: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  private constructor() {}

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  // Group Management
  public async createGroup(groupData: {
    name: string;
    description?: string;
    isPublic: boolean;
    maxMembers?: number;
  }): Promise<LeaderboardGroup | null> {
    try {
      const response = await apiClient.post<LeaderboardGroup>(
        "/groups",
        groupData,
      );

      if (response.data) {
        this.groupsCache.set(response.data.id, response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to create group:", error);
      return null;
    }
  }

  public async updateGroup(
    groupId: string,
    updates: {
      name?: string;
      description?: string;
      isPublic?: boolean;
      maxMembers?: number;
    },
  ): Promise<LeaderboardGroup | null> {
    try {
      const response = await apiClient.put<LeaderboardGroup>(
        `/groups/${groupId}`,
        updates,
      );

      if (response.data) {
        this.groupsCache.set(groupId, response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to update group:", error);
      return null;
    }
  }

  public async deleteGroup(groupId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/groups/${groupId}`);

      this.groupsCache.delete(groupId);
      this.clearCacheForGroup(groupId);
      return true;
    } catch (error) {
      console.error("Failed to delete group:", error);
      return false;
    }
  }

  public async getGroup(groupId: string): Promise<LeaderboardGroup | null> {
    try {
      // Check cache first
      if (this.groupsCache.has(groupId)) {
        return this.groupsCache.get(groupId)!;
      }

      const response = await apiClient.get<LeaderboardGroup>(
        `/groups/${groupId}`,
      );

      if (response.data) {
        this.groupsCache.set(groupId, response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to get group:", error);
      return null;
    }
  }

  public async getUserGroups(userId?: string): Promise<LeaderboardGroup[]> {
    try {
      const endpoint = userId ? `/users/${userId}/groups` : "/groups/mine";
      const response = await apiClient.get<LeaderboardGroup[]>(endpoint);

      if (response.data) {
        // Cache groups
        response.data.forEach((group) => {
          this.groupsCache.set(group.id, group);
        });
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to get user groups:", error);
      return [];
    }
  }

  public async getPublicGroups(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    groups: LeaderboardGroup[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await apiClient.get<{
        items: LeaderboardGroup[];
        total: number;
        hasNext: boolean;
      }>(`/groups/public?page=${page}&limit=${limit}`);

      if (response.data) {
        // Cache groups
        response.data.items.forEach((group) => {
          this.groupsCache.set(group.id, group);
        });

        return {
          groups: response.data.items,
          total: response.data.total,
          hasMore: response.data.hasNext,
        };
      }

      return { groups: [], total: 0, hasMore: false };
    } catch (error) {
      console.error("Failed to get public groups:", error);
      return { groups: [], total: 0, hasMore: false };
    }
  }

  // Member Management
  public async joinGroup(groupId: string, joinCode?: string): Promise<boolean> {
    try {
      const body = joinCode ? { joinCode } : {};
      await apiClient.post(`/groups/${groupId}/join`, body);

      // Clear cache to force refresh
      this.clearCacheForGroup(groupId);
      return true;
    } catch (error) {
      console.error("Failed to join group:", error);
      return false;
    }
  }

  public async leaveGroup(groupId: string): Promise<boolean> {
    try {
      await apiClient.post(`/groups/${groupId}/leave`);

      // Clear cache to force refresh
      this.clearCacheForGroup(groupId);
      return true;
    } catch (error) {
      console.error("Failed to leave group:", error);
      return false;
    }
  }

  public async removeGroupMember(
    groupId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      await apiClient.delete(`/groups/${groupId}/members/${userId}`);

      // Clear cache to force refresh
      this.clearCacheForGroup(groupId);
      return true;
    } catch (error) {
      console.error("Failed to remove group member:", error);
      return false;
    }
  }

  public async updateMemberRole(
    groupId: string,
    userId: string,
    role: "member" | "admin" | "moderator",
  ): Promise<boolean> {
    try {
      await apiClient.put(`/groups/${groupId}/members/${userId}`, { role });

      // Clear cache to force refresh
      this.clearCacheForGroup(groupId);
      return true;
    } catch (error) {
      console.error("Failed to update member role:", error);
      return false;
    }
  }

  public async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const response = await apiClient.get<GroupMember[]>(
        `/groups/${groupId}/members`,
      );

      return response.data || [];
    } catch (error) {
      console.error("Failed to get group members:", error);
      return [];
    }
  }

  // Leaderboard and Stats
  public async getGroupLeaderboard(
    groupId: string,
    period: "daily" | "weekly" | "monthly" | "all-time" = "weekly",
    refresh: boolean = false,
  ): Promise<LeaderboardEntry[]> {
    const cacheKey = `leaderboard_${groupId}_${period}`;
    const now = Date.now();
    const lastFetch = this.lastFetchTime.get(cacheKey) || 0;

    // Return cached data if fresh and not forcing refresh
    if (!refresh && now - lastFetch < this.CACHE_DURATION) {
      const cached = this.getCachedLeaderboard(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await apiClient.get<LeaderboardEntry[]>(
        `/groups/${groupId}/leaderboard?period=${period}`,
      );

      if (response.data) {
        this.cacheLeaderboard(cacheKey, response.data);
        this.lastFetchTime.set(cacheKey, now);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to get group leaderboard:", error);
      return [];
    }
  }

  public async getGlobalLeaderboard(
    period: "daily" | "weekly" | "monthly" | "all-time" = "weekly",
    limit: number = 50,
  ): Promise<LeaderboardEntry[]> {
    try {
      const response = await apiClient.get<LeaderboardEntry[]>(
        `/leaderboard/global?period=${period}&limit=${limit}`,
      );

      return response.data || [];
    } catch (error) {
      console.error("Failed to get global leaderboard:", error);
      return [];
    }
  }

  public async getUserStats(userId?: string): Promise<LeaderboardStats | null> {
    const cacheKey = `stats_${userId || "me"}`;
    const now = Date.now();
    const lastFetch = this.lastFetchTime.get(cacheKey) || 0;

    // Return cached data if fresh
    if (
      now - lastFetch < this.CACHE_DURATION &&
      this.statsCache.has(cacheKey)
    ) {
      return this.statsCache.get(cacheKey)!;
    }

    try {
      const endpoint = userId ? `/users/${userId}/stats` : "/users/me/stats";
      const response = await apiClient.get<LeaderboardStats>(endpoint);

      if (response.data) {
        this.statsCache.set(cacheKey, response.data);
        this.lastFetchTime.set(cacheKey, now);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to get user stats:", error);
      return null;
    }
  }

  public async getGroupStats(groupId: string): Promise<GroupStats | null> {
    try {
      const response = await apiClient.get<GroupStats>(
        `/groups/${groupId}/stats`,
      );

      return response.data || null;
    } catch (error) {
      console.error("Failed to get group stats:", error);
      return null;
    }
  }

  // Achievements
  public async getUserAchievements(
    userId?: string,
  ): Promise<UserAchievement[]> {
    try {
      const endpoint = userId
        ? `/users/${userId}/achievements`
        : "/users/me/achievements";
      const response = await apiClient.get<UserAchievement[]>(endpoint);

      return response.data || [];
    } catch (error) {
      console.error("Failed to get user achievements:", error);
      return [];
    }
  }

  public async getAvailableAchievements(): Promise<Achievement[]> {
    try {
      const response = await apiClient.get<Achievement[]>("/achievements");

      return response.data || [];
    } catch (error) {
      console.error("Failed to get available achievements:", error);
      return [];
    }
  }

  // Search and Discovery
  public async searchGroups(query: string): Promise<LeaderboardGroup[]> {
    try {
      const response = await apiClient.get<LeaderboardGroup[]>(
        `/groups/search?q=${encodeURIComponent(query)}`,
      );

      if (response.data) {
        // Cache groups
        response.data.forEach((group) => {
          this.groupsCache.set(group.id, group);
        });
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to search groups:", error);
      return [];
    }
  }

  // Utility Methods
  public calculateLevel(totalMinutes: number): number {
    // Level calculation: every 60 minutes = 1 level
    return Math.floor(totalMinutes / 60) + 1;
  }

  public calculatePoints(
    totalMinutes: number,
    sessionsCount: number,
    streak: number,
  ): number {
    // Points calculation: 1 point per minute + bonus for sessions and streaks
    const minutePoints = totalMinutes;
    const sessionBonus = sessionsCount * 5;
    const streakBonus = streak * 10;

    return minutePoints + sessionBonus + streakBonus;
  }

  public getNextLevelProgress(totalMinutes: number): {
    currentLevel: number;
    nextLevel: number;
    minutesForNext: number;
    progress: number;
  } {
    const currentLevel = this.calculateLevel(totalMinutes);
    const nextLevel = currentLevel + 1;
    const minutesForCurrentLevel = (currentLevel - 1) * 60;
    const minutesForNextLevel = currentLevel * 60;
    const minutesForNext = minutesForNextLevel - totalMinutes;
    const progress = ((totalMinutes - minutesForCurrentLevel) / 60) * 100;

    return {
      currentLevel,
      nextLevel,
      minutesForNext: Math.max(0, minutesForNext),
      progress: Math.min(100, Math.max(0, progress)),
    };
  }

  public formatStreakText(streak: number): string {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "1 day streak";
    if (streak < 7) return `${streak} day streak`;
    if (streak < 30) return `${Math.floor(streak / 7)} week streak`;
    return `${Math.floor(streak / 30)} month streak`;
  }

  public getRankChange(
    currentRank: number,
    previousRank: number,
  ): {
    change: number;
    direction: "up" | "down" | "same";
    emoji: string;
  } {
    const change = previousRank - currentRank; // Positive = moved up

    if (change > 0) {
      return { change, direction: "up", emoji: "📈" };
    } else if (change < 0) {
      return { change: Math.abs(change), direction: "down", emoji: "📉" };
    } else {
      return { change: 0, direction: "same", emoji: "➡️" };
    }
  }

  // Cache Management
  private getCachedLeaderboard(cacheKey: string): LeaderboardEntry[] | null {
    try {
      const cached = localStorage.getItem(`leaderboard_${cacheKey}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  private cacheLeaderboard(cacheKey: string, data: LeaderboardEntry[]): void {
    try {
      localStorage.setItem(`leaderboard_${cacheKey}`, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to cache leaderboard:", error);
    }
  }

  private clearCacheForGroup(groupId: string): void {
    this.groupsCache.delete(groupId);

    // Clear related cached data
    const keysToRemove: string[] = [];
    this.lastFetchTime.forEach((_, key) => {
      if (key.includes(groupId)) {
        keysToRemove.push(key);
      }
    });

    keysToRemove.forEach((key) => {
      this.lastFetchTime.delete(key);
      localStorage.removeItem(`leaderboard_${key}`);
    });
  }

  public clearAllCache(): void {
    this.groupsCache.clear();
    this.statsCache.clear();
    this.lastFetchTime.clear();

    // Clear localStorage cache
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("leaderboard_")) {
        localStorage.removeItem(key);
      }
    });
  }

  // Real-time updates (would be connected to Socket.io)
  public onLeaderboardUpdate(
    callback: (groupId: string, leaderboard: LeaderboardEntry[]) => void,
  ): () => void {
    // In a real app, this would connect to Socket.io
    console.log("Leaderboard update callback registered", callback);
    return () => {};
  }

  public onStatsUpdate(
    callback: (userId: string, stats: LeaderboardStats) => void,
  ): () => void {
    // In a real app, this would connect to Socket.io
    console.log("Stats update callback registered", callback);
    return () => {};
  }
}

export const leaderboardService = LeaderboardService.getInstance();
