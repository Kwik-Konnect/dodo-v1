"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { getCategoryById } from "@/lib/data";
import type { Professional } from "@/lib/types";
import { ProfileLikeButton } from "@/components/social/like-button";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfessionalCardProps {
  professional: Professional;
}

export function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const category = getCategoryById(professional.category);
  const lowestPrice = Math.min(...professional.services.map((s) => s.price));
  const isTopRated = professional.rating >= 4.8;

  return (
    <Link href={`/professional/${professional.id}`}>
      <div className="group relative h-full cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
        {/* Full Image Area */}
        <div className="relative h-52 overflow-hidden sm:h-60">
          <img
            src={professional.coverImage}
            alt={`${professional.name}'s work`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top badges row */}
          <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              {isTopRated && (
                <Badge className="w-fit rounded-md bg-[var(--color-hot)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  Hot
                </Badge>
              )}
              {professional.verified && (
                <Badge className="w-fit rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
                  Available Today
                </Badge>
              )}
            </div>

            {/* Live like button — stops link navigation via e.preventDefault inside */}
            <ProfileLikeButton
              professionalId={professional.id}
              variant="compact"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-primary/80"
            />
          </div>

          {/* Bottom overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center gap-2">
              <img
                src={professional.avatar}
                alt={professional.name}
                className="h-10 w-10 shrink-0 rounded-lg border-2 border-white/20 object-cover shadow-lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-bold text-white">
                    {professional.name}
                  </h3>
                  {professional.verified && (
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 fill-primary text-white" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-white/70">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{professional.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3">
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {professional.bio || professional.title}
          </p>

          {/* Rating + Price row */}
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-foreground">
                {professional.rating}
              </span>
              <span className="text-xs text-muted-foreground">
                ({professional.reviewCount})
              </span>
            </div>
            <span className="text-sm font-bold text-primary">
              {formatPrice(lowestPrice)}
            </span>
          </div>

          {/* Skills */}
          <div className="mt-2 flex flex-wrap gap-1">
            {professional.skills.slice(0, 2).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="rounded-md border-border/50 px-1.5 py-0 text-[10px] font-normal text-muted-foreground"
              >
                {skill}
              </Badge>
            ))}
            {professional.skills.length > 2 && (
              <Badge
                variant="outline"
                className="rounded-md border-border/50 px-1.5 py-0 text-[10px] font-normal text-muted-foreground"
              >
                +{professional.skills.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProfessionalCardSkeleton() {
  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative h-52 overflow-hidden sm:h-60">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
