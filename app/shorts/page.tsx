"use client";

import { useState } from "react";
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
} from "lucide-react";
import { getProfessionals } from "@/lib/data";
import { ProfileLikeButton } from "@/components/social/like-button";
import { useAuth } from "@/contexts/auth-context";

export default function ShortsPage() {
  const professionals = getProfessionals();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();

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

  if (!current) return null;

  return (
    <div
      className="relative flex h-[calc(100vh-3.5rem-4rem)] flex-col lg:h-[calc(100vh-3.5rem)]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full screen image/video area */}
      <div className="relative flex-1 overflow-hidden bg-black">
        <img
          src={current.coverImage}
          alt={current.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

        {/* Top bar */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Shorts</h2>
          <span className="text-xs text-white/60">
            {currentIndex + 1} / {professionals.length}
          </span>
        </div>

        {/* Right side actions */}
        <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5">
          <Link href={`/professional/${current.id}`} className="group">
            <div className="relative">
              <img
                src={current.avatar}
                alt={current.name}
                className="h-11 w-11 rounded-full border-2 border-primary object-cover"
              />
              <span className="absolute -bottom-1 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                +
              </span>
            </div>
          </Link>

          <div className="flex flex-col items-center gap-1">
            <ProfileLikeButton
              professionalId={current.id}
              variant="compact"
            />
            <span className="text-[10px] font-medium text-white">
              {current.reviewCount}
            </span>
          </div>

          <button onClick={handleChat} className="flex flex-col items-center gap-1">
            <MessageCircle className="h-7 w-7 text-white" />
            <span className="text-[10px] font-medium text-white">Chat</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <Bookmark className="h-7 w-7 text-white" />
            <span className="text-[10px] font-medium text-white">Save</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <Share2 className="h-7 w-7 text-white" />
            <span className="text-[10px] font-medium text-white">Share</span>
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-4 left-4 right-16">
          <div className="flex items-center gap-2">
            <Link
              href={`/professional/${current.id}`}
              className="text-base font-bold text-white hover:underline"
            >
              {current.name}, {current.age}
            </Link>
            {current.verified && (
              <CheckCircle className="h-4 w-4 fill-primary text-white" />
            )}
            {current.isOnline && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-white">
                Online
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-white/60">
            <MapPin className="h-3 w-3" />
            {current.location}
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm text-white/70">
            {current.bio}
          </p>

          {/* Interests */}
          <div className="mt-2 flex flex-wrap gap-1">
            {(current.interests || []).slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-sm"
              >
                {interest}
              </span>
            ))}
          </div>

          {/* Book CTA */}
          <Button
            size="sm"
            className="mt-3 rounded-full bg-primary px-6 text-xs font-semibold shadow-lg shadow-primary/30"
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
}
