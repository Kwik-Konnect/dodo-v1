"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  CheckCircle,
  Clock,
  Globe,
  Share2,
  MessageCircle,
  CalendarCheck,
} from "lucide-react";
import type { Professional } from "@/lib/types";
import { getCategoryById } from "@/lib/data";
import { ProfileLikeButton } from "@/components/social/like-button";
import { FollowButton } from "@/components/social/follow-button";
import { useAuth } from "@/contexts/auth-context";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ProfileHeaderProps {
  professional: Professional;
}

export function ProfileHeader({ professional }: ProfileHeaderProps) {
  const category = getCategoryById(professional.category);
  const { user } = useAuth();
  const router = useRouter();

  // We store the static professional ID as a Convex user ID placeholder
  // In a real scenario these would be linked Convex accounts
  const handleChat = () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    // Start a DM thread with this professional
    router.push(`/messages/${professional.id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: professional.name,
        text: professional.bio,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 overflow-hidden md:h-64 lg:h-72">
        <img
          src={professional.coverImage}
          alt={`${professional.name}'s cover`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 pb-6 md:-mt-28">
          <div className="flex flex-col gap-5 md:flex-row md:items-end">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={professional.avatar}
                alt={professional.name}
                className="h-28 w-28 rounded-2xl border-4 border-card object-cover shadow-xl ring-2 ring-primary/20 md:h-40 md:w-40 md:rounded-3xl"
              />
              {professional.verified && (
                <div className="absolute -bottom-2 -right-2 rounded-full bg-card p-0.5 shadow-lg">
                  <CheckCircle className="h-7 w-7 fill-primary text-white" />
                </div>
              )}
              <div className="absolute left-0 right-0 -bottom-4 flex justify-center md:left-2 md:right-2">
                <span className="rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  Available Today
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="mt-4 flex-1 md:mt-0 md:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  {professional.name}
                </h1>
                {professional.verified && (
                  <CheckCircle className="h-5 w-5 fill-primary text-white" />
                )}
                {professional.isLive && (
                  <Badge className="rounded-full bg-primary/15 text-primary hover:bg-primary/20">
                    LIVE
                  </Badge>
                )}
              </div>

              <p className="mt-1 text-muted-foreground">{professional.title}</p>

              {/* Meta Info */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">
                    {professional.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({professional.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {professional.location}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {professional.yearsExperience}yr exp
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" />
                  {professional.languages.join(", ")}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-4 flex flex-wrap gap-2">
                {/* Live Like button — persisted to Convex */}
                <ProfileLikeButton
                  professionalId={professional.id}
                  variant="default"
                />

              {/* Chat */}
              <Button
                size="sm"
                className="rounded-full bg-secondary px-5 text-sm font-semibold text-white shadow-lg shadow-secondary/25 hover:bg-secondary/90"
                onClick={handleChat}
              >
                <MessageCircle className="mr-1.5 h-4 w-4" />
                Chat
              </Button>

              {/* Follow */}
              <FollowButton
                targetUserId={professional.id as Id<"users">}
                size="sm"
                className="rounded-full"
              />

                {/* Book */}
                <Button
                  size="sm"
                  className="rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
                  asChild
                >
                  <Link href={`/book/${professional.id}`}>
                    <CalendarCheck className="mr-1.5 h-4 w-4" />
                    Book
                  </Link>
                </Button>
              </div>

              {/* Category Badge */}
              {category && (
                <Link href={`/browse?category=${category.id}`}>
                  <Badge
                    variant="outline"
                    className="mt-3 rounded-full border-primary/30 text-primary"
                  >
                    {category.name}
                  </Badge>
                </Link>
              )}
            </div>

            {/* Share */}
            <div className="hidden shrink-0 md:flex">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-border"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
