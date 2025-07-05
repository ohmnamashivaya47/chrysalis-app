import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Calendar, Users } from "lucide-react";
import type { User } from "../../types";
import { Badge } from "../ui/Badge";
import { cn } from "../../utils/cn";

interface LeaderboardUser extends User {
  rank: number;
  totalMinutes: number;
  sessionsCount: number;
  streakDays: number;
  achievements: string[];
  weeklyMinutes?: number;
  monthlyMinutes?: number;
  displayName?: string;
  avatar?: string;
}

interface LeaderboardProps {
  className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ className }) => {
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample data - in real app, this would come from the leaderboard service
    const sampleData: LeaderboardUser[] = [
      {
        id: "1",
        email: "sarah@example.com",
        username: "MindfulSarah",
        displayName: "Sarah Chen",
        rank: 1,
        totalMinutes: 2480,
        sessionsCount: 124,
        streakDays: 28,
        achievements: ["Zen Master", "Daily Practitioner", "Mindful Mentor"],
        weeklyMinutes: 420,
        monthlyMinutes: 1680,
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b2e8b7fb?w=150&h=150&fit=crop&crop=face",
        createdAt: new Date(),
        emailVerified: true,
        isPublic: true,
        totalMeditationMinutes: 2480,
        lastActive: new Date(),
        qrCode: "qr1",
      },
      {
        id: "2",
        email: "alex@example.com",
        username: "ZenAlex",
        displayName: "Alex Rodriguez",
        rank: 2,
        totalMinutes: 2240,
        sessionsCount: 98,
        streakDays: 21,
        achievements: ["Consistency Champion", "Morning Meditator"],
        weeklyMinutes: 380,
        monthlyMinutes: 1520,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        createdAt: new Date(),
        emailVerified: true,
        isPublic: true,
        totalMeditationMinutes: 2240,
        lastActive: new Date(),
        qrCode: "qr2",
      },
      {
        id: "3",
        email: "maya@example.com",
        username: "SereneMaya",
        displayName: "Maya Patel",
        rank: 3,
        totalMinutes: 1980,
        sessionsCount: 87,
        streakDays: 14,
        achievements: ["Breathing Expert", "Focus Master"],
        weeklyMinutes: 350,
        monthlyMinutes: 1400,
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        createdAt: new Date(),
        emailVerified: true,
        isPublic: true,
        totalMeditationMinutes: 1980,
        lastActive: new Date(),
        qrCode: "qr3",
      },
      {
        id: "4",
        email: "david@example.com",
        username: "CalmDavid",
        displayName: "David Kim",
        rank: 4,
        totalMinutes: 1750,
        sessionsCount: 72,
        streakDays: 7,
        achievements: ["Night Owl Meditator"],
        weeklyMinutes: 315,
        monthlyMinutes: 1260,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        createdAt: new Date(),
        emailVerified: true,
        isPublic: true,
        totalMeditationMinutes: 1750,
        lastActive: new Date(),
        qrCode: "qr4",
      },
      {
        id: "5",
        email: "emma@example.com",
        username: "PeacefulEmma",
        displayName: "Emma Johnson",
        rank: 5,
        totalMinutes: 1640,
        sessionsCount: 65,
        streakDays: 12,
        achievements: ["Newcomer Rising Star"],
        weeklyMinutes: 280,
        monthlyMinutes: 1120,
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        createdAt: new Date(),
        emailVerified: true,
        isPublic: true,
        totalMeditationMinutes: 1640,
        lastActive: new Date(),
        qrCode: "qr5",
      },
    ];

    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLeaderboardData(sampleData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [period]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-warmGold" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="text-sage-600 font-semibold text-lg">#{rank}</span>
        );
    }
  };

  const getMetricForPeriod = (user: LeaderboardUser) => {
    switch (period) {
      case "week":
        return user.weeklyMinutes || 0;
      case "month":
        return user.monthlyMinutes || 0;
      case "all":
        return user.totalMinutes;
    }
  };

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-xl p-4 border border-sage-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sage-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-sage-200 rounded mb-2"></div>
                  <div className="h-3 bg-sage-100 rounded w-3/4"></div>
                </div>
                <div className="w-16 h-8 bg-sage-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Period Selector */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-1 border border-sage-200 inline-flex">
          {(["week", "month", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                period === p
                  ? "bg-sage-500 text-white shadow-sm"
                  : "text-sage-600 hover:text-sage-900",
              )}
            >
              {p === "week"
                ? "This Week"
                : p === "month"
                  ? "This Month"
                  : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {leaderboardData.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "bg-white rounded-xl p-4 border transition-all hover:shadow-md",
              user.rank <= 3
                ? "border-warmGold/30 bg-warmGold/5"
                : "border-sage-200",
            )}
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-12 flex justify-center">
                {getRankIcon(user.rank)}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.username || "User")}&background=84a584&color=fff`
                  }
                  alt={user.displayName || user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sage-900 truncate">
                  {user.displayName || user.username}
                </h3>
                <div className="flex items-center gap-4 text-sm text-sage-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {user.streakDays} day streak
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {user.sessionsCount} sessions
                  </span>
                </div>
                {/* Achievements */}
                {user.achievements.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {user.achievements.slice(0, 2).map((achievement, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                    {user.achievements.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{user.achievements.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Minutes */}
              <div className="text-right">
                <div className="text-lg font-bold text-sage-900">
                  {getMetricForPeriod(user)}
                </div>
                <div className="text-xs text-sage-600">minutes</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Your Position (if not in top 5) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-sage-50 to-deepTeal/5 rounded-xl p-4 border border-sage-200 border-dashed"
      >
        <div className="text-center">
          <p className="text-sage-600 mb-2">Your current position</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-2xl font-bold text-sage-900">#47</span>
            <span className="text-sage-600">with 145 minutes this week</span>
          </div>
          <p className="text-sm text-sage-500 mt-2">
            You're 28 minutes away from moving up to #42!
          </p>
        </div>
      </motion.div>
    </div>
  );
};
