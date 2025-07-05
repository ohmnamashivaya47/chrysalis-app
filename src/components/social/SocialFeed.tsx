import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { socialFeedService } from "../../services/socialFeed";
import type { Post, User } from "../../types";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

interface SocialFeedProps {
  className?: string;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ className }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialFeedService.getFeed("page=1&limit=10");
      if (response.success && response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Failed to load feed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleLike = async (postId: string) => {
    try {
      await socialFeedService.likePost(postId);
      // Update local state optimistically
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likesCount: post.isLiked
                  ? post.likesCount - 1
                  : post.likesCount + 1,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <PostHeader
            user={post.user}
            createdAt={post.createdAt.toISOString()}
          />
          <PostContent post={post} />
          <PostActions post={post} onLike={() => handleLike(post.id)} />
        </motion.div>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MessageCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500">
            Follow some friends to see their meditation journey!
          </p>
        </div>
      )}
    </div>
  );
};

interface PostHeaderProps {
  user?: User;
  createdAt: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ user, createdAt }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <img
          src={
            user.avatarUrl ||
            `https://ui-avatars.com/api/?name=${user.username || "U"}&background=22c55e&color=fff`
          }
          alt={user.username || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium text-gray-900">
            {user.username || "Anonymous"}
          </h4>
          <p className="text-sm text-gray-500">{formatTimeAgo(createdAt)}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-gray-600"
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
  );
};

interface PostContentProps {
  post: Post;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  return (
    <div className="mb-4">
      <p className="text-gray-800 leading-relaxed">{post.content}</p>

      {post.isGuidedMeditation && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center space-x-2 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">
              Guided meditation session completed
            </span>
          </div>
        </div>
      )}

      {post.imageUrl && (
        <div className="mt-3">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="w-full rounded-lg object-cover max-h-96"
          />
        </div>
      )}
    </div>
  );
};

interface PostActionsProps {
  post: Post;
  onLike: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({ post, onLike }) => {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLike}
          className={cn(
            "flex items-center space-x-2",
            post.isLiked ? "text-red-500" : "text-gray-500",
          )}
        >
          <Heart className={cn("w-4 h-4", post.isLiked && "fill-current")} />
          <span>{post.likesCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-500"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.commentsCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-500"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  );
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
}
