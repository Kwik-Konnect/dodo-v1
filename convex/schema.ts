import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── Core: users ──────────────────────────────────────────────────────────────
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    isProfessional: v.boolean(),

    // Media (Cloudinary URLs or local paths)
    avatarUrl: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),

    // Flat profile fields (top-level for querying)
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),

    // Professional-specific fields
    category: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    ethnicity: v.optional(v.string()),
    yearsExperience: v.optional(v.number()),
    availability: v.optional(v.string()),
    languages: v.optional(v.array(v.string())),
    verified: v.optional(v.boolean()),
    age: v.optional(v.number()),
    bodyType: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    isOnline: v.optional(v.boolean()),
    isLive: v.optional(v.boolean()),
    startingPrice: v.optional(v.number()),

    // Legacy nested profile (kept for backwards compat)
    profile: v.optional(v.object({
      bio: v.string(),
      skills: v.array(v.string()),
      location: v.string(),
      phone: v.string(),
      website: v.string(),
      socialLinks: v.record(v.string(), v.string()),
    })),

    // Bookings linkage (legacy)
    services: v.optional(v.array(v.id("services"))),

    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_isProfessional", ["isProfessional"])
    .index("by_category", ["category"])
    .index("by_isOnline", ["isOnline"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["isProfessional", "category"],
    }),

  // ─── Legacy booking services ──────────────────────────────────────────────────
  services: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    price: v.number(),
    priceType: v.union(v.literal("hourly"), v.literal("fixed"), v.literal("negotiable")),
    providerId: v.id("users"),
    images: v.array(v.id("_storage")),
    availability: v.array(v.string()),
    location: v.string(),
    tags: v.array(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_provider", ["providerId"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // ─── Professional services (from profile / seeded) ────────────────────────────
  professionalServices: defineTable({
    providerId: v.id("users"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    duration: v.string(),
    createdAt: v.number(),
  })
    .index("by_provider", ["providerId"]),

  // ─── Portfolio items ──────────────────────────────────────────────────────────
  portfolio: defineTable({
    userId: v.id("users"),
    imageUrl: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // ─── Professional reviews (seeded / public) ───────────────────────────────────
  professionalReviews: defineTable({
    providerId: v.id("users"),
    reviewerName: v.string(),
    reviewerAvatar: v.optional(v.string()),
    rating: v.number(),
    comment: v.string(),
    reviewedAt: v.string(),
    createdAt: v.number(),
  })
    .index("by_provider", ["providerId"]),

  // ─── Booking reviews ──────────────────────────────────────────────────────────
  reviews: defineTable({
    serviceId: v.id("services"),
    clientId: v.id("users"),
    providerId: v.id("users"),
    rating: v.number(),
    comment: v.string(),
    isVerified: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_service", ["serviceId"])
    .index("by_provider", ["providerId"])
    .index("by_client", ["clientId"]),

  // ─── Bookings ─────────────────────────────────────────────────────────────────
  bookings: defineTable({
    serviceId: v.id("services"),
    clientId: v.id("users"),
    providerId: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("completed"), v.literal("cancelled")),
    scheduledDate: v.number(),
    duration: v.number(),
    totalAmount: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_provider", ["providerId"])
    .index("by_service", ["serviceId"])
    .index("by_status", ["status"]),

  // ─── Social: follows ─────────────────────────────────────────────────────────
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_and_following", ["followerId", "followingId"]),

  // ─── Social: profile likes ────────────────────────────────────────────────────
  profileLikes: defineTable({
    userId: v.id("users"),
    professionalId: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_professional", ["professionalId"])
    .index("by_user_and_professional", ["userId", "professionalId"]),

  // ─── Social: feed posts ───────────────────────────────────────────────────────
  posts: defineTable({
    authorId: v.id("users"),
    content: v.string(),
    mediaUrl: v.optional(v.string()),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
    likeCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_created", ["createdAt"]),

  // ─── Social: post likes ───────────────────────────────────────────────────────
  postLikes: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),

  // ─── Chat: conversations ──────────────────────────────────────────────────────
  conversations: defineTable({
    participantIds: v.array(v.id("users")),
    lastMessageAt: v.number(),
    lastMessageText: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_last_message", ["lastMessageAt"]),

  // ─── Chat: messages ────────────────────────────────────────────────────────────
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_sender", ["senderId"]),

  // ─── Notifications ────────────────────────────────────────────────────────────
  notifications: defineTable({
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
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "isRead"]),
});
