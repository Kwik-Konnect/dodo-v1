"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfessionalCard } from "@/components/professional-card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getCategories } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";

export function FeaturedSection() {
  const allFeatured = useQuery(api.professionals.getFeaturedProfessionals, { limit: 12 });
  const categories = getCategories();
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");

  const filtered = !allFeatured ? [] : activeFilter === "all"
    ? allFeatured.slice(0, 6)
    : allFeatured.filter((p) => p.category === activeFilter).slice(0, 6);

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Top-Rated Professionals
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Discover our highest-rated experts ready to help
            </p>
          </div>
          <Button
            className="shrink-0 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
            asChild
          >
            <Link href="/browse">
              View More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeFilter === "all"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "border border-border bg-muted/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeFilter === cat.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "border border-border bg-muted/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))}
        </div>
      </div>
    </section>
  );
}
