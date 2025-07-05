import { apiClient } from "./api";
import type { MeditationType } from "../types";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isCompleted: boolean;
  isRequired: boolean;
  order: number;
}

export interface OnboardingData {
  personalInfo: {
    name?: string;
    age?: number;
    experienceLevel: "beginner" | "intermediate" | "advanced";
    goals: string[];
  };
  preferences: {
    preferredMeditationTypes: MeditationType[];
    sessionDuration: number;
    reminderTime?: string;
    soundPreferences: {
      naturesSounds: boolean;
      binauralBeats: boolean;
      guidedVoice: boolean;
    };
  };
  schedule: {
    dailyGoalMinutes: number;
    preferredTimes: string[];
    weeklyGoalDays: number;
  };
  permissions: {
    notifications: boolean;
    camera: boolean;
    location: boolean;
  };
  tutorial: {
    hasSeenWelcome: boolean;
    hasCompletedFirstSession: boolean;
    hasJoinedGroup: boolean;
    hasScannedQR: boolean;
  };
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  isCompleted: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export class OnboardingService {
  private static instance: OnboardingService;
  private onboardingData: OnboardingData;
  private progress: OnboardingProgress;

  private constructor() {
    this.onboardingData = this.getDefaultOnboardingData();
    this.progress = this.loadProgress();
  }

  public static getInstance(): OnboardingService {
    if (!OnboardingService.instance) {
      OnboardingService.instance = new OnboardingService();
    }
    return OnboardingService.instance;
  }

  // Core Onboarding Flow
  public getOnboardingSteps(): OnboardingStep[] {
    return [
      {
        id: "welcome",
        title: "Welcome to Chrysalis",
        description: "Your journey to mindfulness begins here",
        component: "WelcomeStep",
        isCompleted: this.progress.completedSteps.includes("welcome"),
        isRequired: true,
        order: 1,
      },
      {
        id: "personal-info",
        title: "Tell us about yourself",
        description: "Help us personalize your experience",
        component: "PersonalInfoStep",
        isCompleted: this.progress.completedSteps.includes("personal-info"),
        isRequired: true,
        order: 2,
      },
      {
        id: "meditation-preferences",
        title: "Meditation Preferences",
        description: "What types of meditation interest you?",
        component: "MeditationPreferencesStep",
        isCompleted: this.progress.completedSteps.includes(
          "meditation-preferences",
        ),
        isRequired: true,
        order: 3,
      },
      {
        id: "schedule-goals",
        title: "Set Your Goals",
        description: "Create a sustainable meditation schedule",
        component: "ScheduleGoalsStep",
        isCompleted: this.progress.completedSteps.includes("schedule-goals"),
        isRequired: true,
        order: 4,
      },
      {
        id: "audio-preferences",
        title: "Audio Settings",
        description: "Customize your meditation soundscape",
        component: "AudioPreferencesStep",
        isCompleted: this.progress.completedSteps.includes("audio-preferences"),
        isRequired: false,
        order: 5,
      },
      {
        id: "permissions",
        title: "App Permissions",
        description: "Enable features for the best experience",
        component: "PermissionsStep",
        isCompleted: this.progress.completedSteps.includes("permissions"),
        isRequired: false,
        order: 6,
      },
      {
        id: "first-meditation",
        title: "Your First Session",
        description: "Let's try a short guided meditation",
        component: "FirstMeditationStep",
        isCompleted: this.progress.completedSteps.includes("first-meditation"),
        isRequired: true,
        order: 7,
      },
      {
        id: "social-features",
        title: "Connect with Others",
        description: "Discover the social features of Chrysalis",
        component: "SocialFeaturesStep",
        isCompleted: this.progress.completedSteps.includes("social-features"),
        isRequired: false,
        order: 8,
      },
      {
        id: "completion",
        title: "You're All Set!",
        description: "Welcome to your meditation journey",
        component: "CompletionStep",
        isCompleted: this.progress.completedSteps.includes("completion"),
        isRequired: true,
        order: 9,
      },
    ];
  }

  public getCurrentStep(): OnboardingStep | null {
    const steps = this.getOnboardingSteps();
    const incomplete = steps.find((step) => !step.isCompleted);
    return incomplete || null;
  }

  public getProgress(): OnboardingProgress {
    const steps = this.getOnboardingSteps();
    const totalSteps = steps.filter((step) => step.isRequired).length;
    const completedRequiredSteps = steps.filter(
      (step) => step.isRequired && step.isCompleted,
    ).length;

    return {
      ...this.progress,
      currentStep: completedRequiredSteps + 1,
      totalSteps,
      isCompleted: completedRequiredSteps === totalSteps,
    };
  }

  public async completeStep(
    stepId: string,
    data?: Partial<OnboardingData>,
  ): Promise<boolean> {
    try {
      // Update onboarding data if provided
      if (data) {
        this.updateOnboardingData(data);
      }

      // Mark step as completed
      if (!this.progress.completedSteps.includes(stepId)) {
        this.progress.completedSteps.push(stepId);
      }

      // Check if onboarding is complete
      const steps = this.getOnboardingSteps();
      const requiredSteps = steps.filter((step) => step.isRequired);
      const completedRequiredSteps = requiredSteps.filter((step) =>
        this.progress.completedSteps.includes(step.id),
      );

      if (completedRequiredSteps.length === requiredSteps.length) {
        this.progress.isCompleted = true;
        this.progress.completedAt = new Date();

        // Save to API
        await this.saveOnboardingData();
      }

      // Save progress locally
      this.saveProgress();

      return true;
    } catch (error) {
      console.error("Failed to complete onboarding step:", error);
      return false;
    }
  }

  public skipStep(stepId: string): boolean {
    try {
      const steps = this.getOnboardingSteps();
      const step = steps.find((s) => s.id === stepId);

      if (step && !step.isRequired) {
        if (!this.progress.completedSteps.includes(stepId)) {
          this.progress.completedSteps.push(stepId);
        }
        this.saveProgress();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to skip onboarding step:", error);
      return false;
    }
  }

  public goToStep(stepId: string): boolean {
    try {
      const steps = this.getOnboardingSteps();
      const step = steps.find((s) => s.id === stepId);

      if (step) {
        // Check if previous required steps are completed
        const previousRequiredSteps = steps.filter(
          (s) => s.isRequired && s.order < step.order,
        );

        const incompletePreviousSteps = previousRequiredSteps.filter(
          (s) => !this.progress.completedSteps.includes(s.id),
        );

        return incompletePreviousSteps.length === 0;
      }

      return false;
    } catch (error) {
      console.error("Failed to go to onboarding step:", error);
      return false;
    }
  }

  // Data Management
  public getOnboardingData(): OnboardingData {
    return { ...this.onboardingData };
  }

  public updateOnboardingData(updates: Partial<OnboardingData>): void {
    this.onboardingData = this.deepMerge(this.onboardingData, updates);
    this.saveOnboardingDataLocally();
  }

  public async saveOnboardingData(): Promise<boolean> {
    try {
      await apiClient.post("/onboarding", this.onboardingData);
      return true;
    } catch (error) {
      console.error("Failed to save onboarding data to API:", error);
      return false;
    }
  }

  // Tutorial and Help
  public markTutorialComplete(
    tutorialKey: keyof OnboardingData["tutorial"],
  ): void {
    this.onboardingData.tutorial[tutorialKey] = true;
    this.saveOnboardingDataLocally();
  }

  public shouldShowTutorial(
    tutorialKey: keyof OnboardingData["tutorial"],
  ): boolean {
    return !this.onboardingData.tutorial[tutorialKey];
  }

  public getTutorialProgress(): {
    completed: number;
    total: number;
    percentage: number;
  } {
    const tutorial = this.onboardingData.tutorial;
    const keys = Object.keys(tutorial) as Array<keyof typeof tutorial>;
    const completed = keys.filter((key) => tutorial[key]).length;
    const total = keys.length;

    return {
      completed,
      total,
      percentage: (completed / total) * 100,
    };
  }

  // Recommendations
  public getRecommendedMeditationTypes(): MeditationType[] {
    const { experienceLevel } = this.onboardingData.personalInfo;
    const { goals } = this.onboardingData.personalInfo;

    let recommendations: MeditationType[] = [];

    // Base recommendations by experience level
    switch (experienceLevel) {
      case "beginner":
        recommendations = ["guided", "breathing", "mindfulness"];
        break;
      case "intermediate":
        recommendations = ["mindfulness", "body-scan", "loving-kindness"];
        break;
      case "advanced":
        recommendations = ["focus", "loving-kindness", "body-scan"];
        break;
    }

    // Adjust based on goals
    if (goals.includes("stress relief")) {
      recommendations.unshift("stress-relief");
    }
    if (goals.includes("better sleep")) {
      recommendations.unshift("sleep");
    }
    if (goals.includes("focus and concentration")) {
      recommendations.unshift("focus");
    }

    // Remove duplicates and limit to 3
    return Array.from(new Set(recommendations)).slice(0, 3);
  }

  public getRecommendedSessionDuration(): number {
    const { experienceLevel } = this.onboardingData.personalInfo;

    switch (experienceLevel) {
      case "beginner":
        return 5;
      case "intermediate":
        return 10;
      case "advanced":
        return 15;
      default:
        return 5;
    }
  }

  public getRecommendedGoals(): {
    dailyMinutes: number;
    weeklyDays: number;
  } {
    const { experienceLevel } = this.onboardingData.personalInfo;

    switch (experienceLevel) {
      case "beginner":
        return { dailyMinutes: 10, weeklyDays: 3 };
      case "intermediate":
        return { dailyMinutes: 20, weeklyDays: 5 };
      case "advanced":
        return { dailyMinutes: 30, weeklyDays: 6 };
      default:
        return { dailyMinutes: 10, weeklyDays: 3 };
    }
  }

  // Validation
  public validateStepData(
    stepId: string,
    data: unknown,
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    switch (stepId) {
      case "personal-info": {
        const personalInfo = data as Partial<OnboardingData["personalInfo"]>;
        if (!personalInfo.experienceLevel) {
          errors.push("Please select your experience level");
        }
        if (!personalInfo.goals || personalInfo.goals.length === 0) {
          errors.push("Please select at least one goal");
        }
        break;
      }

      case "meditation-preferences": {
        const preferences = data as Partial<OnboardingData["preferences"]>;
        if (
          !preferences.preferredMeditationTypes ||
          preferences.preferredMeditationTypes.length === 0
        ) {
          errors.push("Please select at least one meditation type");
        }
        break;
      }

      case "schedule-goals": {
        const schedule = data as Partial<OnboardingData["schedule"]>;
        if (!schedule.dailyGoalMinutes || schedule.dailyGoalMinutes < 1) {
          errors.push("Please set a daily goal of at least 1 minute");
        }
        if (!schedule.weeklyGoalDays || schedule.weeklyGoalDays < 1) {
          errors.push("Please set a weekly goal of at least 1 day");
        }
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Reset and Cleanup
  public resetOnboarding(): void {
    this.onboardingData = this.getDefaultOnboardingData();
    this.progress = {
      currentStep: 1,
      totalSteps: this.getOnboardingSteps().filter((s) => s.isRequired).length,
      completedSteps: [],
      isCompleted: false,
      startedAt: new Date(),
    };

    this.saveProgress();
    this.saveOnboardingDataLocally();
  }

  public isOnboardingCompleted(): boolean {
    return this.progress.isCompleted;
  }

  // Private Methods
  private getDefaultOnboardingData(): OnboardingData {
    return {
      personalInfo: {
        experienceLevel: "beginner",
        goals: [],
      },
      preferences: {
        preferredMeditationTypes: [],
        sessionDuration: 5,
        soundPreferences: {
          naturesSounds: true,
          binauralBeats: false,
          guidedVoice: true,
        },
      },
      schedule: {
        dailyGoalMinutes: 10,
        preferredTimes: [],
        weeklyGoalDays: 3,
      },
      permissions: {
        notifications: false,
        camera: false,
        location: false,
      },
      tutorial: {
        hasSeenWelcome: false,
        hasCompletedFirstSession: false,
        hasJoinedGroup: false,
        hasScannedQR: false,
      },
    };
  }

  private loadProgress(): OnboardingProgress {
    try {
      const saved = localStorage.getItem("onboarding_progress");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          startedAt: new Date(parsed.startedAt),
          completedAt: parsed.completedAt
            ? new Date(parsed.completedAt)
            : undefined,
        };
      }
    } catch (error) {
      console.error("Failed to load onboarding progress:", error);
    }

    return {
      currentStep: 1,
      totalSteps: this.getOnboardingSteps().filter((s) => s.isRequired).length,
      completedSteps: [],
      isCompleted: false,
      startedAt: new Date(),
    };
  }

  private saveProgress(): void {
    try {
      localStorage.setItem(
        "onboarding_progress",
        JSON.stringify(this.progress),
      );
    } catch (error) {
      console.error("Failed to save onboarding progress:", error);
    }
  }

  private saveOnboardingDataLocally(): void {
    try {
      localStorage.setItem(
        "onboarding_data",
        JSON.stringify(this.onboardingData),
      );
    } catch (error) {
      console.error("Failed to save onboarding data locally:", error);
    }
  }

  private deepMerge(target: unknown, source: unknown): OnboardingData {
    if (
      typeof target !== "object" ||
      target === null ||
      typeof source !== "object" ||
      source === null
    ) {
      return source as OnboardingData;
    }

    const result = { ...target } as Record<string, unknown>;

    for (const key in source as Record<string, unknown>) {
      const sourceValue = (source as Record<string, unknown>)[key];
      const targetValue = result[key];

      if (
        typeof sourceValue === "object" &&
        sourceValue !== null &&
        !Array.isArray(sourceValue)
      ) {
        result[key] = this.deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    }

    // Validate the result has the required structure
    const defaultData = this.getDefaultOnboardingData();
    return { ...defaultData, ...result } as OnboardingData;
  }
}

export const onboardingService = OnboardingService.getInstance();
