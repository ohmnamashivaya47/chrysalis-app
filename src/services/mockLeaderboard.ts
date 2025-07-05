/**
 * Mock Leaderboard Service - Frontend Only
 */

import type {
  ApiResponse,
} from "../types";

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  totalMinutes: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

class MockLeaderboardService {
  private leaderboardData: LeaderboardEntry[] = [];

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoEntries: Omit<LeaderboardEntry, 'rank' | 'isCurrentUser'>[] = [
      { id: "user1", username: "meditation_master", totalMinutes: 1250, avatar: undefined },
      { id: "user2", username: "zen_warrior", totalMinutes: 980, avatar: undefined },
      { id: "demo1", username: "demo_user", totalMinutes: 650, avatar: undefined },
      { id: "user3", username: "mindful_soul", totalMinutes: 450, avatar: undefined },
      { id: "user4", username: "peaceful_mind", totalMinutes: 320, avatar: undefined },
      { id: "user5", username: "calm_breath", totalMinutes: 280, avatar: undefined },
      { id: "user6", username: "inner_peace", totalMinutes: 150, avatar: undefined },
    ];

    this.leaderboardData = demoEntries
      .sort((a, b) => b.totalMinutes - a.totalMinutes)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        isCurrentUser: false
      }));
  }

  async getLeaderboard(type: "daily" | "weekly" | "monthly" | "all-time" = "all-time"): Promise<ApiResponse<LeaderboardEntry[]>> {
    try {
      const currentUserId = localStorage.getItem("currentUserId");
      const userMinutes = parseInt(localStorage.getItem("totalMeditationMinutes") || "0");

      // Update current user's data if they exist
      let updatedData = [...this.leaderboardData];
      
      if (currentUserId) {
        const userIndex = updatedData.findIndex(entry => entry.id === currentUserId);
        
        if (userIndex >= 0) {
          // Update existing user
          updatedData[userIndex] = {
            ...updatedData[userIndex],
            totalMinutes: userMinutes,
            isCurrentUser: true
          };
        } else {
          // Add new user
          const currentUser = localStorage.getItem("currentUsername") || "You";
          updatedData.push({
            id: currentUserId,
            username: currentUser,
            totalMinutes: userMinutes,
            avatar: undefined,
            rank: 0, // Will be calculated below
            isCurrentUser: true
          });
        }

        // Re-sort and update ranks
        updatedData = updatedData
          .sort((a, b) => b.totalMinutes - a.totalMinutes)
          .map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));
      }

      // Simulate different timeframes by filtering/adjusting data
      let filteredData = updatedData;
      
      switch (type) {
        case "daily":
          // Show only top performers for "today"
          filteredData = updatedData.slice(0, 10);
          break;
        case "weekly":
          // Show weekly top performers
          filteredData = updatedData.slice(0, 25);
          break;
        case "monthly":
          // Show monthly top performers
          filteredData = updatedData.slice(0, 50);
          break;
        case "all-time":
        default:
          filteredData = updatedData;
          break;
      }

      return {
        success: true,
        data: filteredData
      };
    } catch {
      return {
        success: false,
        error: "Failed to get leaderboard"
      };
    }
  }

  async getUserRank(userId: string): Promise<ApiResponse<{ rank: number; totalUsers: number }>> {
    try {
      const leaderboardResult = await this.getLeaderboard("all-time");
      
      if (!leaderboardResult.success || !leaderboardResult.data) {
        return {
          success: false,
          error: "Failed to get user rank"
        };
      }

      const userEntry = leaderboardResult.data.find(entry => entry.id === userId);
      
      if (!userEntry) {
        return {
          success: false,
          error: "User not found in leaderboard"
        };
      }

      return {
        success: true,
        data: {
          rank: userEntry.rank,
          totalUsers: leaderboardResult.data.length
        }
      };
    } catch {
      return {
        success: false,
        error: "Failed to get user rank"
      };
    }
  }

  async updateUserProgress(userId: string, meditationMinutes: number): Promise<ApiResponse<void>> {
    try {
      // Update localStorage
      const currentMinutes = parseInt(localStorage.getItem("totalMeditationMinutes") || "0");
      const newTotal = currentMinutes + meditationMinutes;
      localStorage.setItem("totalMeditationMinutes", newTotal.toString());

      // Update in-memory data
      const userIndex = this.leaderboardData.findIndex(entry => entry.id === userId);
      if (userIndex >= 0) {
        this.leaderboardData[userIndex].totalMinutes = newTotal;
      }

      return {
        success: true,
        data: undefined
      };
    } catch {
      return {
        success: false,
        error: "Failed to update user progress"
      };
    }
  }
}

export const leaderboardService = new MockLeaderboardService();
