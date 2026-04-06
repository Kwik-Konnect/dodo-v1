import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Shared shape returned by list & detail queries ───────────────────────────
// Matches the existing Professional type in lib/types.ts so components work unchanged.

export const listProfessionals = query({
  args: {
    category: v.optional(v.string()),
    location: v.optional(v.string()),
    ethnicity: v.optional(v.string()),
    minRating: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let pros;

    if (args.searchQuery && args.searchQuery.trim()) {
      pros = await ctx.db
        .query("users")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.searchQuery!).eq("isProfessional", true)
        )
        .take(60);
    } else if (args.category) {
      pros = await ctx.db
        .query("users")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .take(60);
      pros = pros.filter((p) => p.isProfessional);
    } else {
      pros = await ctx.db
        .query("users")
        .withIndex("by_isProfessional", (q) => q.eq("isProfessional", true))
        .take(60);
    }

    // In-memory filters
    if (args.location) {
      const loc = args.location.toLowerCase();
      pros = pros.filter((p) => p.location?.toLowerCase().includes(loc));
    }
    if (args.ethnicity) {
      const eth = args.ethnicity.toLowerCase();
      pros = pros.filter((p) => p.ethnicity?.toLowerCase().includes(eth));
    }
    if (args.minRating !== undefined) {
      pros = pros.filter((p) => (p.rating ?? 0) >= args.minRating!);
    }
    if (args.maxPrice !== undefined) {
      pros = pros.filter(
        (p) => p.startingPrice === undefined || p.startingPrice <= args.maxPrice!
      );
    }

    return pros.map((p) => ({
      id: p._id as string,
      name: p.name,
      title: p.title ?? "",
      avatar: p.avatarUrl ?? "",
      coverImage: p.coverImageUrl ?? "",
      bio: p.bio ?? "",
      category: (p.category ?? "companions") as any,
      skills: p.skills ?? [],
      location: p.location ?? "",
      ethnicity: p.ethnicity ?? "",
      rating: p.rating ?? 0,
      reviewCount: p.reviewCount ?? 0,
      yearsExperience: p.yearsExperience ?? 0,
      availability: p.availability ?? "",
      languages: p.languages ?? [],
      verified: p.verified ?? false,
      age: p.age ?? 0,
      bodyType: p.bodyType ?? "",
      interests: p.interests ?? [],
      isOnline: p.isOnline ?? false,
      isLive: p.isLive ?? false,
      startingPrice: p.startingPrice ?? 0,
      // Services array is needed for ProfessionalCard price display — kept minimal here
      services: p.startingPrice
        ? [{ id: "price", name: "", description: "", price: p.startingPrice, duration: "" }]
        : [],
      portfolio: [] as any[],
      reviews: [] as any[],
    }));
  },
});

export const getFeaturedProfessionals = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 12;
    const pros = await ctx.db
      .query("users")
      .withIndex("by_isProfessional", (q) => q.eq("isProfessional", true))
      .take(60);

    return pros
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, limit)
      .map((p) => ({
        id: p._id as string,
        name: p.name,
        title: p.title ?? "",
        avatar: p.avatarUrl ?? "",
        coverImage: p.coverImageUrl ?? "",
        bio: p.bio ?? "",
        category: (p.category ?? "companions") as any,
        skills: p.skills ?? [],
        location: p.location ?? "",
        ethnicity: p.ethnicity ?? "",
        rating: p.rating ?? 0,
        reviewCount: p.reviewCount ?? 0,
        yearsExperience: p.yearsExperience ?? 0,
        availability: p.availability ?? "",
        languages: p.languages ?? [],
        verified: p.verified ?? false,
        age: p.age ?? 0,
        bodyType: p.bodyType ?? "",
        interests: p.interests ?? [],
        isOnline: p.isOnline ?? false,
        isLive: p.isLive ?? false,
        startingPrice: p.startingPrice ?? 0,
        services: p.startingPrice
          ? [{ id: "price", name: "", description: "", price: p.startingPrice, duration: "" }]
          : [],
        portfolio: [] as any[],
        reviews: [] as any[],
      }));
  },
});

// Full profile — fetches services, portfolio, and reviews from their tables
export const getProfessionalProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.isProfessional) return null;

    const [services, portfolioItems, reviewItems] = await Promise.all([
      ctx.db
        .query("professionalServices")
        .withIndex("by_provider", (q) => q.eq("providerId", args.userId))
        .take(20),
      ctx.db
        .query("portfolio")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .take(20),
      ctx.db
        .query("professionalReviews")
        .withIndex("by_provider", (q) => q.eq("providerId", args.userId))
        .take(20),
    ]);

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
      services: services.map((s) => ({
        id: s._id as string,
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      })),
      portfolio: portfolioItems.map((p) => ({
        id: p._id as string,
        imageUrl: p.imageUrl,
        title: p.title,
        description: p.description,
      })),
      reviews: reviewItems.map((r) => ({
        id: r._id as string,
        userId: "",
        userName: r.reviewerName,
        userAvatar: r.reviewerAvatar ?? "",
        rating: r.rating,
        comment: r.comment,
        date: r.reviewedAt,
      })),
    };
  },
});

// Update online/live status
export const updatePresence = mutation({
  args: {
    userId: v.id("users"),
    isOnline: v.boolean(),
    isLive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      isOnline: args.isOnline,
      ...(args.isLive !== undefined && { isLive: args.isLive }),
      updatedAt: Date.now(),
    });
  },
});
