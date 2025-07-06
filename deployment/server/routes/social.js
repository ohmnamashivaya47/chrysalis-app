"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Get social feed
router.get('/feed', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const userId = req.user.id;
        const posts = await prisma.post.findMany({
            where: {
                is_public: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar_url: true,
                    },
                },
                likes: {
                    where: { user_id: userId },
                    select: { id: true },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });
        res.json({
            success: true,
            data: posts.map(post => ({
                id: post.id,
                content: post.content,
                imageUrl: post.image_url,
                audioUrl: post.audio_url,
                isGuidedMeditation: post.is_guided_meditation,
                createdAt: post.created_at,
                user: {
                    id: post.user.id,
                    username: post.user.username,
                    avatarUrl: post.user.avatar_url,
                },
                likesCount: post._count.likes,
                commentsCount: post._count.comments,
                isLiked: post.likes.length > 0,
            })),
        });
    }
    catch (error) {
        console.error('Get feed error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get social feed',
        });
    }
});
// Create post
router.post('/posts', (0, validation_1.validateRequest)(validation_1.schemas.createPost), async (req, res) => {
    try {
        const { content, image_url, audio_url, is_guided_meditation, is_public } = req.body;
        const userId = req.user.id;
        const post = await prisma.post.create({
            data: {
                user_id: userId,
                content,
                image_url,
                audio_url,
                is_guided_meditation: is_guided_meditation || false,
                is_public: is_public !== false, // Default to true
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar_url: true,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            data: {
                id: post.id,
                content: post.content,
                imageUrl: post.image_url,
                audioUrl: post.audio_url,
                isGuidedMeditation: post.is_guided_meditation,
                isPublic: post.is_public,
                createdAt: post.created_at,
                user: {
                    id: post.user.id,
                    username: post.user.username,
                    avatarUrl: post.user.avatar_url,
                },
                likesCount: 0,
                commentsCount: 0,
                isLiked: false,
            },
        });
    }
    catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create post',
        });
    }
});
// Like/unlike post
router.post('/posts/:id/like', async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user.id;
        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found',
            });
        }
        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                user_id_post_id: {
                    user_id: userId,
                    post_id: postId,
                },
            },
        });
        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: { id: existingLike.id },
            });
            res.json({
                success: true,
                data: { liked: false },
            });
        }
        else {
            // Like
            await prisma.like.create({
                data: {
                    user_id: userId,
                    post_id: postId,
                },
            });
            res.json({
                success: true,
                data: { liked: true },
            });
        }
    }
    catch (error) {
        console.error('Like/unlike post error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update like status',
        });
    }
});
// Get post comments
router.get('/posts/:id/comments', async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const comments = await prisma.comment.findMany({
            where: { post_id: postId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar_url: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });
        res.json({
            success: true,
            data: comments.map(comment => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.created_at,
                user: {
                    id: comment.user.id,
                    username: comment.user.username,
                    avatarUrl: comment.user.avatar_url,
                },
            })),
        });
    }
    catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get comments',
        });
    }
});
// Create comment
router.post('/posts/:id/comments', (0, validation_1.validateRequest)({
    ...validation_1.schemas.createComment,
    params: validation_1.schemas.idParam.params,
}), async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found',
            });
        }
        const comment = await prisma.comment.create({
            data: {
                user_id: userId,
                post_id: postId,
                content,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar_url: true,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            data: {
                id: comment.id,
                content: comment.content,
                createdAt: comment.created_at,
                user: {
                    id: comment.user.id,
                    username: comment.user.username,
                    avatarUrl: comment.user.avatar_url,
                },
            },
        });
    }
    catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create comment',
        });
    }
});
exports.default = router;
//# sourceMappingURL=social.js.map