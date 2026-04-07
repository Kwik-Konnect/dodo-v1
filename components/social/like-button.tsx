"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface ProfileLikeButtonProps {
  professionalId: string;
  variant?: "default" | "ghost" | "compact" | "swipe";
  className?: string;
}

export function ProfileLikeButton({
  professionalId,
  variant = "default",
  className,
}: ProfileLikeButtonProps) {
  const { user } = useAuth();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const isLiked = useQuery(
    api.social.isProfileLiked,
    user ? { userId: user.id as Id<"users">, professionalId } : "skip"
  );

  const likeProfile = useMutation(api.social.likeProfile);
  const unlikeProfile = useMutation(api.social.unlikeProfile);

  const liked = optimistic !== null ? optimistic : !!isLiked;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    setOptimistic(!liked);

    try {
      if (liked) {
        await unlikeProfile({ userId: user.id as Id<"users">, professionalId });
      } else {
        await likeProfile({ userId: user.id as Id<"users">, professionalId });
      }
    } catch {
      setOptimistic(liked); // revert on error
    } finally {
      setOptimistic(null);
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "flex flex-col items-center gap-1 transition-transform active:scale-90",
          className
        )}
        aria-label={liked ? "Unlike" : "Like"}
      >
        <Heart
          className={cn(
            "h-7 w-7 transition-colors",
            liked ? "fill-primary text-primary" : "text-white"
          )}
        />
      </button>
    );
  }

  if (variant === "swipe") {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90 flex items-center justify-center",
          className
        )}
        aria-label={liked ? "Unlike" : "Like"}
      >
        <Heart
          className={cn(
            "h-6 w-6 transition-colors",
            liked ? "fill-white text-white" : "text-white"
          )}
        />
      </button>
    );
  }

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      className={cn(
        "gap-1.5 rounded-full transition-all",
        liked && "bg-primary/90 hover:bg-primary/80",
        className
      )}
    >
      <Heart
        className={cn("h-4 w-4", liked ? "fill-white text-white" : "text-primary")}
      />
      {liked ? "Liked" : "Like"}
    </Button>
  );
}

// ─── Post Like Button ─────────────────────────────────────────────────────────

interface PostLikeButtonProps {
  postId: Id<"posts">;
  likeCount: number;
  isLiked: boolean;
  onToggle: () => void;
}

export function PostLikeButton({
  postId,
  likeCount,
  isLiked,
  onToggle,
}: PostLikeButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          isLiked ? "fill-primary text-primary scale-110" : ""
        )}
      />
      <span>{likeCount}</span>
    </button>
  );
}
