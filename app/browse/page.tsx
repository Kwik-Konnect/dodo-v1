"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FilterSidebar } from "@/components/browse/filter-sidebar";
import {
  ProfessionalCard,
  ProfessionalCardSkeleton,
} from "@/components/professional-card";
import { getCategoryById } from "@/lib/data";
import { formatPrice } from "@/lib/currency";
import { SwipeView } from "@/components/browse/swipe-view";
import { SlidersHorizontal, Search, X, LayoutGrid, Flame } from "lucide-react";
import type { Category } from "@/lib/types";
import professionalsData from "@/data/professionals.json";

function BrowseContent() {
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [viewMode, setViewMode] = useState<"grid" | "swipe">("grid");

  // Get filter values from URL
  const category = searchParams.get("category") as Category | null;
  const location = searchParams.get("location") || undefined;
  const ethnicity = searchParams.get("ethnicity") || undefined;
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const searchQuery = searchParams.get("search") || undefined;

  // Fetch from Convex (server-side filtering)
  const rawProfessionals = useQuery(api.professionals.listProfessionals, {
    category: category || undefined,
    location,
    ethnicity,
    minRating,
    maxPrice,
    searchQuery,
  });
  const fallbackProfessionals = professionalsData as any[];

  // Client-side sort
  const professionals = useMemo(() => {
    const source = rawProfessionals ?? fallbackProfessionals;
    if (!source) return [];
    const results = [...source];
    switch (sortBy) {
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        results.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "price-low":
        results.sort((a, b) => (a.startingPrice ?? 0) - (b.startingPrice ?? 0));
        break;
      case "price-high":
        results.sort((a, b) => (b.startingPrice ?? 0) - (a.startingPrice ?? 0));
        break;
    }
    return results;
  }, [rawProfessionals, sortBy]);

  // Active filters for display
  const activeFilters = useMemo(() => {
    const filters: { key: string; label: string; value: string }[] = [];
    if (category) {
      const cat = getCategoryById(category);
      if (cat) filters.push({ key: "category", label: "Category", value: cat.name });
    }
    if (location) filters.push({ key: "location", label: "Location", value: location });
    if (ethnicity) filters.push({ key: "ethnicity", label: "Ethnicity", value: ethnicity });
    if (minRating) filters.push({ key: "minRating", label: "Rating", value: `${minRating}+ stars` });
    if (maxPrice && maxPrice < 5000) filters.push({ key: "maxPrice", label: "Max Price", value: formatPrice(maxPrice) });
    if (searchQuery) filters.push({ key: "search", label: "Search", value: searchQuery });
    return filters;
  }, [category, location, ethnicity, minRating, maxPrice, searchQuery]);

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    window.location.href = `/browse?${params.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set("search", searchInput);
    } else {
      params.delete("search");
    }
    window.location.href = `/browse?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {category ? getCategoryById(category)?.name : "Discover"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {rawProfessionals === undefined && fallbackProfessionals.length === 0 ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary/70" />
                    Loading results...
                  </span>
                ) : (
                  `${professionals.length} ${
                    professionals.length !== 1 ? "ladies" : "lady"
                  } available`
                )}
              </p>
            </div>
            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-full border border-border bg-muted/30 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("swipe")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  viewMode === "swipe"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                Swipe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <FilterSidebar
                selectedCategory={category || undefined}
                selectedLocation={location}
                selectedEthnicity={ethnicity}
                minRating={minRating}
                maxPrice={maxPrice}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex flex-1 gap-2 sm:max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search skills, names..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="rounded-full pl-10"
                  />
                </div>
                <Button type="submit" size="sm" className="rounded-full">
                  Search
                </Button>
              </form>

              {/* Mobile Filter Button & Sort */}
              <div className="flex items-center gap-3">
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                      {activeFilters.length > 0 && (
                        <Badge className="ml-2" variant="secondary">
                          {activeFilters.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-6">
                    <FilterSidebar
                      selectedCategory={category || undefined}
                      selectedLocation={location}
                      selectedEthnicity={ethnicity}
                      minRating={minRating}
                      maxPrice={maxPrice}
                      onClose={() => setMobileFiltersOpen(false)}
                    />
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="secondary"
                    className="gap-1 rounded-full pl-3 pr-1"
                  >
                    {filter.value}
                    <button
                      onClick={() => removeFilter(filter.key)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Results */}
            {rawProfessionals === undefined && fallbackProfessionals.length === 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ProfessionalCardSkeleton key={idx} />
                ))}
              </div>
            ) : professionals.length > 0 ? (
              viewMode === "swipe" ? (
                <SwipeView professionals={professionals} />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {professionals.map((professional) => (
                    <ProfessionalCard key={professional.id} professional={professional} />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  No professionals found
                </h3>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  Try adjusting your filters or search terms to find what you are looking for.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={() => (window.location.href = "/browse")}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
