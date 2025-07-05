import { useState, useEffect, useCallback } from "react";
import { onboardingService } from "../services/onboarding";
import type {
  OnboardingStep,
  OnboardingProgress,
  OnboardingData,
} from "../services/onboarding";

export function useOnboarding() {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null,
  );
  const [isCompleted, setIsCompleted] = useState(false);

  const refreshData = useCallback(() => {
    const allSteps = onboardingService.getOnboardingSteps();
    const current = onboardingService.getCurrentStep();
    const progressData = onboardingService.getProgress();
    const data = onboardingService.getOnboardingData();
    const completed = onboardingService.isOnboardingCompleted();

    setSteps(allSteps);
    setCurrentStep(current);
    setProgress(progressData);
    setOnboardingData(data);
    setIsCompleted(completed);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const completeStep = useCallback(
    async (
      stepId: string,
      data?: Partial<OnboardingData>,
    ): Promise<boolean> => {
      const success = await onboardingService.completeStep(stepId, data);
      if (success) {
        refreshData();
      }
      return success;
    },
    [refreshData],
  );

  const skipStep = useCallback(
    (stepId: string): boolean => {
      const success = onboardingService.skipStep(stepId);
      if (success) {
        refreshData();
      }
      return success;
    },
    [refreshData],
  );

  const goToStep = useCallback(
    (stepId: string): boolean => {
      const success = onboardingService.goToStep(stepId);
      if (success) {
        refreshData();
      }
      return success;
    },
    [refreshData],
  );

  const updateData = useCallback(
    (updates: Partial<OnboardingData>): void => {
      onboardingService.updateOnboardingData(updates);
      refreshData();
    },
    [refreshData],
  );

  const validateStepData = useCallback((stepId: string, data: unknown) => {
    return onboardingService.validateStepData(stepId, data);
  }, []);

  const getRecommendations = useCallback(() => {
    return {
      meditationTypes: onboardingService.getRecommendedMeditationTypes(),
      sessionDuration: onboardingService.getRecommendedSessionDuration(),
      goals: onboardingService.getRecommendedGoals(),
    };
  }, []);

  const markTutorialComplete = useCallback(
    (tutorialKey: keyof OnboardingData["tutorial"]): void => {
      onboardingService.markTutorialComplete(tutorialKey);
      refreshData();
    },
    [refreshData],
  );

  const shouldShowTutorial = useCallback(
    (tutorialKey: keyof OnboardingData["tutorial"]): boolean => {
      return onboardingService.shouldShowTutorial(tutorialKey);
    },
    [],
  );

  const resetOnboarding = useCallback((): void => {
    onboardingService.resetOnboarding();
    refreshData();
  }, [refreshData]);

  return {
    steps,
    currentStep,
    progress,
    onboardingData,
    isCompleted,
    completeStep,
    skipStep,
    goToStep,
    updateData,
    validateStepData,
    getRecommendations,
    markTutorialComplete,
    shouldShowTutorial,
    resetOnboarding,
    refreshData,
  };
}
