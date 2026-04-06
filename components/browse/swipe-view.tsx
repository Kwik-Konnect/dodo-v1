"use client";

import { useState, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import type { Professional } from "@/lib/types";

interface SwipeViewProps {
  professionals: Professional[];
}

export function SwipeView({ professionals }: SwipeViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const current = professionals[currentIndex];

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="h-16 w-16 text-primary/30" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No more profiles
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back later for new people to discover
        </p>
      </div>
    );
  }

  const handleAction = (action: "like" | "pass") => {
    setDirection(action === "like" ? "right" : "left");
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setDirection(null);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 80) {
      handleAction(diff > 0 ? "like" : "pass");
    }
    setTouchStart(null);
  };

  const lowestPrice = Math.min(...current.services.map((s) => s.price));

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
      {/* Progress */}
      <div className="flex w-full items-center justify-between px-1 text-xs text-muted-foreground">
        <span>
          {currentIndex + 1} / {professionals.length}
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
          {professionals.filter((p) => p.isOnline).length} online
        </span>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-all duration-300 ${
          direction === "left"
            ? "-translate-x-full rotate-[-10deg] opacity-0"
            : direction === "right"
              ? "translate-x-full rotate-[10deg] opacity-0"
              : ""
        }`}
      >
        {/* Image */}
        <div className="relative h-[420px] overflow-hidden sm:h-[480px]">
          <img
            src={current.coverImage}
            alt={current.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Top badges */}
          <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              {current.isLive && (
                <Badge className="w-fit rounded-md bg-destructive px-2 py-0.5 text-[10px] font-bold text-white">
                  LIVE
                </Badge>
              )}
              {current.isOnline && (
                <Badge className="w-fit rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                  Online Now
                </Badge>
              )}
            </div>
            <Link href={`/professional/${current.id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/40 text-white/80 backdrop-blur-sm hover:bg-black/60"
              >
                <Info className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Bottom overlay info */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">
                {current.name}
              </h2>
              <span className="text-xl text-white/80">{current.age}</span>
              {current.verified && (
                <CheckCircle className="h-5 w-5 fill-primary text-white" />
              )}
            </div>

            <div className="mt-1 flex items-center gap-3 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {current.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {current.rating}
              </span>
            </div>

            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">
              {current.bio}
            </p>

            {/* Interests */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(current.interests || []).slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm"
                >
                  {interest}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="mt-3 text-sm">
              <span className="text-white/50">From </span>
              <span className="font-bold text-primary">
                ${lowestPrice}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
          onClick={() => handleAction("pass")}
        >
          <X className="h-6 w-6" />
        </Button>

        <Link href={`/professional/${current.id}`}>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full border-2 border-secondary/50 text-secondary hover:bg-secondary hover:text-white"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </Link>

        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
          onClick={() => handleAction("like")}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>

      {/* Swipe hint */}
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <ChevronLeft className="h-3 w-3" />
        Swipe or tap to decide
        <ChevronRight className="h-3 w-3" />
      </p>
    </div>
  );
}
