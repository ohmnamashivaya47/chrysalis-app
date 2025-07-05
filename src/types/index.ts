// Authentication Types
export interface User {
  id: string;
  email: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  isPublic: boolean;
  totalMeditationMinutes: number;
  emailVerified: boolean;
  lastActive: Date;
  qrCode: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
  bio?: string;
}

// Meditation Types
export type MeditationType =
  | "mindfulness"
  | "body-scan"
  | "loving-kindness"
  | "focused-attention"
  | "guided"
  | "breathing"
  | "sleep"
  | "focus"
  | "stress-relief";

export type SessionState =
  | "preparing"
  | "active"
  | "paused"
  | "completed"
  | "stopped";

export type SessionPhase =
  | "preparation"
  | "settling"
  | "meditation"
  | "completion";

export interface MeditationSettings {
  userId: string;
  type: MeditationType;
  duration: number; // in minutes
  soundscape: {
    enabled: boolean;
    type: "nature" | "ocean" | "forest" | "rain" | "white-noise";
    volume: number;
  };
  binauralBeats: {
    enabled: boolean;
    frequency: number;
    volume: number;
  };
  guidedVoice: {
    enabled: boolean;
    voice: "male" | "female";
    language: string;
    volume: number;
  };
  breathingPattern: {
    enabled: boolean;
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
  };
}

export interface SessionAnalytics {
  heartRateVariability: number[];
  stressLevel: number;
  focusScore: number;
  calmScore: number;
  sessionQuality: number;
}

export interface MeditationSession {
  id: string;
  userId: string;
  type: MeditationType;
  duration: number;
  settings: MeditationSettings;
  state: SessionState;
  startedAt: Date;
  endedAt?: Date;
  progress: SessionProgress;
  analytics: SessionAnalytics;
}

export interface MeditationAudioSettings {
  masterVolume: number;
  natureSound: {
    forest: number;
    rain: number;
    ocean: number;
    wind: number;
    birds: number;
  };
  binauralBeats: {
    enabled: boolean;
    baseFreq: number;
    beatFreq: number;
  };
  ambientTones: {
    enabled: boolean;
    baseFreq: number;
  };
  guidedVoice: {
    enabled: boolean;
    volume: number;
  };
}

export interface SessionProgress {
  currentTime: number;
  totalTime: number;
  percentage: number;
  phase: SessionPhase;
  currentInstruction?: string;
  isBreathingIn?: boolean;
  breathingCycle?: number;
  heartRate?: number[];
  stressLevel?: number;
}

export interface BreathingPattern {
  inhale: number;
  hold?: number;
  exhale: number;
  pause?: number;
}

// Social Types
export interface Post {
  id: string;
  userId: string;
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
  isGuidedMeditation: boolean;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  isPublic: boolean;
  user?: User;
  isLiked?: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: Date;
  user?: User;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
}

export interface UserRelationship {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

// Leaderboard Types
export interface LeaderboardGroup {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  qrCode: string;
  isPublic: boolean;
  maxMembers?: number;
  createdAt: Date;
  creator?: User;
  members?: GroupMember[];
  memberCount?: number;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: "member" | "admin" | "moderator";
  joinedAt: Date;
  user?: User;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  meditationMinutes: number;
  sessionsCount: number;
  streak: number;
  change: number; // Change in rank from previous period
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: AchievementCriteria;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  isActive: boolean;
  createdAt: Date;
}

export interface AchievementCriteria {
  type:
    | "meditation_minutes"
    | "session_count"
    | "streak"
    | "social_interaction"
    | "custom";
  target: number;
  period?: "daily" | "weekly" | "monthly" | "all_time";
  conditions?: Record<string, string | number | boolean>;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: Date;
  progress?: AchievementProgress;
  achievement?: Achievement;
}

export interface AchievementProgress {
  current: number;
  target: number;
  percentage: number;
}

// QR Code Types
export interface QRCodeData {
  type: "user_follow" | "group_join" | "meditation_session";
  id: string;
  metadata?: Record<string, string | number>;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type:
    | "like"
    | "comment"
    | "follow"
    | "achievement"
    | "group_invite"
    | "meditation_reminder";
  title: string;
  message: string;
  data?: Record<string, string | number | boolean>;
  read: boolean;
  createdAt: Date;
}

export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dhKey: string;
  authKey: string;
  userAgent?: string;
  createdAt: Date;
  isActive: boolean;
}

// Report and Moderation Types
export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  postId?: string;
  commentId?: string;
  reason: "spam" | "inappropriate" | "harassment" | "fake_account" | "other";
  description?: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: Date;
  resolvedAt?: Date;
}

export interface BlockedUser {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: Date;
}

// Audio Generation Types
export interface AudioConfig {
  sampleRate: number;
  bufferSize: number;
  masterVolume: number;
  fadeInDuration: number;
  fadeOutDuration: number;
}

export interface NatureSoundConfig {
  forest: number;
  rain: number;
  ocean: number;
  wind: number;
  birds: number;
}

// Analytics Types
export interface MeditationAnalytics {
  totalSessions: number;
  totalMinutes: number;
  averageSessionLength: number;
  favoriteType: MeditationType;
  longestSession: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: number[];
  monthlyProgress: number[];
  moodTrends: MoodTrend[];
}

export interface MoodTrend {
  date: Date;
  moodBefore: string;
  moodAfter: string;
  improvement: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, string | number | boolean>;
}

// Form Types
export interface FormField {
  name: string;
  type:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "file"
    | "checkbox";
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
}

export interface ValidationRule {
  type: "required" | "email" | "min" | "max" | "pattern";
  value?: string | number;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

// WebSocket Types
export interface SocketEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
}

export interface RealTimeUpdate {
  type:
    | "post_created"
    | "post_liked"
    | "comment_added"
    | "user_followed"
    | "achievement_earned";
  data: Record<string, unknown>;
  affectedUsers: string[];
}

// PWA Types
export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  textPrimary: string;
  success: string;
  warning: string;
  error: string;
}

export interface Theme {
  colors: ThemeColors;
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}

// Utility Types
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface LoadingStore {
  state: LoadingState;
  message?: string;
  progress?: number;
}

export type NetworkStatus = "online" | "offline" | "slow";

export interface NetworkStore {
  status: NetworkStatus;
  speed?: number;
  lastChecked: Date;
}

// Post and Comment Creation Types
export interface CreatePostData {
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "audio" | "video";
  tags?: string[];
}

export interface CreateCommentData {
  content: string;
}
