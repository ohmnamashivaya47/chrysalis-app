import React, { useState } from "react";
import { Layout } from "../components/common/Layout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import {
  User,
  Edit3,
  Camera,
  Award,
  Calendar,
  Clock,
  Target,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "Alex Morgan",
    username: "mindful_alex",
    bio: "Meditation enthusiast seeking inner peace and mindfulness in daily life. 🧘‍♀️",
    email: "alex.morgan@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  });

  // Mock user stats
  const stats = {
    totalMinutes: 1456,
    sessionsCompleted: 87,
    currentStreak: 12,
    longestStreak: 28,
    totalDays: 45,
    averageSession: 16.7,
  };

  // Mock achievements
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first meditation",
      icon: "🌱",
      unlocked: true,
    },
    {
      id: 2,
      title: "Consistent Practice",
      description: "7 day meditation streak",
      icon: "🔥",
      unlocked: true,
    },
    {
      id: 3,
      title: "Mindful Month",
      description: "Meditate for 30 days",
      icon: "📅",
      unlocked: false,
    },
    {
      id: 4,
      title: "Zen Master",
      description: "1000 minutes of meditation",
      icon: "🧘",
      unlocked: true,
    },
    {
      id: 5,
      title: "Early Bird",
      description: "Complete 10 morning sessions",
      icon: "🌅",
      unlocked: true,
    },
    {
      id: 6,
      title: "Night Owl",
      description: "Complete 10 evening sessions",
      icon: "🌙",
      unlocked: false,
    },
  ];

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const settingsItems = [
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage your notification preferences",
    },
    {
      icon: Shield,
      label: "Privacy",
      description: "Control who can see your profile",
    },
    {
      icon: Settings,
      label: "App Settings",
      description: "Customize your meditation experience",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help and contact support",
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt={profileData.displayName}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-deepTeal text-white rounded-full flex items-center justify-center text-sm hover:bg-deepTeal/80 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Display Name"
                    value={profileData.displayName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        displayName: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="Username"
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        username: e.target.value,
                      })
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-deepTeal focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-sage-900">
                        {profileData.displayName}
                      </h1>
                      <p className="text-sage-600">@{profileData.username}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sage-700 mb-4">{profileData.bio}</p>
                  <p className="text-sm text-sage-500">{profileData.email}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stats and Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-sage-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Progress
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-deepTeal">
                    {stats.totalMinutes}
                  </div>
                  <div className="text-sm text-sage-600">Total Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-deepTeal">
                    {stats.sessionsCompleted}
                  </div>
                  <div className="text-sm text-sage-600">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warmGold flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5" />
                    {stats.currentStreak}
                  </div>
                  <div className="text-sm text-sage-600">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-700">
                    {stats.longestStreak}
                  </div>
                  <div className="text-sm text-sage-600">Longest Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-700">
                    {stats.totalDays}
                  </div>
                  <div className="text-sm text-sage-600">Total Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-700">
                    {stats.averageSession}
                  </div>
                  <div className="text-sm text-sage-600">Avg Minutes</div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-sage-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements ({achievements.filter((a) => a.unlocked).length}/
                {achievements.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.unlocked
                        ? "bg-white border-warmGold/30 shadow-sm"
                        : "bg-sage-50 border-sage-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            achievement.unlocked
                              ? "text-sage-900"
                              : "text-sage-600"
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-sage-600">
                          {achievement.description}
                        </p>
                        {achievement.unlocked && (
                          <Badge variant="success" size="sm" className="mt-2">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-sage-900 mb-4">
                Settings
              </h2>
              <div className="space-y-2">
                {settingsItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sage-50 transition-colors text-left"
                  >
                    <item.icon className="w-5 h-5 text-sage-600" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-sage-900">
                        {item.label}
                      </div>
                      <div className="text-xs text-sage-600 truncate">
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-sage-400" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-sage-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Meditation History
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Set Meditation Reminders
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Export Profile Data
                </Button>
              </div>
            </Card>

            {/* Logout */}
            <Card className="p-6">
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
