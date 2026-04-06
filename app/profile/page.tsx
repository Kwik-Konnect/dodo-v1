"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { FeedPost } from "@/components/social/feed-post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import {
  MapPin,
  Link2,
  Settings,
  Grid3X3,
  Heart,
  Users,
  Loader2,
} from "lucide-react";
import Link from "next/link";

function ProfileContent() {
  const { user } = useAuth();

  const followCounts = useQuery(
    api.social.getFollowCounts,
    user ? { userId: user.id as Id<"users"> } : "skip"
  );

  const posts = useQuery(
    api.posts.listUserPosts,
    user ? { userId: user.id as Id<"users">, viewerId: user.id as Id<"users"> } : "skip"
  );

  const likedProfiles = useQuery(
    api.social.getLikedProfiles,
    user ? { userId: user.id as Id<"users"> } : "skip"
  );

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Profile Header Card */}
      <Card className="mb-6 overflow-hidden">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20" />

        <CardContent className="relative pt-0 pb-5 px-5">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-8 mb-4">
            <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
              <AvatarImage src={user.profile?.socialLinks?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {user.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="rounded-full gap-1.5" asChild>
              <Link href="/settings">
                <Settings className="h-3.5 w-3.5" />
                Edit Profile
              </Link>
            </Button>
          </div>

          {/* Name & bio */}
          <div className="space-y-2">
            <div>
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            {user.isProfessional && (
              <Badge variant="secondary" className="text-xs">Professional</Badge>
            )}

            {user.profile?.bio && (
              <p className="text-sm text-foreground/80 leading-relaxed">
                {user.profile.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {user.profile?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {user.profile.location}
                </span>
              )}
              {user.profile?.website && (
                <a
                  href={user.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  {user.profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border">
            <div className="flex flex-col items-center py-3">
              <span className="text-lg font-bold text-foreground">
                {posts?.length ?? 0}
              </span>
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

      {/* Tabs */}
      <Tabs defaultValue="posts">
        <TabsList className="w-full rounded-xl">
          <TabsTrigger value="posts" className="flex-1 gap-1.5">
            <Grid3X3 className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="liked" className="flex-1 gap-1.5">
            <Heart className="h-4 w-4" />
            Liked
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
              <Button variant="outline" size="sm" className="mt-3 rounded-full" asChild>
                <Link href="/feeds">Create your first post</Link>
              </Button>
            </div>
          ) : (
            posts.map((post) => (
              <FeedPost key={post._id} post={{ ...post, author: { id: user.id as Id<"users">, name: user.name } } as any} />
            ))
          )}
        </TabsContent>

        <TabsContent value="liked" className="mt-4">
          {!likedProfiles ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : likedProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No liked profiles yet</p>
              <Button variant="outline" size="sm" className="mt-3 rounded-full" asChild>
                <Link href="/browse">Browse profiles</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {likedProfiles.map((id) => (
                <Link
                  key={id}
                  href={`/professional/${id}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted hover:opacity-90 transition-opacity"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="h-8 w-8 fill-primary text-primary opacity-30" />
                  </div>
                  <span className="absolute bottom-2 left-2 right-2 truncate text-xs font-medium text-white drop-shadow">
                    Profile {id.slice(-4)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
