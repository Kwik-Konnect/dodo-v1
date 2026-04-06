"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostComposer } from "@/components/social/post-composer";
import { FeedPost } from "@/components/social/feed-post";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { Id } from "@/convex/_generated/dataModel";
import { Rss, Loader2 } from "lucide-react";

function FeedContent() {
  const { user } = useAuth();

  const posts = useQuery(api.posts.listFeed, {
    userId: user?.id as Id<"users"> | undefined,
  });

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      {/* Page title */}
      <div className="mb-5 flex items-center gap-2">
        <Rss className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Feed</h1>
      </div>

      {/* Post composer */}
      {user && (
        <div className="mb-5">
          <PostComposer />
        </div>
      )}

      {/* Posts */}
      {!posts ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-5">
            <Rss className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Nothing here yet
          </h3>
          <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
            Be the first to post something, or follow people to see their updates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <FeedPost
              key={post._id}
              post={post as any}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FeedsPage() {
  return (
    <ProtectedRoute>
      <FeedContent />
    </ProtectedRoute>
  );
}
