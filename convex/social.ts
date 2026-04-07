import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

// Alternative mutations that accept string IDs
export const followUserByIds = mutation({
  args: {
    followerId: v.string(),
    followingId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const followerId = args.followerId as any; // Let Convex handle ID conversion
      const followingId = args.followingId as any; // Let Convex handle ID conversion
      
      if (followerId === followingId) {
        throw new Error("Cannot follow yourself");
      }

      const existing = await ctx.db
        .query("follows")
        .withIndex("by_follower_and_following", (q) =>
          q.eq("followerId", followerId).eq("followingId", followingId)
        )
        .unique();

      if (existing) return { alreadyFollowing: true };

      await ctx.db.insert("follows", {
        followerId,
        followingId,
        createdAt: Date.now(),
      });

      return { success: true };
    } catch (error) {
      console.error('Invalid ID format:', error);
      throw error;
    }
  },
});

export const unfollowUserByIds = mutation({
  args: {
    followerId: v.string(),
    followingId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const followerId = args.followerId as any; // Let Convex handle ID conversion
      const followingId = args.followingId as any; // Let Convex handle ID conversion
      
      const existing = await ctx.db
        .query("follows")
        .withIndex("by_follower_and_following", (q) =>
          q.eq("followerId", followerId).eq("followingId", followingId)
        )
        .unique();

      if (existing) {
        await ctx.db.delete(existing._id);
      }

      return { success: true };
    } catch (error) {
      console.error('Invalid ID format:', error);
      throw error;
    }
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

// Alternative query that accepts string IDs for URL params
export const isFollowingByIds = query({
  args: {
    followerId: v.string(),
    followingId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const followerId = args.followerId as any; // Let Convex handle ID conversion
      const followingId = args.followingId as any; // Let Convex handle ID conversion
      
      const follow = await ctx.db
        .query("follows")
        .withIndex("by_follower_and_following", (q) =>
          q.eq("followerId", followerId).eq("followingId", followingId)
        )
        .unique();

      return !!follow;
    } catch (error) {
      console.error('Invalid ID format:', error);
      return false;
    }
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

export const getLikedProfessionalsData = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("profileLikes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .take(200);

    const results = await Promise.all(
      likes.map(async (like) => {
        // Numeric IDs belong to static JSON — handled client-side
        if (/^\d+$/.test(like.professionalId)) return null;

        const user = await ctx.db.get(
          like.professionalId as unknown as Id<"users">
        );
        if (!user || !user.isProfessional) return null;

        return {
          id: user._id as string,
          name: user.name,
          title: user.title ?? "",
          avatar: user.avatarUrl ?? "",
          coverImage: user.coverImageUrl ?? "",
          bio: user.bio ?? "",
          category: (user.category ?? "companions") as any,
          skills: user.skills ?? [],
          location: user.location ?? "",
          ethnicity: user.ethnicity ?? "",
          rating: user.rating ?? 0,
          reviewCount: user.reviewCount ?? 0,
          yearsExperience: user.yearsExperience ?? 0,
          availability: user.availability ?? "",
          languages: user.languages ?? [],
          verified: user.verified ?? false,
          age: user.age ?? 0,
          bodyType: user.bodyType ?? "",
          interests: user.interests ?? [],
          isOnline: user.isOnline ?? false,
          isLive: user.isLive ?? false,
          startingPrice: user.startingPrice ?? 0,
          services: user.startingPrice
            ? [{ id: "price", name: "", description: "", price: user.startingPrice, duration: "" }]
            : [],
          portfolio: [] as any[],
          reviews: [] as any[],
        };
      })
    );

    return results.filter((r) => r !== null);
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
