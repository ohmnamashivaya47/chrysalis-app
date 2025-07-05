import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "../components/common/Layout";
import { MeditationCard } from "../components/meditation/MeditationCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { useMeditationSession } from "../hooks/useMeditationSession";
import { useAuth } from "../hooks/useAuth";
import type { MeditationType, MeditationSettings } from "../types";

const meditationTypes = [
  {
    type: "mindfulness" as MeditationType,
    title: "Mindfulness",
    description:
      "Cultivate present-moment awareness through gentle observation of thoughts and sensations.",
    duration: 10,
    difficulty: "beginner" as const,
    isRecommended: true,
  },
  {
    type: "body-scan" as MeditationType,
    title: "Body Scan",
    description:
      "Systematically relax each part of your body while developing bodily awareness.",
    duration: 15,
    difficulty: "beginner" as const,
  },
  {
    type: "breathing" as MeditationType,
    title: "Focused Breathing",
    description:
      "Develop concentration by focusing attention on the natural rhythm of breath.",
    duration: 8,
    difficulty: "beginner" as const,
  },
  {
    type: "loving-kindness" as MeditationType,
    title: "Loving Kindness",
    description:
      "Cultivate compassion and goodwill towards yourself and others.",
    duration: 12,
    difficulty: "intermediate" as const,
  },
  {
    type: "stress-relief" as MeditationType,
    title: "Stress Relief",
    description:
      "Release tension and anxiety through guided relaxation techniques.",
    duration: 20,
    difficulty: "beginner" as const,
    isRecommended: true,
  },
  {
    type: "sleep" as MeditationType,
    title: "Sleep Meditation",
    description:
      "Gentle practices to help you unwind and prepare for restful sleep.",
    duration: 25,
    difficulty: "beginner" as const,
  },
];

const MeditationPage: React.FC = () => {
  const { user } = useAuth();
  const { startSession, currentSession } = useMeditationSession();
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [weeklyGoal] = useState(140); // 20 minutes per day

  useEffect(() => {
    // Calculate today's meditation minutes
    // In a real app, this would come from the API
    setTodayMinutes(user?.totalMeditationMinutes || 0);
  }, [user]);

  const handleStartMeditation = async (
    type: MeditationType,
    duration: number,
  ) => {
    if (!user) return;

    const settings: MeditationSettings = {
      userId: user.id,
      type,
      duration,
      soundscape: {
        enabled: true,
        type: "nature",
        volume: 0.5,
      },
      binauralBeats: {
        enabled: false,
        frequency: 40,
        volume: 0.3,
      },
      guidedVoice: {
        enabled: true,
        voice: "female",
        language: "en",
        volume: 0.7,
      },
      breathingPattern: {
        enabled: false,
        inhale: 4,
        hold: 4,
        exhale: 4,
        pause: 4,
      },
    };

    await startSession(settings);
    // Navigate to meditation session page
    // In a real app, this would use React Router
    window.location.href = "/session";
  };

  const weeklyProgress = (todayMinutes / weeklyGoal) * 100;

  return (
    <Layout title="Meditation">
      <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-sage-900 mb-2">
            Welcome back, {user?.username || user?.email.split("@")[0]}
          </h1>
          <p className="text-sage-600">
            Ready for today's practice? Choose a session that resonates with
            you.
          </p>
        </motion.div>

        {/* Progress section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Today's Progress</span>
                <Badge variant="secondary">{todayMinutes} min</Badge>
              </CardTitle>
              <CardDescription>
                You're on track! Keep up the great work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress
                  value={Math.min(todayMinutes, 20)}
                  max={20}
                  label="Daily Goal (20 min)"
                  showValue
                  variant="meditation"
                />
                <Progress
                  value={weeklyProgress}
                  max={100}
                  label="Weekly Goal (140 min)"
                  showValue
                  color="sage"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-deepTeal">
                    {user?.totalMeditationMinutes || 0}
                  </div>
                  <div className="text-sm text-sage-600">Total Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-600">7</div>
                  <div className="text-sm text-sage-600">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warmGold">🏆</div>
                  <div className="text-sm text-sage-600">Level 3</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Start section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-sage-900 mb-4">
            Quick Start
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleStartMeditation("mindfulness", 5)}
              className="whitespace-nowrap"
            >
              🌱 5 min Mindfulness
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleStartMeditation("breathing", 10)}
              className="whitespace-nowrap"
            >
              🫁 10 min Breathing
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleStartMeditation("stress-relief", 15)}
              className="whitespace-nowrap"
            >
              😌 15 min Stress Relief
            </Button>
          </div>
        </motion.div>

        {/* Meditation types grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-sage-900 mb-6">
            Choose Your Practice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditationTypes.map((meditation, index) => (
              <motion.div
                key={meditation.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <MeditationCard
                  {...meditation}
                  onStart={() =>
                    handleStartMeditation(meditation.type, meditation.duration)
                  }
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Current session indicator */}
        {currentSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80"
          >
            <Card className="bg-deepTeal text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Session in Progress</h3>
                    <p className="text-sm text-white/80">
                      {currentSession.settings.type} •{" "}
                      {currentSession.settings.duration} min
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => (window.location.href = "/session")}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default MeditationPage;
