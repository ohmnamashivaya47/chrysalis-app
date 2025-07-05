import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

interface JWTPayload {
  user_id: string;
  email: string;
  username: string;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
      });
      return;
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as JWTPayload;

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.user_id },
      select: {
        id: true,
        email: true,
        username: true,
        is_public: true,
        last_active: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Update last active timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { last_active: new Date() },
    });

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username || '',
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.user_id },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        username: user.username || '',
      };
    }

    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    next();
  }
};

export { AuthRequest };
