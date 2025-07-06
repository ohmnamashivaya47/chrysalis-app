import { useState, useEffect, useCallback } from "react";
import { meditationSessionService } from "../services/meditationSession";
import type {
  MeditationSession,
  MeditationSettings,
  SessionProgress,
} from "../types";

export function useMeditationSession() {
  const [currentSession, setCurrentSession] =
    useState<MeditationSession | null>(null);
  const [progress, setProgress] = useState<SessionProgress | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up progress listener
    const handleProgressUpdate = (sessionProgress: SessionProgress) => {
      setProgress(sessionProgress);
    };

    const handleCompletionUpdate = (sessionProgress: SessionProgress) => {
      console.log("Session completed", sessionProgress);
      setIsActive(false);
      setIsPaused(false);
    };

    const progressWrapper = (data: unknown) => {
      handleProgressUpdate(data as SessionProgress);
    };

    const completionWrapper = (data: unknown) => {
      handleCompletionUpdate(data as SessionProgress);
    };

    meditationSessionService.addEventListener("progress", progressWrapper);
    meditationSessionService.addEventListener("completion", completionWrapper);

    // Check for existing session
    const existingSession = meditationSessionService.getCurrentSession();
    if (existingSession) {
      setCurrentSession(existingSession);
      setIsActive(existingSession.state === "active");
      setIsPaused(existingSession.state === "paused");
      setProgress(existingSession.progress);
    }

    return () => {
      meditationSessionService.removeEventListener("progress", progressWrapper);
      meditationSessionService.removeEventListener("completion", completionWrapper);
    };
  }, []);

  const startSession = useCallback(
    async (settings: MeditationSettings): Promise<boolean> => {
      try {
        setError(null);
        const session = await meditationSessionService.startSession(settings);

        setCurrentSession(session);
        setIsActive(true);
        setIsPaused(false);
        setProgress(session.progress);
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to start session";
        setError(errorMessage);
        return false;
      }
    },
    [],
  );

  const pauseSession = useCallback(() => {
    try {
      if (currentSession) {
        meditationSessionService.pauseSession();
        setIsActive(false);
        setIsPaused(true);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to pause session";
      setError(errorMessage);
    }
  }, [currentSession]);

  const resumeSession = useCallback(() => {
    try {
      meditationSessionService.resumeSession();
      setIsActive(true);
      setIsPaused(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resume session";
      setError(errorMessage);
    }
  }, []);

  const stopSession = useCallback(async (): Promise<void> => {
    try {
      await meditationSessionService.stopSession();
      setCurrentSession(null);
      setProgress(null);
      setIsActive(false);
      setIsPaused(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to stop session";
      setError(errorMessage);
    }
  }, []);

  const getSessionHistory = useCallback(() => {
    return meditationSessionService.getSessionHistory();
  }, []);

  const getPresetTemplates = useCallback(() => {
    return meditationSessionService.getPresetTemplates();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentSession,
    progress,
    isActive,
    isPaused,
    error,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    getSessionHistory,
    getPresetTemplates,
    clearError,
  };
}
