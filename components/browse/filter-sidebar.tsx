"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCategories, getUniqueLocations, getUniqueEthnicities } from "@/lib/data";
import { formatPrice } from "@/lib/currency";
import { X } from "lucide-react";
import type { Category } from "@/lib/types";

interface FilterSidebarProps {
  selectedCategory?: Category;
  selectedLocation?: string;
  selectedEthnicity?: string;
  minRating?: number;
  maxPrice?: number;
  onClose?: () => void;
}

export function FilterSidebar({
  selectedCategory,
  selectedLocation,
  selectedEthnicity,
  minRating = 0,
  maxPrice = 5000,
  onClose,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categories = getCategories();
  const locations = getUniqueLocations();
  const ethnicities = getUniqueEthnicities();

  const updateFilter = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "" || value === 0) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    router.push(`/browse?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    router.push(`/browse?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategory || selectedLocation || selectedEthnicity || minRating > 0 || maxPrice < 5000;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto py-4">
        <Accordion type="multiple" defaultValue={["category", "location", "ethnicity", "rating", "price"]} className="space-y-2">
          {/* Category Filter */}
          <AccordionItem value="category" className="border-none">
            <AccordionTrigger className="rounded-lg px-3 py-2 hover:bg-muted hover:no-underline">
              <span className="text-sm font-medium">Category</span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pt-2">
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategory === category.id}
                      onCheckedChange={(checked) =>
                        updateFilter("category", checked ? category.id : null)
                      }
                    />
                    <Label
                      htmlFor={category.id}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Location Filter */}
          <AccordionItem value="location" className="border-none">
            <AccordionTrigger className="rounded-lg px-3 py-2 hover:bg-muted hover:no-underline">
              <span className="text-sm font-medium">Location</span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pt-2">
              <Select
                value={selectedLocation || "all"}
                onValueChange={(value) =>
                  updateFilter("location", value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Ethnicity Filter */}
          <AccordionItem value="ethnicity" className="border-none">
            <AccordionTrigger className="rounded-lg px-3 py-2 hover:bg-muted hover:no-underline">
              <span className="text-sm font-medium">Ethnic Background</span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pt-2">
              <div className="space-y-2">
                {ethnicities.map((ethnicity) => (
                  <div key={ethnicity} className="flex items-center gap-2">
                    <Checkbox
                      id={`eth-${ethnicity}`}
                      checked={selectedEthnicity === ethnicity}
                      onCheckedChange={(checked) =>
                        updateFilter("ethnicity", checked ? ethnicity : null)
                      }
                    />
                    <Label
                      htmlFor={`eth-${ethnicity}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {ethnicity}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Rating Filter */}
          <AccordionItem value="rating" className="border-none">
            <AccordionTrigger className="rounded-lg px-3 py-2 hover:bg-muted hover:no-underline">
              <span className="text-sm font-medium">Minimum Rating</span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pt-2">
              <div className="space-y-4">
                <Slider
                  value={[minRating]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={([value]) => updateFilter("minRating", value)}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Any</span>
                  <span className="font-medium text-foreground">
                    {minRating > 0 ? `${minRating}+ stars` : "Any rating"}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Filter */}
          <AccordionItem value="price" className="border-none">
            <AccordionTrigger className="rounded-lg px-3 py-2 hover:bg-muted hover:no-underline">
              <span className="text-sm font-medium">Maximum Price</span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pt-2">
              <div className="space-y-4">
                <Slider
                  value={[maxPrice]}
                  min={0}
                  max={5000}
                  step={100}
                  onValueChange={([value]) => updateFilter("maxPrice", value)}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Le 0</span>
                  <span className="font-medium text-foreground">
                    {maxPrice < 5000 ? `Up to ${formatPrice(maxPrice)}` : "Any price"}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
