"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Ensure upload directories exist
const uploadDir = path_1.default.join(process.cwd(), 'uploads');
const avatar_urlDir = path_1.default.join(uploadDir, 'profile-pictures');
[uploadDir, avatar_urlDir].forEach(dir => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
// Configure multer for profile pictures
const avatar_urlStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatar_urlDir);
    },
    filename: (req, file, cb) => {
        const userId = req.user?.id || 'anonymous';
        const extension = path_1.default.extname(file.originalname);
        const filename = `${userId}-${Date.now()}${extension}`;
        cb(null, filename);
    }
});
// File filter for images
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed'));
    }
};
const uploadProfilePicture = (0, multer_1.default)({
    storage: avatar_urlStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});
// Upload profile picture
router.post('/profile-picture', auth_1.authenticateToken, (req, res, next) => {
    uploadProfilePicture.single('avatar_url')(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
            }
            return res.status(400).json({ error: err.message });
        }
        else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
    }
    catch (error) {
        // Clean up uploaded file if database update fails
        fs_1.default.unlink(file.path, (unlinkErr) => {
            if (unlinkErr)
                console.error('Failed to delete uploaded file:', unlinkErr);
        });
        console.error('Profile picture upload error:', error);
        res.status(500).json({ error: 'Failed to update profile picture' });
    }
}));
exports.default = router;
//# sourceMappingURL=upload.js.map