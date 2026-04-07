import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getSierraLeoneLocations } from "../lib/locations";

export const signUp = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    isProfessional: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await hashPassword(args.password);

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      passwordHash,
      isProfessional: args.isProfessional,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true, userId };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValidPassword = await verifyPassword(args.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isProfessional: user.isProfessional,
        profile: user.profile,
        rating: user.rating,
        reviewCount: user.reviewCount,
      },
    };
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isProfessional: user.isProfessional,
      profile: user.profile,
      rating: user.rating,
      reviewCount: user.reviewCount,
    };
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    profile: v.object({
      bio: v.string(),
      skills: v.array(v.string()),
      location: v.string(),
      phone: v.string(),
      website: v.string(),
      socialLinks: v.record(v.string(), v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      profile: args.profile,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateUserImages = mutation({
  args: {
    userId: v.id("users"),
    avatarStorageId: v.optional(v.id("_storage")),
    coverStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    const result: { avatarUrl?: string; coverImageUrl?: string } = {};

    if (args.avatarStorageId) {
      const url = await ctx.storage.getUrl(args.avatarStorageId);
      if (url) {
        updates.avatarUrl = url;
        result.avatarUrl = url;
      }
    }
    if (args.coverStorageId) {
      const url = await ctx.storage.getUrl(args.coverStorageId);
      if (url) {
        updates.coverImageUrl = url;
        result.coverImageUrl = url;
      }
    }

    await ctx.db.patch(args.userId, updates);
    return result;
  },
});

export const searchUsers = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const { query } = args;
    
    // Search by email or phone number
    const emailResults = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => 
        q.eq("email", query.toLowerCase())
      )
      .take(5);

    // If no email match, fall back to searching the top-level phone field
    if (emailResults.length === 0) {
      const phoneResults = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("phone"), query))
        .take(5);

      return phoneResults.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      }));
    }

    return emailResults.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    }));
  },
});

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
