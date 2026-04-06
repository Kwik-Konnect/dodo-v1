"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FeedPost } from "@/components/social/feed-post";
import { FollowButton } from "@/components/social/follow-button";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/contexts/auth-context";
import { MapPin, Link2, MessageCircle, Grid3X3, Loader2 } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const profileUser = useQuery(api.auth.getUserById, {
    userId: id as Id<"users">,
  });

  const followCounts = useQuery(api.social.getFollowCounts, {
    userId: id as Id<"users">,
  });

  const posts = useQuery(api.posts.listUserPosts, {
    userId: id as Id<"users">,
    viewerId: currentUser?.id as Id<"users"> | undefined,
  });

  const getOrCreate = useMutation(api.chat.getOrCreateConversation);

  const handleMessage = async () => {
    if (!currentUser) {
      router.push("/auth");
      return;
    }
    try {
      const { conversationId } = await getOrCreate({
        userId: currentUser.id as Id<"users">,
        participantId: id as Id<"users">,
      });
      router.push(`/messages/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profileUser) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === id;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Card className="mb-6 overflow-hidden">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20" />

        <CardContent className="relative pt-0 pb-5 px-5">
          <div className="flex items-end justify-between -mt-8 mb-4">
            <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {profileUser.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2">
              {!isOwnProfile && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-1.5"
                    onClick={handleMessage}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Message
                  </Button>
                  <FollowButton targetUserId={id as Id<"users">} />
                </>
              )}
              {isOwnProfile && (
                <Button variant="outline" size="sm" className="rounded-full" asChild>
                  <Link href="/settings">Edit Profile</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <h1 className="text-xl font-bold text-foreground">{profileUser.name}</h1>
              {profileUser.isProfessional && (
                <Badge variant="secondary" className="mt-1 text-xs">Professional</Badge>
              )}
            </div>

            {profileUser.profile?.bio && (
              <p className="text-sm text-foreground/80 leading-relaxed">
                {profileUser.profile.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {profileUser.profile?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profileUser.profile.location}
                </span>
              )}
              {profileUser.profile?.website && (
                <a
                  href={profileUser.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  {profileUser.profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border">
            <div className="flex flex-col items-center py-3">
              <span className="text-lg font-bold text-foreground">{posts?.length ?? 0}</span>
              <span className="text-xs text-muted-foreground">Posts</span>
            </div>
            <div className="flex flex-col items-center py-3">
              <span className="text-lg font-bold text-foreground">
                {followCounts?.followers ?? 0}
              </span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            <div className="flex flex-col items-center py-3">
              <span className="text-lg font-bold text-foreground">
                {followCounts?.following ?? 0}
              </span>
              <span className="text-xs text-muted-foreground">Following</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <Tabs defaultValue="posts">
        <TabsList className="w-full rounded-xl">
          <TabsTrigger value="posts" className="flex-1 gap-1.5">
            <Grid3X3 className="h-4 w-4" />
            Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4 space-y-4">
          {!posts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Grid3X3 className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No posts yet</p>
            </div>
          ) : (
            posts.map((post) => (
              <FeedPost
                key={post._id}
                post={{
                  ...post,
                  author: { id: id as Id<"users">, name: profileUser.name },
                } as any}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
