"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface FollowButtonProps {
  targetUserId: string; // Changed from Id<"users"> to string
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function FollowButton({
  targetUserId,
  size = "sm",
  className,
}: FollowButtonProps) {
  const { user } = useAuth();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const isFollowing = useQuery(
    api.social.isFollowingByIds,
    user
      ? {
          followerId: user.id as string,
          followingId: targetUserId as string,
        }
      : "skip"
  );

  const followUser = useMutation(api.social.followUserByIds);
  const unfollowUser = useMutation(api.social.unfollowUserByIds);

  if (!user || user.id === targetUserId) return null;

  const following = optimistic !== null ? optimistic : !!isFollowing;

  const handleToggle = async () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    setOptimistic(!following);

    try {
      if (following) {
        await unfollowUser({
          followerId: user.id as string,
          followingId: targetUserId,
        });
      } else {
        await followUser({
          followerId: user.id as string,
          followingId: targetUserId,
        });
      }
    } catch {
      setOptimistic(following); // revert
    } finally {
      setOptimistic(null);
    }
  };

  return (
    <Button
      variant={following ? "outline" : "default"}
      size={size}
      onClick={handleToggle}
      className={cn("gap-1.5 rounded-full", className)}
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
