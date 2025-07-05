import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRequest, schemas } from '../middleware/validation';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatar_url: true,
        created_at: true,
        is_public: true,
        total_meditation_minutes: true,
        last_active: true,
        qr_code: true,
        // Count followers and following
        followers: {
          select: { follower_id: true }
        },
        following: {
          select: { following_id: true }
        },
        // Recent meditation sessions
        meditation_sessions: {
          where: { completed: true },
          orderBy: { completed_at: 'desc' },
          take: 5,
          select: {
            id: true,
            meditation_type: true,
            duration_minutes: true,
            completed_at: true,
            mood_after: true,
          }
        }
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if requesting own profile or if profile is public
    const isOwnProfile = req.user?.id === user.id;
    const canViewProfile = isOwnProfile || user.is_public;

    if (!canViewProfile) {
      return res.status(403).json({
        success: false,
        error: 'Profile is private',
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: isOwnProfile ? user.email : undefined,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        isPublic: user.is_public,
        totalMeditationMinutes: user.total_meditation_minutes,
        lastActive: user.last_active,
        qrCode: isOwnProfile ? user.qr_code : undefined,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        recentSessions: user.meditation_sessions,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
    });
  }
});

// Update current user profile
router.put('/profile', 
  validateRequest(schemas.updateProfile),
  async (req: AuthRequest, res) => {
    try {
      const { username, bio, is_public } = req.body;
      const userId = req.user!.id;

      // Check if username is already taken (if provided)
      if (username) {
        const existingUser = await prisma.user.findFirst({
          where: {
            username,
            NOT: { id: userId },
          },
        });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            error: 'Username already taken',
          });
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(username !== undefined && { username }),
          ...(bio !== undefined && { bio }),
          ...(is_public !== undefined && { is_public }),
        },
        select: {
          id: true,
          email: true,
          username: true,
          bio: true,
          avatar_url: true,
          created_at: true,
          is_public: true,
          total_meditation_minutes: true,
          email_verified: true,
          last_active: true,
          qr_code: true,
        },
      });

      res.json({
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          bio: updatedUser.bio,
          avatarUrl: updatedUser.avatar_url,
          createdAt: updatedUser.created_at,
          isPublic: updatedUser.is_public,
          totalMeditationMinutes: updatedUser.total_meditation_minutes,
          emailVerified: updatedUser.email_verified,
          lastActive: updatedUser.last_active,
          qrCode: updatedUser.qr_code,
        },
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
      });
    }
  }
);

// Follow/unfollow user
router.post('/follow/:id', async (req: AuthRequest, res) => {
  try {
    const { id: targetUserId } = req.params;
    const followerId = req.user!.id;

    if (followerId === targetUserId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot follow yourself',
      });
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if already following
    const existingRelationship = await prisma.userRelationship.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: followerId,
          following_id: targetUserId,
        },
      },
    });

    if (existingRelationship) {
      // Unfollow
      await prisma.userRelationship.delete({
        where: {
          follower_id_following_id: {
            follower_id: followerId,
            following_id: targetUserId,
          },
        },
      });

      res.json({
        success: true,
        data: { following: false },
      });
    } else {
      // Follow
      await prisma.userRelationship.create({
        data: {
          follower_id: followerId,
          following_id: targetUserId,
        },
      });

      res.json({
        success: true,
        data: { following: true },
      });
    }
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update follow status',
    });
  }
});

// Get user's followers
router.get('/followers/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const followers = await prisma.userRelationship.findMany({
      where: { following_id: id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
            total_meditation_minutes: true,
          },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: followers.map(f => ({
        id: f.follower.id,
        username: f.follower.username,
        avatarUrl: f.follower.avatar_url,
        totalMeditationMinutes: f.follower.total_meditation_minutes,
        followedAt: f.created_at,
      })),
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get followers',
    });
  }
});

// Get user's following
router.get('/following/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const following = await prisma.userRelationship.findMany({
      where: { follower_id: id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
            total_meditation_minutes: true,
          },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: following.map(f => ({
        id: f.following.id,
        username: f.following.username,
        avatarUrl: f.following.avatar_url,
        totalMeditationMinutes: f.following.total_meditation_minutes,
        followedAt: f.created_at,
      })),
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get following',
    });
  }
});

export default router;
