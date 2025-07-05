import type { Post, User, MeditationSession, Achievement } from "../types";

// Sample users for demo purposes
export const sampleUsers: User[] = [
  {
    id: "user_1",
    email: "sarah@example.com",
    username: "sarah_meditates",
    bio: "Mindfulness practitioner for 5 years. Love sharing the journey! 🧘‍♀️",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Sarah&background=22c55e&color=fff",
    createdAt: new Date("2023-01-15"),
    isPublic: true,
    totalMeditationMinutes: 2400,
    emailVerified: true,
    lastActive: new Date(),
    qrCode: "qr_user_1",
  },
  {
    id: "user_2",
    email: "alex@example.com",
    username: "alex_zen",
    bio: "Finding peace one breath at a time. Beginner but enthusiastic! ✨",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Alex&background=3b82f6&color=fff",
    createdAt: new Date("2023-03-20"),
    isPublic: true,
    totalMeditationMinutes: 720,
    emailVerified: true,
    lastActive: new Date(),
    qrCode: "qr_user_2",
  },
  {
    id: "user_3",
    email: "maria@example.com",
    username: "maria_mindful",
    bio: "Meditation teacher and breathwork enthusiast. Spreading calm vibes! 🌸",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Maria&background=ec4899&color=fff",
    createdAt: new Date("2022-08-10"),
    isPublic: true,
    totalMeditationMinutes: 5400,
    emailVerified: true,
    lastActive: new Date(),
    qrCode: "qr_user_3",
  },
  {
    id: "user_4",
    email: "david@example.com",
    username: "david_breath",
    bio: "Daily meditator, weekend warrior. Here for the consistency! 💪",
    avatarUrl:
      "https://ui-avatars.com/api/?name=David&background=f59e0b&color=fff",
    createdAt: new Date("2023-02-14"),
    isPublic: true,
    totalMeditationMinutes: 1800,
    emailVerified: true,
    lastActive: new Date(),
    qrCode: "qr_user_4",
  },
];

// Sample posts for the social feed
export const samplePosts: Post[] = [
  {
    id: "post_1",
    userId: "user_1",
    user: sampleUsers[0],
    content:
      "Just completed my 100th meditation session! 🎉 The consistency is really paying off. Feeling more centered and peaceful than ever. Who else is on a streak?",
    isGuidedMeditation: true,
    createdAt: new Date("2024-01-15T08:30:00Z"),
    likesCount: 12,
    commentsCount: 5,
    isPublic: true,
    isLiked: false,
  },
  {
    id: "post_2",
    userId: "user_2",
    user: sampleUsers[1],
    content:
      "Morning meditation hit different today. Sometimes the simplest sessions are the most profound. Just 10 minutes of breathing, but it felt like coming home to myself. ✨",
    isGuidedMeditation: false,
    createdAt: new Date("2024-01-15T07:15:00Z"),
    likesCount: 8,
    commentsCount: 3,
    isPublic: true,
    isLiked: true,
  },
  {
    id: "post_3",
    userId: "user_3",
    user: sampleUsers[2],
    content:
      'Grateful for this community! Teaching a breathwork session tomorrow. Remember: there\'s no "perfect" way to meditate. Your breath is your teacher. 🌬️',
    isGuidedMeditation: false,
    createdAt: new Date("2024-01-14T19:45:00Z"),
    likesCount: 23,
    commentsCount: 8,
    isPublic: true,
    isLiked: false,
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop",
  },
  {
    id: "post_4",
    userId: "user_4",
    user: sampleUsers[3],
    content:
      "Week 3 of daily practice complete! 💪 Some days are harder than others, but showing up is what matters. The 5-minute sessions are just as valuable as the 30-minute ones.",
    isGuidedMeditation: true,
    createdAt: new Date("2024-01-14T16:20:00Z"),
    likesCount: 15,
    commentsCount: 7,
    isPublic: true,
    isLiked: true,
  },
  {
    id: "post_5",
    userId: "user_1",
    user: sampleUsers[0],
    content:
      "Beautiful sunset meditation today. Nature is the best teacher. 🌅 Sometimes the most healing practice is simply being present with what's already here.",
    isGuidedMeditation: false,
    createdAt: new Date("2024-01-13T18:00:00Z"),
    likesCount: 19,
    commentsCount: 4,
    isPublic: true,
    isLiked: false,
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
  },
];

// Sample meditation sessions
export const sampleMeditationSessions: MeditationSession[] = [
  {
    id: "session_1",
    userId: "user_1",
    type: "mindfulness",
    duration: 1200, // 20 minutes
    state: "completed",
    startedAt: new Date("2024-01-15T08:00:00Z"),
    endedAt: new Date("2024-01-15T08:20:00Z"),
    settings: {
      userId: "user_1",
      type: "mindfulness",
      duration: 20,
      soundscape: {
        enabled: true,
        type: "nature",
        volume: 0.3,
      },
      binauralBeats: {
        enabled: false,
        frequency: 40,
        volume: 0.2,
      },
      guidedVoice: {
        enabled: true,
        voice: "female",
        language: "en",
        volume: 0.7,
      },
      breathingPattern: {
        enabled: true,
        inhale: 4,
        hold: 4,
        exhale: 6,
        pause: 2,
      },
    },
    progress: {
      currentTime: 1200,
      totalTime: 1200,
      percentage: 100,
      phase: "completion",
      currentInstruction: "Session complete",
    },
    analytics: {
      heartRateVariability: [65, 67, 64, 63, 65],
      stressLevel: 0.3,
      focusScore: 0.8,
      calmScore: 0.9,
      sessionQuality: 0.85,
    },
  },
  {
    id: "session_2",
    userId: "user_2",
    type: "breathing",
    duration: 600, // 10 minutes
    state: "completed",
    startedAt: new Date("2024-01-15T07:00:00Z"),
    endedAt: new Date("2024-01-15T07:10:00Z"),
    settings: {
      userId: "user_2",
      type: "breathing",
      duration: 10,
      soundscape: {
        enabled: false,
        type: "ocean",
        volume: 0.2,
      },
      binauralBeats: {
        enabled: false,
        frequency: 40,
        volume: 0.2,
      },
      guidedVoice: {
        enabled: true,
        voice: "male",
        language: "en",
        volume: 0.8,
      },
      breathingPattern: {
        enabled: true,
        inhale: 4,
        hold: 0,
        exhale: 4,
        pause: 0,
      },
    },
    progress: {
      currentTime: 600,
      totalTime: 600,
      percentage: 100,
      phase: "completion",
      currentInstruction: "Session complete",
    },
    analytics: {
      heartRateVariability: [70, 68, 66, 64, 62],
      stressLevel: 0.4,
      focusScore: 0.7,
      calmScore: 0.8,
      sessionQuality: 0.75,
    },
  },
];

// Sample achievements
export const sampleAchievements: Achievement[] = [
  {
    id: "achievement_1",
    name: "First Steps",
    description: "Complete your first meditation session",
    icon: "🧘",
    criteria: {
      type: "session_count",
      target: 1,
      period: "all_time",
    },
    points: 10,
    tier: "bronze",
    isActive: true,
    createdAt: new Date("2024-01-10T09:00:00Z"),
  },
  {
    id: "achievement_2",
    name: "Week Warrior",
    description: "Meditate for 7 consecutive days",
    icon: "🔥",
    criteria: {
      type: "streak",
      target: 7,
      period: "daily",
    },
    points: 50,
    tier: "silver",
    isActive: true,
    createdAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "achievement_3",
    name: "Meditation Master",
    description: "Complete 100 meditation sessions",
    icon: "🏆",
    criteria: {
      type: "session_count",
      target: 100,
      period: "all_time",
    },
    points: 200,
    tier: "gold",
    isActive: true,
    createdAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "achievement_4",
    name: "Time Traveler",
    description: "Meditate for 100 hours total",
    icon: "⏰",
    criteria: {
      type: "meditation_minutes",
      target: 6000,
      period: "all_time",
    },
    points: 300,
    tier: "platinum",
    isActive: true,
    createdAt: new Date("2024-01-01T00:00:00Z"),
  },
];

// Leaderboard data
export const sampleLeaderboard = {
  weekly: [
    { rank: 1, user: sampleUsers[2], score: 420, value: "7h 0m" },
    { rank: 2, user: sampleUsers[0], score: 380, value: "6h 20m" },
    { rank: 3, user: sampleUsers[3], score: 240, value: "4h 0m" },
    { rank: 4, user: sampleUsers[1], score: 180, value: "3h 0m" },
  ],
  monthly: [
    { rank: 1, user: sampleUsers[0], score: 1800, value: "30h 0m" },
    { rank: 2, user: sampleUsers[2], score: 1620, value: "27h 0m" },
    { rank: 3, user: sampleUsers[3], score: 900, value: "15h 0m" },
    { rank: 4, user: sampleUsers[1], score: 600, value: "10h 0m" },
  ],
  allTime: [
    { rank: 1, user: sampleUsers[2], score: 5400, value: "90h 0m" },
    { rank: 2, user: sampleUsers[0], score: 2400, value: "40h 0m" },
    { rank: 3, user: sampleUsers[3], score: 1800, value: "30h 0m" },
    { rank: 4, user: sampleUsers[1], score: 720, value: "12h 0m" },
  ],
};

// Meditation content library
export const meditationLibrary = [
  {
    id: "meditation_1",
    title: "Morning Mindfulness",
    description: "Start your day with clarity and intention",
    instructor: "Sarah Johnson",
    type: "mindfulness" as const,
    duration: 600, // 10 minutes
    difficulty: "beginner" as const,
    audioUrl: "/meditation-sounds/morning-mindfulness.mp3",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    tags: ["morning", "mindfulness", "beginner"],
    rating: 4.8,
    playCount: 1250,
  },
  {
    id: "meditation_2",
    title: "Deep Breathing Reset",
    description: "Simple breathwork to center yourself anytime",
    instructor: "Michael Chen",
    type: "breathing" as const,
    duration: 900, // 15 minutes
    difficulty: "beginner" as const,
    audioUrl: "/meditation-sounds/breathing-reset.mp3",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    tags: ["breathing", "stress-relief", "anytime"],
    rating: 4.9,
    playCount: 2100,
  },
  {
    id: "meditation_3",
    title: "Body Scan Journey",
    description: "Progressive relaxation through mindful awareness",
    instructor: "Emma Williams",
    type: "body-scan" as const,
    duration: 1800, // 30 minutes
    difficulty: "intermediate" as const,
    audioUrl: "/meditation-sounds/body-scan.mp3",
    imageUrl:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
    tags: ["body-scan", "relaxation", "evening"],
    rating: 4.7,
    playCount: 890,
  },
  {
    id: "meditation_4",
    title: "Loving Kindness",
    description: "Cultivate compassion for yourself and others",
    instructor: "David Martinez",
    type: "loving-kindness" as const,
    duration: 1200, // 20 minutes
    difficulty: "intermediate" as const,
    audioUrl: "/meditation-sounds/loving-kindness.mp3",
    imageUrl:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop",
    tags: ["loving-kindness", "compassion", "heart"],
    rating: 4.6,
    playCount: 750,
  },
  {
    id: "meditation_5",
    title: "Sleep Preparation",
    description: "Gentle guidance into restful sleep",
    instructor: "Luna Rodriguez",
    type: "sleep" as const,
    duration: 2400, // 40 minutes
    difficulty: "beginner" as const,
    audioUrl: "/meditation-sounds/sleep-prep.mp3",
    imageUrl:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop",
    tags: ["sleep", "bedtime", "relaxation"],
    rating: 4.8,
    playCount: 1680,
  },
];

// Helper function to get random sample data
export const getRandomSample = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
