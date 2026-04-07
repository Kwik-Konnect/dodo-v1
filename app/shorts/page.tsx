"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Share2,
  ChevronUp,
  ChevronDown,
  MapPin,
  CheckCircle,
  Bookmark,
  ArrowLeft,
  X,
} from "lucide-react";
import { getProfessionals } from "@/lib/data";
import { ProfileLikeButton } from "@/components/social/like-button";
import { useAuth } from "@/contexts/auth-context";

export default function ShortsPage() {
  const professionals = getProfessionals();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const current = professionals[currentIndex];

  const goNext = () => {
    if (currentIndex < professionals.length - 1) setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleChat = () => {
    if (!user) { router.push("/auth"); return; }
    router.push("/messages");
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientY - touchStart;
    if (diff < -60) goNext();
    if (diff > 60) goPrev();
    setTouchStart(null);
  };

  // Add keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "Escape") {
      e.preventDefault();
      router.back();
    }
  };

  if (!current) return null;

  const content = (
    <div
      className="flex h-screen w-screen flex-col bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Full screen image/video area */}
      <div className="relative flex-1 overflow-hidden bg-black">
        <img
          src={current.coverImage}
          alt={current.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

        {/* Top bar with back button */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold text-white">Shorts</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">
              {currentIndex + 1} / {professionals.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right side actions */}
        <div className="absolute bottom-20 lg:bottom-24 right-3 flex flex-col items-center gap-4 lg:gap-5">
          <Link href={`/professional/${current.id}`} className="group">
            <div className="relative">
              <img
                src={current.avatar}
                alt={current.name}
                className="h-10 w-10 lg:h-11 lg:w-11 rounded-full border-2 border-primary object-cover"
              />
              <span className="absolute -bottom-1 left-1/2 flex h-4 w-4 lg:h-5 lg:w-5 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-[9px] lg:text-[10px] font-bold text-white">
                +
              </span>
            </div>
          </Link>

          <div className="flex flex-col items-center gap-1">
            <ProfileLikeButton
              professionalId={current.id}
              variant="compact"
            />
            <span className="text-[9px] lg:text-[10px] font-medium text-white">
              {current.reviewCount}
            </span>
          </div>

          <button onClick={handleChat} className="flex flex-col items-center gap-1">
            <MessageCircle className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
            <span className="text-[9px] lg:text-[10px] font-medium text-white">Chat</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <Bookmark className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
            <span className="text-[9px] lg:text-[10px] font-medium text-white">Save</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <Share2 className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
            <span className="text-[9px] lg:text-[10px] font-medium text-white">Share</span>
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-4 left-4 right-12 lg:right-16">
          <div className="flex items-center gap-2">
            <Link
              href={`/professional/${current.id}`}
              className="text-sm lg:text-base font-bold text-white hover:underline"
            >
              {current.name}, {current.age}
            </Link>
            {current.verified && (
              <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 fill-primary text-white" />
            )}
            {current.isOnline && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[8px] lg:text-[9px] font-bold text-white">
                Online
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] lg:text-xs text-white/60">
            <MapPin className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
            {current.location}
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs lg:text-sm text-white/70">
            {current.bio}
          </p>

          {/* Interests */}
          <div className="mt-2 flex flex-wrap gap-1">
            {(current.interests || []).slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] lg:text-[10px] text-white/70 backdrop-blur-sm"
              >
                {interest}
              </span>
            ))}
          </div>

          {/* Book CTA */}
          <Button
            size="sm"
            className="mt-3 rounded-full bg-primary px-4 lg:px-6 text-[10px] lg:text-xs font-semibold shadow-lg shadow-primary/30"
            asChild
          >
            <Link href={`/professional/${current.id}`}>Book Hangout</Link>
          </Button>
        </div>

        {/* Nav arrows (desktop) */}
        <div className="absolute left-1/2 top-4 hidden -translate-x-1/2 flex-col gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={goNext}
            disabled={currentIndex === professionals.length - 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
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
