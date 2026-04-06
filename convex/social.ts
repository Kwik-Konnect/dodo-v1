import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Follows ──────────────────────────────────────────────────────────────────

export const followUser = mutation({
  args: {
    followerId: v.id("users"),
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    if (args.followerId === args.followingId) {
      throw new Error("Cannot follow yourself");
    }

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_and_following", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .unique();

    if (existing) return { alreadyFollowing: true };

    await ctx.db.insert("follows", {
      followerId: args.followerId,
      followingId: args.followingId,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

export const unfollowUser = mutation({
  args: {
    followerId: v.id("users"),
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_and_following", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    return { success: true };
  },
});

export const isFollowing = query({
  args: {
    followerId: v.id("users"),
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_follower_and_following", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .unique();

    return !!follow;
  },
});

export const getFollowCounts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .take(500);

    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .take(500);

    return { followers: followers.length, following: following.length };
  },
});

export const getFollowers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .take(50);

    const users = await Promise.all(
      follows.map(async (f) => {
        const user = await ctx.db.get(f.followerId);
        return user
          ? { id: user._id, name: user.name, avatarUrl: user.avatarUrl }
          : null;
      })
    );

    return users.filter(Boolean);
  },
});

export const getFollowing = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .take(50);

    const users = await Promise.all(
      follows.map(async (f) => {
        const user = await ctx.db.get(f.followingId);
        return user
          ? { id: user._id, name: user.name, avatarUrl: user.avatarUrl }
          : null;
      })
    );

    return users.filter(Boolean);
  },
});

// ─── Profile Likes ────────────────────────────────────────────────────────────

export const likeProfile = mutation({
  args: {
    userId: v.id("users"),
    professionalId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profileLikes")
      .withIndex("by_user_and_professional", (q) =>
        q.eq("userId", args.userId).eq("professionalId", args.professionalId)
      )
      .unique();

    if (existing) return { alreadyLiked: true };

    await ctx.db.insert("profileLikes", {
      userId: args.userId,
      professionalId: args.professionalId,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

export const unlikeProfile = mutation({
  args: {
    userId: v.id("users"),
    professionalId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profileLikes")
      .withIndex("by_user_and_professional", (q) =>
        q.eq("userId", args.userId).eq("professionalId", args.professionalId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    return { success: true };
  },
});

export const isProfileLiked = query({
  args: {
    userId: v.id("users"),
    professionalId: v.string(),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("profileLikes")
      .withIndex("by_user_and_professional", (q) =>
        q.eq("userId", args.userId).eq("professionalId", args.professionalId)
      )
      .unique();

    return !!like;
  },
});

export const getLikedProfiles = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("profileLikes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .take(200);

    return likes.map((l) => l.professionalId);
  },
});

export const getProfileLikeCount = query({
  args: { professionalId: v.string() },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("profileLikes")
      .withIndex("by_professional", (q) => q.eq("professionalId", args.professionalId))
      .take(500);

    return likes.length;
  },
});
