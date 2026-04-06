import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const listNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(30);

    const enriched = await Promise.all(
      notifications.map(async (n) => {
        const actor = n.actorId ? await ctx.db.get(n.actorId) : null;
        return {
          ...n,
          actor: actor
            ? { id: actor._id, name: actor.name, avatarUrl: actor.avatarUrl }
            : null,
        };
      })
    );

    return enriched;
  },
});

export const getUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) =>
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .take(100);

    return unread.length;
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { isRead: true });
    return { success: true };
  },
});

export const markAllRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) =>
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .take(100);

    for (const n of unread) {
      await ctx.db.patch(n._id, { isRead: true });
    }

    return { success: true };
  },
});

// Internal — called from other mutations to create a notification
export const createNotification = internalMutation({
  args: {
    userId: v.id("users"),
    actorId: v.optional(v.id("users")),
    type: v.union(
      v.literal("like"),
      v.literal("follow"),
      v.literal("message"),
      v.literal("booking"),
      v.literal("new_post"),
    ),
    entityId: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      actorId: args.actorId,
      type: args.type,
      entityId: args.entityId,
      message: args.message,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});
