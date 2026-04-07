"use client";

import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { FeedPost } from "@/components/social/feed-post";
import { FollowButton } from "@/components/social/follow-button";
import { ProfessionalCard } from "@/components/professional-card";
import professionalsData from "@/data/professionals.json";
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
  UserPlus,
  Loader2,
  Camera,
} from "lucide-react";
import Link from "next/link";

function EmptyState({
  icon,
  message,
  children,
}: {
  icon: React.ReactNode;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon}
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      {children}
    </div>
  );
}

function UserRow({
  user,
}: {
  user: { id: string; name: string; avatarUrl?: string | null };
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarImage src={user.avatarUrl ?? undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {user.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground">{user.name}</span>
      </div>
      <FollowButton targetUserId={user.id as Id<"users">} size="sm" />
    </div>
  );
}

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const generateUploadUrl = useMutation(api.auth.generateUploadUrl);
  const updateUserImages = useMutation(api.auth.updateUserImages);

  const followCounts = useQuery(
    api.social.getFollowCounts,
    user ? { userId: user.id as Id<"users"> } : "skip"
  );

  const posts = useQuery(
    api.posts.listUserPosts,
    user
      ? { userId: user.id as Id<"users">, viewerId: user.id as Id<"users"> }
      : "skip"
  );

  // Liked profiles: IDs (for static-JSON lookup) + Convex user data
  const likedProfileIds = useQuery(
    api.social.getLikedProfiles,
    user ? { userId: user.id as Id<"users"> } : "skip"
  );
  const likedConvexProfessionals = useQuery(
    api.social.getLikedProfessionalsData,
    user ? { userId: user.id as Id<"users"> } : "skip"
  );

  const followers = useQuery(
    api.social.getFollowers,
    user ? { userId: user.id as Id<"users"> } : "skip"
  );

  const following = useQuery(
    api.social.getFollowing,
    user ? { userId: user.id as Id<"users"> } : "skip"
  );

  // Merge static-JSON matches + Convex user matches into one list
  const likedProfessionals = useMemo(() => {
    if (!likedProfileIds) return undefined;
    const staticMatches = likedProfileIds
      .filter((id) => /^\d+$/.test(id))
      .map((id) => (professionalsData as any[]).find((p) => p.id === id))
      .filter(Boolean);
    return [...staticMatches, ...(likedConvexProfessionals ?? [])];
  }, [likedProfileIds, likedConvexProfessionals]);

  if (!user) return null;

  const handleImageUpload = async (type: "avatar" | "cover", file: File) => {
    const setUploading = type === "avatar" ? setUploadingAvatar : setUploadingCover;
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      const result = await updateUserImages({
        userId: user.id as Id<"users">,
        avatarStorageId: type === "avatar" ? storageId : undefined,
        coverStorageId: type === "cover" ? storageId : undefined,
      });
      if (type === "avatar" && result.avatarUrl) {
        updateUser({ avatarUrl: result.avatarUrl });
      }
      if (type === "cover" && result.coverImageUrl) {
        updateUser({ coverImageUrl: result.coverImageUrl });
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const avatarSrc = user.avatarUrl || user.profile?.socialLinks?.avatar;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Hidden file inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload("avatar", file);
          e.target.value = "";
        }}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload("cover", file);
          e.target.value = "";
        }}
      />

      {/* Profile Header Card */}
      <Card className="mb-6 overflow-hidden">
        {/* Cover */}
        <div
          className="relative h-32 cursor-pointer overflow-hidden group"
          onClick={() => coverInputRef.current?.click()}
        >
          {user.coverImageUrl ? (
            <img
              src={user.coverImageUrl}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
            {uploadingCover ? (
              <Loader2 className="h-6 w-6 animate-spin text-white opacity-0 transition-opacity group-hover:opacity-100" />
            ) : (
              <Camera className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </div>
        </div>

        <CardContent className="relative pt-0 pb-5 px-5">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div
              className="group relative cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {user.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/40">
                {uploadingAvatar ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white opacity-0 transition-opacity group-hover:opacity-100" />
                ) : (
                  <Camera className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              asChild
            >
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
              <Badge variant="secondary" className="text-xs">
                Professional
              </Badge>
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
        <TabsList className="grid w-full grid-cols-4 rounded-xl">
          <TabsTrigger value="posts" className="gap-1 text-xs">
            <Grid3X3 className="h-3.5 w-3.5" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="liked" className="gap-1 text-xs">
            <Heart className="h-3.5 w-3.5" />
            Liked
          </TabsTrigger>
          <TabsTrigger value="followers" className="gap-1 text-xs">
            <Users className="h-3.5 w-3.5" />
            Followers
          </TabsTrigger>
          <TabsTrigger value="following" className="gap-1 text-xs">
            <UserPlus className="h-3.5 w-3.5" />
            Following
          </TabsTrigger>
        </TabsList>

        {/* Posts — only the user's own posts */}
        <TabsContent value="posts" className="mt-4 space-y-4">
          {!posts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              icon={<Grid3X3 className="h-10 w-10 text-muted-foreground/40" />}
              message="No posts yet"
            >
              <Button
                variant="outline"
                size="sm"
                className="mt-3 rounded-full"
                asChild
              >
                <Link href="/feeds">Create your first post</Link>
              </Button>
            </EmptyState>
          ) : (
            posts.map((post) => (
              <FeedPost
                key={post._id}
                post={
                  {
                    ...post,
                    author: {
                      id: user.id as Id<"users">,
                      name: user.name,
                      avatarUrl: avatarSrc,
                    },
                  } as any
                }
              />
            ))
          )}
        </TabsContent>

        {/* Liked — professionals the user has liked */}
        <TabsContent value="liked" className="mt-4">
          {!likedProfessionals ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : likedProfessionals.length === 0 ? (
            <EmptyState
              icon={<Heart className="h-10 w-10 text-muted-foreground/40" />}
              message="No liked profiles yet"
            >
              <Button
                variant="outline"
                size="sm"
                className="mt-3 rounded-full"
                asChild
              >
                <Link href="/browse">Browse profiles</Link>
              </Button>
            </EmptyState>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {likedProfessionals.map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Followers */}
        <TabsContent value="followers" className="mt-4">
          {!followers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : followers.length === 0 ? (
            <EmptyState
              icon={<Users className="h-10 w-10 text-muted-foreground/40" />}
              message="No followers yet"
            />
          ) : (
            <div className="space-y-3">
              {followers.map(
                (f) => f && <UserRow key={f.id} user={f} />
              )}
            </div>
          )}
        </TabsContent>

        {/* Following */}
        <TabsContent value="following" className="mt-4">
          {!following ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : following.length === 0 ? (
            <EmptyState
              icon={<UserPlus className="h-10 w-10 text-muted-foreground/40" />}
              message="Not following anyone yet"
            >
              <Button
                variant="outline"
                size="sm"
                className="mt-3 rounded-full"
                asChild
              >
                <Link href="/browse">Find people</Link>
              </Button>
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {following.map(
                (f) => f && <UserRow key={f.id} user={f} />
              )}
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
