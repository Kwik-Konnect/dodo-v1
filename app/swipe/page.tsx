"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  X,
  MessageCircle,
  MapPin,
  Star,
  CheckCircle,
  ArrowLeft,
  X as CloseIcon,
} from "lucide-react";
import type { Professional } from "@/lib/types";
import { getProfessionals } from "@/lib/data";
import { ProfileLikeButton } from "@/components/social/like-button";
import { useAuth } from "@/contexts/auth-context";

export default function SwipePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const professionals = getProfessionals();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const current = professionals[currentIndex];

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      handleAction("pass");
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      handleAction("like");
    } else if (e.key === "Escape") {
      e.preventDefault();
      router.back();
    }
  };

  const handleAction = (action: "like" | "pass") => {
    setDirection(action === "like" ? "right" : "left");
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setDirection(null);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const diffX = e.changedTouches[0].clientX - touchStart.x;
    const diffY = e.changedTouches[0].clientY - touchStart.y;
    
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 80) {
      handleAction(diffX > 0 ? "like" : "pass");
    }
    setTouchStart(null);
  };

  const handleChat = () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    router.push(`/messages/${current.id}`);
  };

  if (!current) {
    const emptyContent = (
      <div className="flex flex-col items-center justify-center text-center">
        <Heart className="h-16 w-16 text-white/30" />
        <h3 className="mt-4 text-lg font-semibold text-white">
          No more profiles
        </h3>
        <p className="mt-2 text-sm text-white/70">
          Check back later for new people to discover
        </p>
        <Button
          className="mt-6 rounded-full"
          onClick={() => router.push("/browse")}
        >
          Browse More
        </Button>
      </div>
    );

    if (!isMounted) {
      return emptyContent;
    }

    return (
      <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col bg-black">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-bold text-white">Discover</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/browse")}
            className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <CloseIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {emptyContent}
        </div>
      </div>
    );
  }

  const lowestPrice = Math.min(...current.services.map((s) => s.price));

  const content = (
    <div
      className="flex h-screen w-screen flex-col bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-bold text-white">Discover</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">
            {currentIndex + 1} / {professionals.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/browse")}
            className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <CloseIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          ref={cardRef}
          className={`relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl transition-all duration-300 ${
            direction === "left"
              ? "-translate-x-full rotate-[-10deg] opacity-0"
              : direction === "right"
                ? "translate-x-full rotate-[10deg] opacity-0"
                : ""
          }`}
        >
          {/* Image */}
          <div className="relative h-[60vh] max-h-[500px] overflow-hidden">
            <img
              src={current.coverImage}
              alt={current.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

            {/* Online indicator */}
            {current.isOnline && (
              <div className="absolute top-4 right-4">
                <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white">
                  Online
                </span>
              </div>
            )}

            {/* Profile info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">
                  {current.name}, {current.age}
                </h3>
                {current.verified && (
                  <CheckCircle className="h-5 w-5 fill-primary text-white" />
                )}
              </div>
              
              <div className="mt-1 flex items-center gap-1 text-sm text-white/80">
                <MapPin className="h-3 w-3" />
                {current.location}
                <span className="ml-2">From ${lowestPrice}/hr</span>
              </div>

              <div className="mt-2 flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm text-white">{current.rating}</span>
                <span className="text-sm text-white/60">({current.reviewCount})</span>
              </div>

              <p className="mt-2 line-clamp-2 text-sm text-white/80">
                {current.bio}
              </p>

              {/* Interests */}
              <div className="mt-3 flex flex-wrap gap-1">
                {(current.interests || []).slice(0, 3).map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-white/70 backdrop-blur-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-around p-4 border-t border-white/10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleAction("pass")}
              className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>

            <ProfileLikeButton
              professionalId={current.id}
              variant="swipe"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleAction("like")}
              className="h-12 w-12 rounded-full bg-primary text-white hover:bg-primary/90"
            >
              <Heart className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleChat}
              className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Only apply fixed positioning on client-side to avoid hydration issues
  if (!isMounted) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50">
      {content}
    </div>
  );
}
