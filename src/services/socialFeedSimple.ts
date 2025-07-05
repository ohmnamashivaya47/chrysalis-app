import { apiClient } from "./api";
import type { Post, Comment, Like, User, LoadingState } from "../types";

interface SimplePaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class SocialFeedService {
  private static instance: SocialFeedService;
  private feedCache: Map<string, Post[]> = new Map();
  private userCache: Map<string, User> = new Map();
  private lastFetchTime: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): SocialFeedService {
    if (!SocialFeedService.instance) {
      SocialFeedService.instance = new SocialFeedService();
    }
    return SocialFeedService.instance;
  }

  // Basic Feed Management
  public async getFeed(
    page: number = 1,
    limit: number = 20,
    refresh: boolean = false,
  ): Promise<SimplePaginatedResponse<Post>> {
    const cacheKey = `feed_${page}_${limit}`;
    const now = Date.now();
    const lastFetch = this.lastFetchTime.get(cacheKey) || 0;

    // Return cached data if still fresh and not forcing refresh
    if (
      !refresh &&
      now - lastFetch < this.CACHE_DURATION &&
      this.feedCache.has(cacheKey)
    ) {
      const cachedPosts = this.feedCache.get(cacheKey)!;
      return {
        items: cachedPosts,
        total: cachedPosts.length,
        page,
        limit,
        hasNext: false,
        hasPrev: page > 1,
      };
    }

    try {
      const response = await apiClient.get<SimplePaginatedResponse<Post>>(
        `/posts/feed?page=${page}&limit=${limit}`,
      );

      if (response.data) {
        // Cache the response
        this.feedCache.set(cacheKey, response.data.items);
        this.lastFetchTime.set(cacheKey, now);

        // Cache users
        response.data.items.forEach((post) => {
          if (post.user) {
            this.userCache.set(post.user.id, post.user);
          }
        });

        return response.data;
      } else {
        // Return empty result
        return {
          items: [],
          total: 0,
          page,
          limit,
          hasNext: false,
          hasPrev: false,
        };
      }
    } catch (error) {
      console.error("Failed to fetch feed:", error);

      // Return cached data as fallback
      if (this.feedCache.has(cacheKey)) {
        const cachedPosts = this.feedCache.get(cacheKey)!;
        return {
          items: cachedPosts,
          total: cachedPosts.length,
          page,
          limit,
          hasNext: false,
          hasPrev: page > 1,
        };
      }

      // Return empty result
      return {
        items: [],
        total: 0,
        page,
        limit,
        hasNext: false,
        hasPrev: false,
      };
    }
  }

  // Post Management
  public async createPost(postData: {
    content?: string;
    imageUrl?: string;
    audioUrl?: string;
    isGuidedMeditation: boolean;
    isPublic: boolean;
  }): Promise<Post | null> {
    try {
      const response = await apiClient.post<Post>("/posts", postData);

      // Clear relevant caches
      this.clearFeedCache();

      return response.data || null;
    } catch (error) {
      console.error("Failed to create post:", error);
      return null;
    }
  }

  public async updatePost(
    postId: string,
    updates: {
      content?: string;
      isPublic?: boolean;
    },
  ): Promise<Post | null> {
    try {
      const response = await apiClient.put<Post>(`/posts/${postId}`, updates);

      if (response.data) {
        // Update post in cache
        this.updatePostInCache(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to update post:", error);
      return null;
    }
  }

  public async deletePost(postId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/posts/${postId}`);

      // Remove post from cache
      this.removePostFromCache(postId);
      return true;
    } catch (error) {
      console.error("Failed to delete post:", error);
      return false;
    }
  }

  // Interaction Management
  public async likePost(postId: string): Promise<boolean> {
    try {
      await apiClient.post<Like>(`/posts/${postId}/like`);

      // Update post like status in cache
      this.updatePostLikeInCache(postId, true);
      return true;
    } catch (error) {
      console.error("Failed to like post:", error);
      return false;
    }
  }

  public async unlikePost(postId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/posts/${postId}/like`);

      // Update post like status in cache
      this.updatePostLikeInCache(postId, false);
      return true;
    } catch (error) {
      console.error("Failed to unlike post:", error);
      return false;
    }
  }

  public async addComment(
    postId: string,
    content: string,
  ): Promise<Comment | null> {
    try {
      const response = await apiClient.post<Comment>(
        `/posts/${postId}/comments`,
        {
          content,
        },
      );

      // Update post comment count in cache
      this.updatePostCommentCountInCache(postId, 1);

      return response.data || null;
    } catch (error) {
      console.error("Failed to add comment:", error);
      return null;
    }
  }

  public async deleteComment(
    commentId: string,
    postId: string,
  ): Promise<boolean> {
    try {
      await apiClient.delete(`/comments/${commentId}`);

      // Update post comment count in cache
      this.updatePostCommentCountInCache(postId, -1);
      return true;
    } catch (error) {
      console.error("Failed to delete comment:", error);
      return false;
    }
  }

  // User Relationships
  public async followUser(userId: string): Promise<boolean> {
    try {
      await apiClient.post(`/users/${userId}/follow`);
      return true;
    } catch (error) {
      console.error("Failed to follow user:", error);
      return false;
    }
  }

  public async unfollowUser(userId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/users/${userId}/follow`);
      return true;
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      return false;
    }
  }

  // Search
  public async searchPosts(
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<SimplePaginatedResponse<Post>> {
    try {
      const response = await apiClient.get<SimplePaginatedResponse<Post>>(
        `/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );

      if (response.data) {
        return response.data;
      } else {
        return {
          items: [],
          total: 0,
          page,
          limit,
          hasNext: false,
          hasPrev: false,
        };
      }
    } catch (error) {
      console.error("Failed to search posts:", error);
      return {
        items: [],
        total: 0,
        page,
        limit,
        hasNext: false,
        hasPrev: false,
      };
    }
  }

  public async searchUsers(
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<SimplePaginatedResponse<User>> {
    try {
      const response = await apiClient.get<SimplePaginatedResponse<User>>(
        `/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );

      if (response.data) {
        return response.data;
      } else {
        return {
          items: [],
          total: 0,
          page,
          limit,
          hasNext: false,
          hasPrev: false,
        };
      }
    } catch (error) {
      console.error("Failed to search users:", error);
      return {
        items: [],
        total: 0,
        page,
        limit,
        hasNext: false,
        hasPrev: false,
      };
    }
  }

  // Media Upload
  public async uploadImage(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiClient.post<{ url: string }>(
        "/media/image",
        formData,
      );

      return response.data?.url || null;
    } catch (error) {
      console.error("Failed to upload image:", error);
      return null;
    }
  }

  public async uploadAudio(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await apiClient.post<{ url: string }>(
        "/media/audio",
        formData,
      );

      return response.data?.url || null;
    } catch (error) {
      console.error("Failed to upload audio:", error);
      return null;
    }
  }

  // Cache Management
  private clearFeedCache(): void {
    this.feedCache.clear();
    this.lastFetchTime.clear();
  }

  private updatePostInCache(updatedPost: Post): void {
    this.feedCache.forEach((posts) => {
      const index = posts.findIndex((post) => post.id === updatedPost.id);
      if (index !== -1) {
        posts[index] = updatedPost;
      }
    });
  }

  private removePostFromCache(postId: string): void {
    this.feedCache.forEach((posts) => {
      const index = posts.findIndex((post) => post.id === postId);
      if (index !== -1) {
        posts.splice(index, 1);
      }
    });
  }

  private updatePostLikeInCache(postId: string, isLiked: boolean): void {
    this.feedCache.forEach((posts) => {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        post.isLiked = isLiked;
        post.likesCount += isLiked ? 1 : -1;
      }
    });
  }

  private updatePostCommentCountInCache(postId: string, delta: number): void {
    this.feedCache.forEach((posts) => {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        post.commentsCount += delta;
      }
    });
  }

  // User Cache
  public getCachedUser(userId: string): User | null {
    return this.userCache.get(userId) || null;
  }

  public cacheUser(user: User): void {
    this.userCache.set(user.id, user);
  }

  // Utility methods
  public async refreshFeed(): Promise<void> {
    this.clearFeedCache();
    await this.getFeed(1, 20, true);
  }

  public getLoadingState(): LoadingState {
    return "idle";
  }

  // Real-time updates placeholder (would be connected to Socket.io)
  public onPostUpdate(callback: (post: Post) => void): () => void {
    // Store callback for post updates (could use EventEmitter pattern)
    // For now, return a simple unsubscribe function
    console.log("Post update listener registered:", callback);
    return () => {
      console.log("Post update listener unregistered");
    };
  }

  public onPostDelete(callback: (postId: string) => void): () => void {
    // Store callback for post deletions
    console.log("Post delete listener registered:", callback);
    return () => {
      console.log("Post delete listener unregistered");
    };
  }

  public onNewComment(callback: (comment: Comment) => void): () => void {
    // Store callback for new comments
    console.log("New comment listener registered:", callback);
    return () => {
      console.log("New comment listener unregistered");
    };
  }
}

export const socialFeedService = SocialFeedService.getInstance();
