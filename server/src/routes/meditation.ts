import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRequest, schemas } from '../middleware/validation';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Start meditation session
router.post('/sessions/start',
  validateRequest(schemas.startSession),
  async (req: AuthRequest, res) => {
    try {
      const { meditation_type, duration_minutes, audio_settings } = req.body;
      const userId = req.user!.id;

      const session = await prisma.meditationSession.create({
        data: {
          user_id: userId,
          meditation_type,
          duration_minutes,
          audio_settings: audio_settings || {},
          started_at: new Date(),
        },
      });

      res.status(201).json({
        success: true,
        data: {
          sessionId: session.id,
        },
      });
    } catch (error) {
      console.error('Start session error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start meditation session',
      });
    }
  }
);

// Complete meditation session
router.put('/sessions/:id/complete',
  validateRequest({
    ...schemas.completeSession,
    params: schemas.idParam.params,
  }),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { mood_before, mood_after, notes, session_data } = req.body;
      const userId = req.user!.id;

      // Verify session belongs to user
      const session = await prisma.meditationSession.findFirst({
        where: {
          id,
          user_id: userId,
        },
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found',
        });
      }

      if (session.completed) {
        return res.status(400).json({
          success: false,
          error: 'Session already completed',
        });
      }

      // Update session
      const updatedSession = await prisma.meditationSession.update({
        where: { id },
        data: {
          completed: true,
          completed_at: new Date(),
          mood_before,
          mood_after,
          notes,
          session_data: session_data || {},
        },
      });

      // Update user's total meditation minutes
      await prisma.user.update({
        where: { id: userId },
        data: {
          total_meditation_minutes: {
            increment: session.duration_minutes,
          },
        },
      });

      res.json({
        success: true,
        data: {
          id: updatedSession.id,
          meditationType: updatedSession.meditation_type,
          durationMinutes: updatedSession.duration_minutes,
          completed: updatedSession.completed,
          startedAt: updatedSession.started_at,
          completedAt: updatedSession.completed_at,
          moodBefore: updatedSession.mood_before,
          moodAfter: updatedSession.mood_after,
          notes: updatedSession.notes,
        },
      });
    } catch (error) {
      console.error('Complete session error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete meditation session',
      });
    }
  }
);

// Get user's meditation sessions
router.get('/sessions', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20, completed } = req.query;

    const where = {
      user_id: userId,
      ...(completed !== undefined && { completed: completed === 'true' }),
    };

    const sessions = await prisma.meditationSession.findMany({
      where,
      orderBy: { started_at: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    res.json({
      success: true,
      data: sessions.map(session => ({
        id: session.id,
        meditationType: session.meditation_type,
        durationMinutes: session.duration_minutes,
        completed: session.completed,
        startedAt: session.started_at,
        completedAt: session.completed_at,
        moodBefore: session.mood_before,
        moodAfter: session.mood_after,
        notes: session.notes,
      })),
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get meditation sessions',
    });
  }
});

// Get meditation statistics
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get user's basic stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        total_meditation_minutes: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get session statistics
    const sessionStats = await prisma.meditationSession.aggregate({
      where: {
        user_id: userId,
        completed: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        duration_minutes: true,
      },
    });

    // Get current streak (consecutive days with meditation)
    const recentSessions = await prisma.meditationSession.findMany({
      where: {
        user_id: userId,
        completed: true,
      },
      orderBy: { completed_at: 'desc' },
      take: 100, // Get recent sessions to calculate streak
      select: {
        completed_at: true,
      },
    });

    let currentStreak = 0;
    const today = new Date();
    const sessionDates = recentSessions.map(s => 
      new Date(s.completed_at!).toDateString()
    );
    const uniqueDates = [...new Set(sessionDates)];

    for (let i = 0; i < uniqueDates.length; i++) {
      const sessionDate = new Date(uniqueDates[i] as string);
      const daysDiff = Math.floor(
        (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    res.json({
      success: true,
      data: {
        totalMinutes: user.total_meditation_minutes,
        totalSessions: sessionStats._count.id,
        averageSessionLength: sessionStats._avg.duration_minutes || 0,
        currentStreak,
        memberSince: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get meditation statistics',
    });
  }
});

export default router;
