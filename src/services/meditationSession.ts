/**
 * Mock Meditation Session Service - Frontend Only
 */

import type {
  MeditationSession,
  MeditationSettings,
  ApiResponse,
  MeditationType,
} from "../types";

class MockMeditationSessionService {
  private sessions: Map<string, MeditationSession> = new Map();
  private currentSessionId: string | null = null;
  private eventListeners: Map<string, ((data: unknown) => void)[]> = new Map();

  // Event listener methods
  addEventListener(event: string, callback: (data: unknown) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: (data: unknown) => void) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // private emit(event: string, data: unknown) {
  //   const listeners = this.eventListeners.get(event);
  //   if (listeners) {
  //     listeners.forEach(callback => callback(data));
  //   }
  // }

  async startSession(type: MeditationType, duration: number): Promise<ApiResponse<{ sessionId: string }>> {
    try {
      const sessionId = "session_" + Date.now();
      const userId = localStorage.getItem("currentUserId") || "demo1";
      
      const settings: MeditationSettings = {
        userId,
        type,
        duration,
        soundscape: {
          enabled: true,
          type: "ocean",
          volume: 0.5
        },
        binauralBeats: {
          enabled: false,
          frequency: 40,
          volume: 0.3
        },
        guidedVoice: {
          enabled: true,
          voice: "female",
          language: "en",
          volume: 0.7
        },
        breathingPattern: {
          enabled: true,
          inhale: 4,
          hold: 4,
          exhale: 6,
          pause: 2
        }
      };

      const session: MeditationSession = {
        id: sessionId,
        userId,
        type,
        duration,
        settings,
        state: "preparing",
        startedAt: new Date(),
        progress: {
          currentTime: 0,
          totalTime: duration * 60,
          percentage: 0,
          phase: "preparation"
        },
        analytics: {
          heartRateVariability: [],
          stressLevel: 0,
          focusScore: 0,
          calmScore: 0,
          sessionQuality: 0
        }
      };

      this.sessions.set(sessionId, session);
      this.currentSessionId = sessionId;

      return {
        success: true,
        data: { sessionId }
      };
    } catch {
      return {
        success: false,
        error: "Failed to start session"
      };
    }
  }

  async pauseSession(sessionId: string): Promise<ApiResponse<void>> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      session.state = "paused";
      this.sessions.set(sessionId, session);

      return {
        success: true,
        data: undefined
      };
    } catch {
      return {
        success: false,
        error: "Failed to pause session"
      };
    }
  }

  async completeSession(sessionId: string): Promise<ApiResponse<MeditationSession>> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      const completedSession: MeditationSession = {
        ...session,
        state: "completed",
        endedAt: new Date(),
        progress: {
          ...session.progress,
          currentTime: session.duration * 60,
          percentage: 100,
          phase: "completion"
        }
      };

      this.sessions.set(sessionId, completedSession);
      this.currentSessionId = null;

      // Update user's total meditation time
      const userId = localStorage.getItem("currentUserId");
      if (userId) {
        const currentMinutes = parseInt(localStorage.getItem("totalMeditationMinutes") || "0");
        const newMinutes = currentMinutes + session.duration;
        localStorage.setItem("totalMeditationMinutes", newMinutes.toString());
      }

      return {
        success: true,
        data: completedSession
      };
    } catch {
      return {
        success: false,
        error: "Failed to complete session"
      };
    }
  }

  async getUserSessions(userId: string): Promise<ApiResponse<MeditationSession[]>> {
    try {
      const userSessions = Array.from(this.sessions.values())
        .filter(session => session.userId === userId)
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

      return {
        success: true,
        data: userSessions
      };
    } catch {
      return {
        success: false,
        error: "Failed to get user sessions"
      };
    }
  }

  getCurrentSession(): MeditationSession | null {
    if (!this.currentSessionId) return null;
    return this.sessions.get(this.currentSessionId) || null;
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  async resumeSession(): Promise<ApiResponse<void>> {
    try {
      if (!this.currentSessionId) {
        return {
          success: false,
          error: "No session to resume"
        };
      }

      const session = this.sessions.get(this.currentSessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      session.state = "active";
      this.sessions.set(this.currentSessionId, session);

      return {
        success: true,
        data: undefined
      };
    } catch {
      return {
        success: false,
        error: "Failed to resume session"
      };
    }
  }

  async stopSession(): Promise<ApiResponse<void>> {
    try {
      if (!this.currentSessionId) {
        return {
          success: false,
          error: "No session to stop"
        };
      }

      const session = this.sessions.get(this.currentSessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      session.state = "completed";
      session.endedAt = new Date();
      this.sessions.set(this.currentSessionId, session);
      this.currentSessionId = null;

      return {
        success: true,
        data: undefined
      };
    } catch {
      return {
        success: false,
        error: "Failed to stop session"
      };
    }
  }

  async getSessionHistory(): Promise<ApiResponse<MeditationSession[]>> {
    try {
      const history = Array.from(this.sessions.values())
        .filter(session => session.state === "completed")
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

      return {
        success: true,
        data: history
      };
    } catch {
      return {
        success: false,
        error: "Failed to get session history"
      };
    }
  }

  async getPresetTemplates(): Promise<ApiResponse<MeditationSettings[]>> {
    try {
      const templates: MeditationSettings[] = [
        {
          userId: "template",
          type: "mindfulness",
          duration: 10,
          soundscape: { enabled: true, type: "ocean", volume: 0.5 },
          binauralBeats: { enabled: false, frequency: 40, volume: 0.3 },
          guidedVoice: { enabled: true, voice: "female", language: "en", volume: 0.7 },
          breathingPattern: { enabled: true, inhale: 4, hold: 4, exhale: 6, pause: 2 }
        },
        {
          userId: "template",
          type: "breathing",
          duration: 5,
          soundscape: { enabled: true, type: "forest", volume: 0.3 },
          binauralBeats: { enabled: false, frequency: 40, volume: 0.3 },
          guidedVoice: { enabled: true, voice: "male", language: "en", volume: 0.8 },
          breathingPattern: { enabled: true, inhale: 4, hold: 7, exhale: 8, pause: 1 }
        }
      ];

      return {
        success: true,
        data: templates
      };
    } catch {
      return {
        success: false,
        error: "Failed to get preset templates"
      };
    }
  }

  async getSession(sessionId: string): Promise<ApiResponse<MeditationSession>> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      return {
        success: true,
        data: session
      };
    } catch {
      return {
        success: false,
        error: "Failed to get session"
      };
    }
  }
}

export const meditationSessionService = new MockMeditationSessionService();
