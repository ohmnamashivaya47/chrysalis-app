import { AudioGenerationService } from "./audioGenerator";
import { apiClient } from "./api";
import type {
  MeditationSession,
  MeditationSettings,
  SessionProgress,
  MeditationType,
  NatureSoundConfig,
} from "../types";

export class MeditationSessionService {
  private static instance: MeditationSessionService;
  private audioGenerator: AudioGenerationService;
  private currentSession: MeditationSession | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  private progressTimer: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private pausedTime: number = 0;
  private listeners: Map<string, ((progress: SessionProgress) => void)[]> =
    new Map();

  private constructor() {
    this.audioGenerator = new AudioGenerationService();
    this.setupEventListeners();
    this.initializeAudio();
  }

  private async initializeAudio(): Promise<void> {
    try {
      await this.audioGenerator.initialize();
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }

  public static getInstance(): MeditationSessionService {
    if (!MeditationSessionService.instance) {
      MeditationSessionService.instance = new MeditationSessionService();
    }
    return MeditationSessionService.instance;
  }

  private setupEventListeners(): void {
    // Handle page visibility changes for pause/resume
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.currentSession?.state === "active") {
        this.pauseSession();
      }
    });

    // Handle before unload to save session
    window.addEventListener("beforeunload", () => {
      if (this.currentSession) {
        this.saveSessionProgress();
      }
    });
  }

  public async startSession(
    settings: MeditationSettings,
  ): Promise<MeditationSession> {
    try {
      // Stop any existing session
      if (this.currentSession) {
        await this.stopSession();
      }

      // Create new session
      const sessionId = this.generateSessionId();
      const session: MeditationSession = {
        id: sessionId,
        userId: settings.userId,
        type: settings.type,
        duration: settings.duration,
        settings,
        state: "preparing",
        startedAt: new Date(),
        progress: {
          currentTime: 0,
          totalTime: settings.duration * 60, // Convert minutes to seconds
          percentage: 0,
          phase: "preparation",
        },
        analytics: {
          heartRateVariability: [],
          stressLevel: 50,
          focusScore: 0,
          calmScore: 0,
          sessionQuality: 0,
        },
      };

      this.currentSession = session;

      // Start audio generation
      await this.startAudioForSession(settings);

      // Begin session countdown
      await this.beginSession();

      // Save to API
      await this.saveSessionToAPI(session);

      return session;
    } catch (error) {
      console.error("Failed to start meditation session:", error);
      throw new Error("Failed to start meditation session");
    }
  }

  private async beginSession(): Promise<void> {
    if (!this.currentSession) return;

    // Preparation phase (10 seconds)
    this.currentSession.state = "preparing";
    this.notifyProgressListeners();

    await this.delay(3000); // 3 second preparation

    // Start active meditation
    this.currentSession.state = "active";
    this.currentSession.progress.phase = "meditation";
    this.startTime = Date.now();

    this.startProgressTracking();
    this.startSessionTimer();

    this.notifyProgressListeners();
  }

  private startProgressTracking(): void {
    this.progressTimer = setInterval(() => {
      if (!this.currentSession || this.currentSession.state !== "active")
        return;

      const elapsed = (Date.now() - this.startTime - this.pausedTime) / 1000;
      const totalTime = this.currentSession.progress.totalTime;

      this.currentSession.progress.currentTime = Math.min(elapsed, totalTime);
      this.currentSession.progress.percentage = (elapsed / totalTime) * 100;

      // Update phase based on progress
      if (this.currentSession.progress.percentage < 10) {
        this.currentSession.progress.phase = "settling";
      } else if (this.currentSession.progress.percentage < 90) {
        this.currentSession.progress.phase = "meditation";
      } else {
        this.currentSession.progress.phase = "completion";
      }

      // Update analytics
      this.updateAnalytics();

      this.notifyProgressListeners();

      // Check if session is complete
      if (elapsed >= totalTime) {
        this.completeSession();
      }
    }, 1000);
  }

  private startSessionTimer(): void {
    const duration = this.currentSession!.duration * 60 * 1000; // Convert to milliseconds

    this.sessionTimer = setTimeout(() => {
      this.completeSession();
    }, duration);
  }

  public pauseSession(): void {
    if (!this.currentSession || this.currentSession.state !== "active") return;

    this.currentSession.state = "paused";
    this.pausedTime += Date.now() - this.startTime;

    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }

    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }

    this.pauseAudio();
    this.saveSessionProgress();
    this.notifyProgressListeners();
  }

  public resumeSession(): void {
    if (!this.currentSession || this.currentSession.state !== "paused") return;

    this.currentSession.state = "active";
    this.startTime = Date.now();

    this.startProgressTracking();

    // Restart session timer with remaining time
    const elapsed = this.currentSession.progress.currentTime;
    const remaining = (this.currentSession.progress.totalTime - elapsed) * 1000;

    this.sessionTimer = setTimeout(() => {
      this.completeSession();
    }, remaining);

    this.resumeAudio();
    this.notifyProgressListeners();
  }

  public async stopSession(): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.state = "stopped";
    this.currentSession.endedAt = new Date();

    this.cleanup();
    this.stopAudio();
    await this.saveSessionToAPI(this.currentSession);

    this.notifyProgressListeners();
    this.currentSession = null;
  }

  private async completeSession(): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.state = "completed";
    this.currentSession.endedAt = new Date();
    this.currentSession.progress.percentage = 100;
    this.currentSession.progress.phase = "completion";

    // Calculate final analytics
    this.calculateFinalAnalytics();

    this.cleanup();
    this.stopAudio();
    await this.saveSessionToAPI(this.currentSession);

    this.notifyProgressListeners();

    // Show completion celebration
    this.showCompletionFeedback();

    this.currentSession = null;
  }

  private updateAnalytics(): void {
    if (!this.currentSession) return;

    const progress = this.currentSession.progress.percentage;
    const analytics = this.currentSession.analytics;

    // Simulate heart rate variability (in real app, this would come from sensors)
    const baseHRV = 30 + Math.random() * 20;
    const timeBonus = Math.min(progress / 100, 1) * 10;
    analytics.heartRateVariability.push(baseHRV + timeBonus);

    // Calculate stress level (decreases over time)
    analytics.stressLevel = Math.max(10, 50 - progress * 0.4);

    // Calculate focus score (increases with time and stability)
    analytics.focusScore = Math.min(
      100,
      progress * 0.8 + analytics.heartRateVariability.length * 2,
    );

    // Calculate calm score
    analytics.calmScore = Math.min(100, (100 - analytics.stressLevel) * 1.2);
  }

  private calculateFinalAnalytics(): void {
    if (!this.currentSession) return;

    const analytics = this.currentSession.analytics;
    const duration = this.currentSession.progress.currentTime / 60; // minutes

    // Session quality based on completion, focus, and calm scores
    const completionBonus =
      this.currentSession.progress.percentage >= 95 ? 20 : 0;
    const durationBonus =
      Math.min(duration / this.currentSession.duration, 1) * 20;

    analytics.sessionQuality = Math.min(
      100,
      analytics.focusScore * 0.3 +
        analytics.calmScore * 0.3 +
        completionBonus +
        durationBonus,
    );
  }

  private cleanup(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }

    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  private async saveSessionToAPI(session: MeditationSession): Promise<void> {
    try {
      await apiClient.post("/sessions", session);
    } catch (error) {
      console.error("Failed to save session to API:", error);
      // Save to local storage as backup
      this.saveSessionToStorage(session);
    }
  }

  private saveSessionProgress(): void {
    if (!this.currentSession) return;

    localStorage.setItem(
      `meditation_session_${this.currentSession.id}`,
      JSON.stringify(this.currentSession),
    );
  }

  private saveSessionToStorage(session: MeditationSession): void {
    const sessions = this.getStoredSessions();
    sessions.push(session);
    localStorage.setItem("meditation_sessions", JSON.stringify(sessions));
  }

  private getStoredSessions(): MeditationSession[] {
    try {
      const stored = localStorage.getItem("meditation_sessions");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public getCurrentSession(): MeditationSession | null {
    return this.currentSession;
  }

  public getSessionHistory(): MeditationSession[] {
    return this.getStoredSessions();
  }

  public addEventListener(
    event: string,
    callback: (progress: SessionProgress) => void,
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public removeEventListener(
    event: string,
    callback: (progress: SessionProgress) => void,
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private notifyProgressListeners(): void {
    if (!this.currentSession) return;

    const progressListeners = this.listeners.get("progress") || [];
    progressListeners.forEach((callback) => {
      try {
        callback(this.currentSession!.progress);
      } catch (error) {
        console.error("Error in progress listener:", error);
      }
    });
  }

  private showCompletionFeedback(): void {
    // This would trigger a completion celebration in the UI
    const completionListeners = this.listeners.get("completion") || [];
    completionListeners.forEach((callback) => {
      try {
        callback(this.currentSession!.progress);
      } catch (error) {
        console.error("Error in completion listener:", error);
      }
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Audio management methods
  private async startAudioForSession(
    settings: MeditationSettings,
  ): Promise<void> {
    try {
      await this.audioGenerator.resumeAudioContext();

      // Generate appropriate sounds based on settings
      if (settings.soundscape.enabled) {
        const natureConfig: NatureSoundConfig = {
          forest:
            settings.soundscape.type === "forest"
              ? settings.soundscape.volume
              : 0,
          rain:
            settings.soundscape.type === "rain"
              ? settings.soundscape.volume
              : 0,
          ocean:
            settings.soundscape.type === "ocean"
              ? settings.soundscape.volume
              : 0,
          wind:
            settings.soundscape.type === "nature"
              ? settings.soundscape.volume
              : 0,
          birds:
            settings.soundscape.type === "nature"
              ? settings.soundscape.volume * 0.3
              : 0,
        };
        this.audioGenerator.generateNatureSounds(natureConfig);
      }

      if (settings.binauralBeats.enabled) {
        this.audioGenerator.generateBinauralBeats(
          settings.binauralBeats.frequency,
          settings.binauralBeats.frequency + 10, // Beat frequency
        );
      }
    } catch (error) {
      console.error("Failed to start audio for session:", error);
    }
  }

  private pauseAudio(): void {
    // Fade out audio
    this.audioGenerator.fadeOut(1);
  }

  private resumeAudio(): void {
    // Fade in audio
    this.audioGenerator.fadeIn(1);
  }

  private stopAudio(): void {
    this.audioGenerator.stop();
  }

  // Preset meditation templates
  public getPresetTemplates(): Record<MeditationType, MeditationSettings> {
    return {
      mindfulness: {
        userId: "",
        type: "mindfulness",
        duration: 15,
        soundscape: {
          enabled: true,
          type: "forest",
          volume: 0.4,
        },
        binauralBeats: {
          enabled: true,
          frequency: 8,
          volume: 0.15,
        },
        guidedVoice: {
          enabled: true,
          voice: "female",
          language: "en",
          volume: 0.6,
        },
        breathingPattern: {
          enabled: false,
          inhale: 4,
          hold: 4,
          exhale: 4,
          pause: 0,
        },
      },
      "body-scan": {
        userId: "",
        type: "body-scan",
        duration: 20,
        soundscape: {
          enabled: true,
          type: "ocean",
          volume: 0.3,
        },
        binauralBeats: {
          enabled: true,
          frequency: 6,
          volume: 0.2,
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
          exhale: 6,
          pause: 2,
        },
      },
      "loving-kindness": {
        userId: "",
        type: "loving-kindness",
        duration: 12,
        soundscape: {
          enabled: true,
          type: "nature",
          volume: 0.3,
        },
        binauralBeats: {
          enabled: true,
          frequency: 8,
          volume: 0.15,
        },
        guidedVoice: {
          enabled: true,
          voice: "female",
          language: "en",
          volume: 0.8,
        },
        breathingPattern: {
          enabled: false,
          inhale: 4,
          hold: 2,
          exhale: 6,
          pause: 0,
        },
      },
      "focused-attention": {
        userId: "",
        type: "focused-attention",
        duration: 18,
        soundscape: {
          enabled: true,
          type: "white-noise",
          volume: 0.2,
        },
        binauralBeats: {
          enabled: true,
          frequency: 12,
          volume: 0.25,
        },
        guidedVoice: {
          enabled: true,
          voice: "male",
          language: "en",
          volume: 0.6,
        },
        breathingPattern: {
          enabled: true,
          inhale: 4,
          hold: 4,
          exhale: 4,
          pause: 0,
        },
      },
      guided: {
        userId: "",
        type: "guided",
        duration: 10,
        soundscape: {
          enabled: true,
          type: "nature",
          volume: 0.3,
        },
        binauralBeats: {
          enabled: true,
          frequency: 10,
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
      breathing: {
        userId: "",
        type: "breathing",
        duration: 5,
        soundscape: {
          enabled: true,
          type: "ocean",
          volume: 0.2,
        },
        binauralBeats: {
          enabled: false,
          frequency: 10,
          volume: 0.2,
        },
        guidedVoice: {
          enabled: true,
          voice: "male",
          language: "en",
          volume: 0.5,
        },
        breathingPattern: {
          enabled: true,
          inhale: 4,
          hold: 0,
          exhale: 6,
          pause: 0,
        },
      },
      sleep: {
        userId: "",
        type: "sleep",
        duration: 30,
        soundscape: {
          enabled: true,
          type: "rain",
          volume: 0.6,
        },
        binauralBeats: {
          enabled: true,
          frequency: 4,
          volume: 0.3,
        },
        guidedVoice: {
          enabled: true,
          voice: "female",
          language: "en",
          volume: 0.4,
        },
        breathingPattern: {
          enabled: true,
          inhale: 6,
          hold: 2,
          exhale: 8,
          pause: 2,
        },
      },
      focus: {
        userId: "",
        type: "focus",
        duration: 25,
        soundscape: {
          enabled: true,
          type: "white-noise",
          volume: 0.3,
        },
        binauralBeats: {
          enabled: true,
          frequency: 40,
          volume: 0.25,
        },
        guidedVoice: {
          enabled: false,
          voice: "male",
          language: "en",
          volume: 0.5,
        },
        breathingPattern: {
          enabled: false,
          inhale: 4,
          hold: 4,
          exhale: 4,
          pause: 0,
        },
      },
      "stress-relief": {
        userId: "",
        type: "stress-relief",
        duration: 12,
        soundscape: {
          enabled: true,
          type: "ocean",
          volume: 0.5,
        },
        binauralBeats: {
          enabled: true,
          frequency: 6,
          volume: 0.2,
        },
        guidedVoice: {
          enabled: true,
          voice: "female",
          language: "en",
          volume: 0.6,
        },
        breathingPattern: {
          enabled: true,
          inhale: 5,
          hold: 5,
          exhale: 10,
          pause: 0,
        },
      },
    };
  }
}

export const meditationSessionService = MeditationSessionService.getInstance();
