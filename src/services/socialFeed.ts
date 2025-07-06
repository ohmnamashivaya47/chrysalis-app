/**
 * Social Feed Service - Fixed Version
 * Simplified implementation focused on core functionality
 */

import type {
  Post,
  Comment,
  Like,
  User,
  UserRelationship,
  CreatePostData,
  CreateCommentData,
  PaginatedResponse,
} from "../types";
import { apiClient } from "./api";

export interface PostFeedOptions {
  page?: number;
  limit?: number;
  userId?: string;
}

export interface SearchFilters {
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  minLikes?: number;
}

class SocialFeedService {
  private feedCache = new Map<string, Post[]>();
  private userCache = new Map<string, User>();
  private isLoading = false;

  // Feed Management
  public async getFeed(
    options: PostFeedOptions = {},
  ): Promise<PaginatedResponse<Post>> {
    try {
      this.isLoading = true;
      const { page = 1, limit = 10, userId } = options;

      // In development, use sample data
      if (import.meta.env.DEV) {
        const { samplePosts, simulateApiDelay } = await import(
          "../data/sampleData"
        );
        await simulateApiDelay(800); // Simulate network delay

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPosts = samplePosts.slice(startIndex, endIndex);

        return {
          items: paginatedPosts,
          total: samplePosts.length,
          page,
          limit,
          hasNext: endIndex < samplePosts.length,
          hasPrev: page > 1,
        };
      }

      const cacheKey = `feed-${userId || "global"}-${page}-${limit}`;

      const response = await apiClient.get<PaginatedResponse<Post>>(
        userId ? `/users/${userId}/posts` : "/posts",
        { page, limit },
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch feed");
      }

      // Cache the results
      this.feedCache.set(cacheKey, response.data.items);

      return response.data;
    } catch (error) {
      console.error("Failed to fetch feed:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  public async createPost(postData: CreatePostData): Promise<Post> {
    try {
      const response = await apiClient.post<Post>("/posts", postData);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create post");
      }

      // Clear cache to force refresh
      this.feedCache.clear();

      return response.data;
    } catch (error) {
      console.error("Failed to create post:", error);
      throw error;
    }
  }

  public async updatePost(
    postId: string,
    updates: Partial<CreatePostData>,
  ): Promise<Post> {
    try {
      const response = await apiClient.put<Post>(`/posts/${postId}`, updates);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update post");
      }

      // Update in cache
      this.updatePostInAllCaches(response.data);

      return response.data;
    } catch (error) {
      console.error("Failed to update post:", error);
      throw error;
    }
  }

  public async deletePost(postId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/posts/${postId}`);

      if (!response.success) {
        throw new Error(response.error || "Failed to delete post");
      }

      // Remove from all caches
      this.removePostFromAllCaches(postId);
    } catch (error) {
      console.error("Failed to delete post:", error);
      throw error;
    }
  }

  // Interaction Management
  public async likePost(postId: string): Promise<Like> {
    try {
      const response = await apiClient.post<Like>(`/posts/${postId}/like`);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to like post");
      }

      // Update post like status in cache
      this.updatePostLikeInAllCaches(postId, true);

      return response.data;
    } catch (error) {
      console.error("Failed to like post:", error);
      throw error;
    }
  }

  public async unlikePost(postId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/posts/${postId}/like`);

      if (!response.success) {
        throw new Error(response.error || "Failed to unlike post");
      }

      // Update post like status in cache
      this.updatePostLikeInAllCaches(postId, false);
    } catch (error) {
      console.error("Failed to unlike post:", error);
      throw error;
    }
  }

  // Comment Management
  public async getComments(
    postId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Comment>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Comment>>(
        `/posts/${postId}/comments`,
        { page, limit },
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch comments");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      throw error;
    }
  }

  public async addComment(
    postId: string,
    commentData: CreateCommentData,
  ): Promise<Comment> {
    try {
      const response = await apiClient.post<Comment>(
        `/posts/${postId}/comments`,
        commentData,
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to add comment");
      }

      // Update comment count in cache
      this.updatePostCommentCountInAllCaches(postId, 1);

      return response.data;
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  }

  // User Relationship Management
  public async followUser(userId: string): Promise<UserRelationship> {
    try {
      const response = await apiClient.post<UserRelationship>(
        `/users/${userId}/follow`,
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to follow user");
      }

      // Note: User cache update would require additional API call to get updated user data

      return response.data;
    } catch (error) {
      console.error("Failed to follow user:", error);
      throw error;
    }
  }

  public async unfollowUser(userId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/users/${userId}/follow`);

      if (!response.success) {
        throw new Error(response.error || "Failed to unfollow user");
      }

      // Note: User cache update would require additional API call to get updated user data
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      throw error;
    }
  }

  public async getFollowers(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>(
        `/users/${userId}/followers`,
        { page, limit },
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch followers");
      }

      // Cache users
      response.data.items.forEach((user) => {
        this.userCache.set(user.id, user);
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch followers:", error);
      throw error;
    }
  }

  public async getFollowing(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>(
        `/users/${userId}/following`,
        { page, limit },
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch following");
      }

      // Cache users
      response.data.items.forEach((user) => {
        this.userCache.set(user.id, user);
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch following:", error);
      throw error;
    }
  }

  // Search and Discovery
  public async searchPosts(
    query: string,
    page = 1,
    limit = 10,
    filters: SearchFilters = {},
  ): Promise<PaginatedResponse<Post>> {
    try {
      const searchParams: Record<string, unknown> = {
        q: query,
        page,
        limit,
        ...filters,
      };

      const response = await apiClient.get<PaginatedResponse<Post>>(
        "/posts/search",
        searchParams,
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to search posts");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to search posts:", error);
      throw error;
    }
  }

  public async searchUsers(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>(
        "/users/search",
        {
          q: query,
          page,
          limit,
        },
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to search users");
      }

      // Cache users
      response.data.items.forEach((user) => {
        this.userCache.set(user.id, user);
      });

      return response.data;
    } catch (error) {
      console.error("Failed to search users:", error);
      throw error;
    }
  }

  public async getTrendingPosts(
    period = "24h",
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Post>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Post>>(
        "/posts/trending",
        {
          period,
          page,
          limit,
        },
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch trending posts");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch trending posts:", error);
      throw error;
    }
  }

  public async getPopularUsers(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>(
        "/users/popular",
        {
          page,
          limit,
        },
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch popular users");
      }

      // Cache users
      response.data.items.forEach((user) => {
        this.userCache.set(user.id, user);
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch popular users:", error);
      throw error;
    }
  }

  // Media Upload
  public async uploadImage(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiClient.post<{ url: string }>(
        "/media/image",
        formData,
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to upload image");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }
  }

  public async uploadAudio(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await apiClient.post<{ url: string }>(
        "/media/audio",
        formData,
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to upload audio");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to upload audio:", error);
      throw error;
    }
  }

  // Cache Management
  private updatePostInAllCaches(updatedPost: Post): void {
    this.feedCache.forEach((posts, key) => {
      const index = posts.findIndex((p) => p.id === updatedPost.id);
      if (index !== -1) {
        posts[index] = updatedPost;
        this.feedCache.set(key, [...posts]);
      }
    });
  }

  private removePostFromAllCaches(postId: string): void {
    this.feedCache.forEach((posts, key) => {
      const filteredPosts = posts.filter((p) => p.id !== postId);
      this.feedCache.set(key, filteredPosts);
    });
  }

  private updatePostLikeInAllCaches(postId: string, isLiked: boolean): void {
    this.feedCache.forEach((posts, key) => {
      const index = posts.findIndex((p) => p.id === postId);
      if (index !== -1) {
        const post = posts[index];
        posts[index] = {
          ...post,
          isLiked,
          likesCount: isLiked
            ? post.likesCount + 1
            : Math.max(0, post.likesCount - 1),
        };
        this.feedCache.set(key, [...posts]);
      }
    });
  }

  private updatePostCommentCountInAllCaches(
    postId: string,
    increment: number,
  ): void {
    this.feedCache.forEach((posts, key) => {
      const index = posts.findIndex((p) => p.id === postId);
      if (index !== -1) {
        const post = posts[index];
        posts[index] = {
          ...post,
          commentsCount: Math.max(0, post.commentsCount + increment),
        };
        this.feedCache.set(key, [...posts]);
      }
    });
  }

  // Cache utilities
  public clearCache(): void {
    this.feedCache.clear();
    this.userCache.clear();
  }

  public get isLoadingFeed(): boolean {
    return this.isLoading;
  }

  // Get cached user
  public getCachedUser(userId: string): User | undefined {
    return this.userCache.get(userId);
  }
}

export const socialFeedService = new SocialFeedService();
