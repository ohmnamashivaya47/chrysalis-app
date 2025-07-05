import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Progress } from "../components/ui/Progress";
import { Card, CardContent } from "../components/ui/Card";
import { useMeditationSession } from "../hooks/useMeditationSession";
import { useAuth } from "../hooks/useAuth";

const MeditationSessionPage: React.FC = () => {
  const { user } = useAuth();
  const { currentSession, pauseSession, resumeSession, stopSession } =
    useMeditationSession();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isBreathing, setIsBreathing] = useState(true);

  useEffect(() => {
    if (!currentSession) {
      window.location.href = "/meditate";
      return;
    }

    const handleSessionComplete = () => {
      // Handle session completion
      stopSession();
      window.location.href = "/meditate?completed=true";
    };

    // Calculate time remaining
    const totalTime = currentSession.settings.duration * 60; // Convert to seconds
    const elapsed =
      (Date.now() - new Date(currentSession.startedAt).getTime()) / 1000;
    setTimeRemaining(Math.max(0, totalTime - elapsed));

    // Update timer every second
    const timer = setInterval(() => {
      const newElapsed =
        (Date.now() - new Date(currentSession.startedAt).getTime()) / 1000;
      const remaining = Math.max(0, totalTime - newElapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        // Session completed
        handleSessionComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession, stopSession]);

  useEffect(() => {
    // Breathing animation cycle
    const breathingCycle = setInterval(() => {
      setIsBreathing((prev) => !prev);
    }, 4000); // 4 second breathing cycle

    return () => clearInterval(breathingCycle);
  }, []);

  const handlePause = () => {
    if (currentSession?.state === "active") {
      pauseSession();
    } else {
      resumeSession();
    }
  };

  const handleStop = () => {
    if (window.confirm("Are you sure you want to end this session?")) {
      stopSession();
      window.location.href = "/meditate";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white">
        <p className="text-sage-600">No active session found. Redirecting...</p>
      </div>
    );
  }

  const totalTime = currentSession.settings.duration * 60;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-deepTeal/5 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-deepTeal/5 rounded-full blur-3xl"
          animate={{
            scale: isBreathing ? 1.2 : 1,
            opacity: isBreathing ? 0.3 : 0.1,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sage-300/10 rounded-full blur-3xl"
          animate={{
            scale: isBreathing ? 1 : 1.2,
            opacity: isBreathing ? 0.1 : 0.3,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto text-center">
        {/* Session Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-sage-900 mb-2">
            {currentSession.settings.type
              .replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </h1>
          <p className="text-sage-600">
            Welcome, {user?.username || user?.email.split("@")[0]}
          </p>
        </motion.div>

        {/* Breathing Circle */}
        <motion.div
          className="relative w-64 h-64 mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-deepTeal/20 to-sage-300/20 border-4 border-deepTeal/30"
            animate={{
              scale: isBreathing ? 1.1 : 0.9,
              borderWidth: isBreathing ? 6 : 2,
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-br from-deepTeal/40 to-sage-300/40"
            animate={{
              scale: isBreathing ? 1.2 : 0.8,
              opacity: isBreathing ? 0.8 : 0.4,
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold text-deepTeal mb-2"
                animate={{ scale: isBreathing ? 1.1 : 1 }}
                transition={{ duration: 4, ease: "easeInOut" }}
              >
                {formatTime(timeRemaining)}
              </motion.div>
              <motion.p
                className="text-sm text-sage-600"
                animate={{ opacity: isBreathing ? 1 : 0.7 }}
                transition={{ duration: 4, ease: "easeInOut" }}
              >
                {isBreathing ? "Breathe In" : "Breathe Out"}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Progress
            value={progress}
            max={100}
            variant="meditation"
            color="deepTeal"
            className="w-full"
          />
          <p className="text-sm text-sage-600 mt-2">
            {Math.round(progress)}% Complete
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-4"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={handlePause}
            className="flex items-center space-x-2"
          >
            {currentSession.state === "active" ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6"
                  />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Resume</span>
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleStop}
            className="flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            <span>End</span>
          </Button>
        </motion.div>

        {/* Session Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-deepTeal">
                    {currentSession.settings.duration}m
                  </div>
                  <div className="text-sm text-sage-600">Duration</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-sage-600">
                    {currentSession.settings.type.replace("-", " ")}
                  </div>
                  <div className="text-sm text-sage-600">Practice</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MeditationSessionPage;
