/**
 * Mock Social Feed Service - Frontend Only
 */

import type {
  Post,
  Comment,
  User,
  ApiResponse,
} from "../types";

class MockSocialFeedService {
  private posts: Map<string, Post> = new Map();
  private comments: Map<string, Comment> = new Map();
  private likes: Set<string> = new Set(); // postId:userId format

  constructor() {
    this.initializeDemoPosts();
  }

  private initializeDemoPosts() {
    const demoPosts: Post[] = [
      {
        id: "post1",
        userId: "demo1",
        content: "Just completed a 20-minute mindfulness session. Feeling centered and peaceful!",
        imageUrl: undefined,
        audioUrl: undefined,
        isGuidedMeditation: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        likesCount: 5,
        commentsCount: 2,
        isPublic: true,
        isLiked: false
      },
      {
        id: "post2",
        userId: "demo1",
        content: "Sharing my morning meditation routine. The breath awareness practice really helps with focus.",
        imageUrl: undefined,
        audioUrl: undefined,
        isGuidedMeditation: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        likesCount: 12,
        commentsCount: 4,
        isPublic: true,
        isLiked: false
      }
    ];

    demoPosts.forEach(post => {
      this.posts.set(post.id, post);
    });
  }

  async getFeed(userId: string, options?: { limit?: number; offset?: number }): Promise<ApiResponse<Post[]>> {
    try {
      const limit = options?.limit || 20;
      const offset = options?.offset || 0;

      const allPosts = Array.from(this.posts.values())
        .filter(post => post.isPublic)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(offset, offset + limit);

      // Add user info and like status
      const postsWithUserInfo = allPosts.map(post => ({
        ...post,
        isLiked: this.likes.has(`${post.id}:${userId}`),
        user: this.getDemoUser(post.userId)
      }));

      return {
        success: true,
        data: postsWithUserInfo
      };
    } catch {
      return {
        success: false,
        error: "Failed to get feed"
      };
    }
  }

  private getDemoUser(userId: string): User {
    return {
      id: userId,
      email: "demo@chrysalis.app",
      username: "demo_user",
      bio: "Meditation enthusiast",
      avatarUrl: undefined,
      createdAt: new Date(),
      isPublic: true,
      totalMeditationMinutes: 120,
      emailVerified: true,
      lastActive: new Date(),
      qrCode: "demo_qr"
    };
  }

  async createPost(content: string, isGuidedMeditation = false): Promise<ApiResponse<Post>> {
    try {
      const userId = localStorage.getItem("currentUserId") || "demo1";
      const postId = "post_" + Date.now();

      const newPost: Post = {
        id: postId,
        userId,
        content,
        imageUrl: undefined,
        audioUrl: undefined,
        isGuidedMeditation,
        createdAt: new Date(),
        likesCount: 0,
        commentsCount: 0,
        isPublic: true,
        isLiked: false,
        user: this.getDemoUser(userId)
      };

      this.posts.set(postId, newPost);

      return {
        success: true,
        data: newPost
      };
    } catch {
      return {
        success: false,
        error: "Failed to create post"
      };
    }
  }

  async likePost(postId: string): Promise<ApiResponse<void>> {
    try {
      const userId = localStorage.getItem("currentUserId") || "demo1";
      const likeKey = `${postId}:${userId}`;
      const post = this.posts.get(postId);

      if (!post) {
        return {
          success: false,
          error: "Post not found"
        };
      }

      if (this.likes.has(likeKey)) {
        // Unlike
        this.likes.delete(likeKey);
        post.likesCount = Math.max(0, post.likesCount - 1);
        post.isLiked = false;
      } else {
        // Like
        this.likes.add(likeKey);
        post.likesCount += 1;
        post.isLiked = true;
      }

      this.posts.set(postId, post);

      return {
        success: true,
        data: undefined
      };
    } catch {
      return {
        success: false,
        error: "Failed to like post"
      };
    }
  }

  async addComment(postId: string, content: string): Promise<ApiResponse<Comment>> {
    try {
      const userId = localStorage.getItem("currentUserId") || "demo1";
      const commentId = "comment_" + Date.now();

      const newComment: Comment = {
        id: commentId,
        userId,
        postId,
        content,
        createdAt: new Date(),
        user: this.getDemoUser(userId)
      };

      this.comments.set(commentId, newComment);

      // Update post comment count
      const post = this.posts.get(postId);
      if (post) {
        post.commentsCount += 1;
        this.posts.set(postId, post);
      }

      return {
        success: true,
        data: newComment
      };
    } catch {
      return {
        success: false,
        error: "Failed to add comment"
      };
    }
  }

  async getComments(postId: string): Promise<ApiResponse<Comment[]>> {
    try {
      const postComments = Array.from(this.comments.values())
        .filter(comment => comment.postId === postId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      return {
        success: true,
        data: postComments
      };
    } catch {
      return {
        success: false,
        error: "Failed to get comments"
      };
    }
  }

  async followUser(_userId: string): Promise<ApiResponse<void>> {
    // Mock implementation
    return {
      success: true,
      data: undefined
    };
  }

  async unfollowUser(_userId: string): Promise<ApiResponse<void>> {
    // Mock implementation
    return {
      success: true,
      data: undefined
    };
  }
}

export const socialFeedService = new MockSocialFeedService();
