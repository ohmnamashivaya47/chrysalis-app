import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

interface AuthenticatedRequest extends Express.Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'uploads');
const avatar_urlDir = path.join(uploadDir, 'profile-pictures');

[uploadDir, avatar_urlDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for profile pictures
const avatar_urlStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatar_urlDir);
  },
  filename: (req, file, cb) => {
    const userId = (req as AuthenticatedRequest).user?.id || 'anonymous';
    const extension = path.extname(file.originalname);
    const filename = `${userId}-${Date.now()}${extension}`;
    cb(null, filename);
  }
});

// File filter for images
const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const uploadProfilePicture = multer({
  storage: avatar_urlStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Upload profile picture
router.post('/profile-picture', authenticateToken, (req, res, next) => {
  uploadProfilePicture.single('avatar_url')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, asyncHandler(async (req, res) => {
  const userId = (req as AuthenticatedRequest).user!.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Update user's profile picture URL in database
    const avatar_urlUrl = `/uploads/profile-pictures/${file.filename}`;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar_url: avatar_urlUrl },
      select: {
        id: true,
        username: true,
        
        
        email: true,
        avatar_url: true
      }
    });

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      user: updatedUser,
      url: avatar_urlUrl
    });
  } catch (error) {
    // Clean up uploaded file if database update fails
    fs.unlink(file.path, (unlinkErr) => {
      if (unlinkErr) console.error('Failed to delete uploaded file:', unlinkErr);
    });
    
    console.error('Profile picture upload error:', error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
}));

export default router;
