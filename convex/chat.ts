import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create a DM conversation between two users
export const getOrCreateConversation = mutation({
  args: {
    userId: v.id("users"),
    participantId: v.id("users"),
  },
  handler: async (ctx, args) => {
    if (args.userId === args.participantId) {
      throw new Error("Cannot chat with yourself");
    }

    // Scan recent conversations for an existing one
    const all = await ctx.db
      .query("conversations")
      .withIndex("by_last_message")
      .order("desc")
      .take(200);

    const existing = all.find(
      (c) =>
        c.participantIds.includes(args.userId) &&
        c.participantIds.includes(args.participantId)
    );

    if (existing) return { conversationId: existing._id };

    const conversationId = await ctx.db.insert("conversations", {
      participantIds: [args.userId, args.participantId],
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    });

    return { conversationId };
  },
});

// List all conversations for a user (ordered by most recent message)
export const listConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("conversations")
      .withIndex("by_last_message")
      .order("desc")
      .take(50);

    const userConversations = all.filter((c) =>
      c.participantIds.includes(args.userId)
    );

    const enriched = await Promise.all(
      userConversations.map(async (conv) => {
        const otherId = conv.participantIds.find((id) => id !== args.userId);
        const otherUser = otherId ? await ctx.db.get(otherId) : null;

        const recentMsgs = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .order("desc")
          .take(50);

        const unreadCount = recentMsgs.filter(
          (m) => !m.isRead && m.senderId !== args.userId
        ).length;

        return {
          ...conv,
          otherUser: otherUser
            ? {
                id: otherUser._id,
                name: otherUser.name,
                avatarUrl: otherUser.avatarUrl,
              }
            : null,
          unreadCount,
        };
      })
    );

    return enriched;
  },
});

// Send a message in a conversation — real-time delivery via Convex reactivity
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.content.trim()) throw new Error("Message cannot be empty");

    const conv = await ctx.db.get(args.conversationId);
    if (!conv) throw new Error("Conversation not found");
    if (!conv.participantIds.includes(args.senderId)) {
      throw new Error("Not a participant of this conversation");
    }

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      content: args.content.trim(),
      isRead: false,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
      lastMessageText: args.content.slice(0, 100),
    });

    return { messageId };
  },
});

// List messages in a conversation (ascending order for chat display)
export const listMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .take(200);
  },
});

// Mark all unread messages in a conversation as read
export const markMessagesRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .take(200);

    const unread = msgs.filter(
      (m) => !m.isRead && m.senderId !== args.userId
    );

    for (const msg of unread) {
      await ctx.db.patch(msg._id, { isRead: true });
    }

    return { success: true };
  },
});

// Total unread message count across all conversations
export const getTotalUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("conversations").take(200);

    const mine = all.filter((c) => c.participantIds.includes(args.userId));

    let total = 0;
    for (const conv of mine) {
      const msgs = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
        .take(100);
      total += msgs.filter((m) => !m.isRead && m.senderId !== args.userId).length;
    }

    return total;
  },
});
