"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (location) params.set("location", location);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sidebar via-background to-background py-16 md:py-24 lg:py-32">
      {/* Decorative blurred shapes */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-secondary/25 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[100px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-lg shadow-primary/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Girls are online now
            </div>
            
            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-foreground">Meet Amazing</span>{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Women Near You</span>
            </h1>
            
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Discover incredible women who share their interests, vibes, and energy.
              Browse profiles, watch stories, swipe to match, and book a hangout.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name, vibe, interest..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 rounded-xl border-border bg-card pl-12 pr-4 text-base shadow-sm sm:h-14 sm:rounded-2xl"
                  />
                </div>
                <div className="relative sm:w-44">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 rounded-xl border-border bg-card pl-12 pr-4 text-base shadow-sm sm:h-14 sm:rounded-2xl"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 rounded-xl bg-primary px-6 text-base font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 sm:h-14 sm:rounded-2xl sm:px-8"
                >
                  Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Companions", "Virtual Dates", "Escorts", "Content Creators"].map((term) => (
                <Button
                  key={term}
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full border border-border/50 bg-muted/30 px-3 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                  onClick={() => router.push(`/browse?search=${encodeURIComponent(term)}`)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-4">
              {/* Large image left */}
              <div className="col-span-7 overflow-hidden rounded-3xl shadow-xl shadow-primary/10 ring-1 ring-white/10">
                <img
                  src="/girls/1775215902622edited-image.webp"
                  alt="Featured girl"
                  className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              {/* Two stacked images right */}
              <div className="col-span-5 flex flex-col gap-4">
                <div className="overflow-hidden rounded-3xl shadow-lg">
                  <img
                    src="/girls/1763046071553edited-image.webp"
                    alt="Featured girl"
                    className="h-36 w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl shadow-lg">
                  <img
                    src="/girls/1774305302779edited-image.webp"
                    alt="Featured girl"
                    className="h-40 w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Bottom row */}
              <div className="col-span-5 overflow-hidden rounded-3xl shadow-lg">
                <img
                  src="/girls/1770314038130edited-image.webp"
                  alt="Featured girl"
                  className="h-32 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="col-span-7 overflow-hidden rounded-3xl shadow-lg">
                <img
                  src="/girls/1730729028885E51555CF-B4F1-4993-B4CC-296E5C32DDBA.jpeg"
                  alt="Featured girl"
                  className="h-32 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Mobile image */}
          <div className="mx-auto max-w-sm lg:hidden">
            <div className="grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-2xl shadow-md">
                <img
                  src="/girls/1775215902622edited-image.webp"
                  alt="Featured girl"
                  className="h-28 w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-md">
                <img
                  src="/girls/1763046071553edited-image.webp"
                  alt="Featured girl"
                  className="h-28 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
