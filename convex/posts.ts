import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const createPost = mutation({
  args: {
    authorId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.content.trim()) {
      throw new Error("Post content cannot be empty");
    }

    const author = await ctx.db.get(args.authorId);
    if (!author) throw new Error("Author not found");

    const postId = await ctx.db.insert("posts", {
      authorId: args.authorId,
      content: args.content.trim(),
      likeCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Notify all followers
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.authorId))
      .take(200);

    for (const follow of followers) {
      await ctx.runMutation(internal.notifications.createNotification, {
        userId: follow.followerId,
        actorId: args.authorId,
        type: "new_post",
        entityId: postId,
        message: `${author.name} posted something new`,
      });
    }

    return { postId };
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== args.userId) throw new Error("Not authorized");

    await ctx.db.delete(args.postId);

    // Remove all associated likes
    const likes = await ctx.db
      .query("postLikes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .take(200);

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    return { success: true };
  },
});

export const listFeed = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .take(50);

    const enriched = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);

        let isLiked = false;
        if (args.userId) {
          const like = await ctx.db
            .query("postLikes")
            .withIndex("by_user_and_post", (q) =>
              q.eq("userId", args.userId!).eq("postId", post._id)
            )
            .unique();
          isLiked = !!like;
        }

        return {
          ...post,
          author: author
            ? { id: author._id, name: author.name, avatarUrl: author.avatarUrl }
            : null,
          isLiked,
        };
      })
    );

    return enriched;
  },
});

export const listUserPosts = query({
  args: { userId: v.id("users"), viewerId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.userId))
      .order("desc")
      .take(30);

    const enriched = await Promise.all(
      posts.map(async (post) => {
        let isLiked = false;
        if (args.viewerId) {
          const like = await ctx.db
            .query("postLikes")
            .withIndex("by_user_and_post", (q) =>
              q.eq("userId", args.viewerId!).eq("postId", post._id)
            )
            .unique();
          isLiked = !!like;
        }
        return { ...post, isLiked };
      })
    );

    return enriched;
  },
});

export const likePost = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("postLikes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", args.userId).eq("postId", args.postId)
      )
      .unique();

    if (existing) return { alreadyLiked: true };

    await ctx.db.insert("postLikes", {
      userId: args.userId,
      postId: args.postId,
      createdAt: Date.now(),
    });

    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, { likeCount: post.likeCount + 1 });
    }

    return { success: true };
  },
});

export const unlikePost = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("postLikes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", args.userId).eq("postId", args.postId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);

      const post = await ctx.db.get(args.postId);
      if (post && post.likeCount > 0) {
        await ctx.db.patch(args.postId, { likeCount: post.likeCount - 1 });
      }
    }

    return { success: true };
  },
});
