"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/contexts/auth-context";

interface FeedPostProps {
  post: {
    _id: Id<"posts">;
    content: string;
    likeCount: number;
    createdAt: number;
    isLiked: boolean;
    author: {
      id: Id<"users">;
      name: string;
      avatarUrl?: string;
    } | null;
  };
  onDelete?: () => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(timestamp).toLocaleDateString();
}

export function FeedPost({ post, onDelete }: FeedPostProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const likePost = useMutation(api.posts.likePost);
  const unlikePost = useMutation(api.posts.unlikePost);
  const deletePost = useMutation(api.posts.deletePost);

  const handleLike = async () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const prev = isLiked;
    setIsLiked(!isLiked);
    setLikeCount((c) => (isLiked ? c - 1 : c + 1));

    try {
      if (isLiked) {
        await unlikePost({ userId: user.id as Id<"users">, postId: post._id });
      } else {
        await likePost({ userId: user.id as Id<"users">, postId: post._id });
      }
    } catch {
      setIsLiked(prev);
      setLikeCount(post.likeCount);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deletePost({ postId: post._id, userId: user.id as Id<"users"> });
      onDelete?.();
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const isOwn = user?.id === post.author?.id;

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={post.author ? `/profile/${post.author.id}` : "#"}>
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={post.author?.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {post.author?.name?.[0]?.toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link
              href={post.author ? `/profile/${post.author.id}` : "#"}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              {post.author?.name ?? "Unknown"}
            </Link>
            <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
          </div>
        </div>

        {isOwn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <p className="mt-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 text-sm transition-colors",
            isLiked
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-transform active:scale-125",
              isLiked && "fill-primary"
            )}
          />
          <span>{likeCount}</span>
        </button>

        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="h-4 w-4" />
          <span>Reply</span>
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ text: post.content });
            }
          }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
