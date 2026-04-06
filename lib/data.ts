import professionalsData from "@/data/professionals.json";
import categoriesData from "@/data/categories.json";
import type { Professional, CategoryInfo, FilterOptions, Category } from "./types";
import { getSierraLeoneLocations } from "./locations";

export function getProfessionals(): Professional[] {
  return professionalsData as Professional[];
}

export function getCategories(): CategoryInfo[] {
  return categoriesData as CategoryInfo[];
}

export function getProfessionalById(id: string): Professional | undefined {
  return getProfessionals().find((p) => p.id === id);
}

export function getCategoryById(id: Category): CategoryInfo | undefined {
  return getCategories().find((c) => c.id === id);
}

export function getFeaturedProfessionals(limit = 6): Professional[] {
  return getProfessionals()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function filterProfessionals(options: FilterOptions): Professional[] {
  let results = getProfessionals();

  if (options.category) {
    results = results.filter((p) => p.category === options.category);
  }

  if (options.skills && options.skills.length > 0) {
    results = results.filter((p) =>
      options.skills!.some((skill) =>
        p.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
      )
    );
  }

  if (options.location) {
    results = results.filter((p) =>
      p.location.toLowerCase().includes(options.location!.toLowerCase())
    );
  }

  if (options.ethnicity) {
    results = results.filter((p) =>
      p.ethnicity.toLowerCase().includes(options.ethnicity!.toLowerCase())
    );
  }

  if (options.minRating) {
    results = results.filter((p) => p.rating >= options.minRating!);
  }

  if (options.minPrice !== undefined) {
    results = results.filter((p) =>
      p.services.some((s) => s.price >= options.minPrice!)
    );
  }

  if (options.maxPrice !== undefined) {
    results = results.filter((p) =>
      p.services.some((s) => s.price <= options.maxPrice!)
    );
  }

  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.skills.some((s) => s.toLowerCase().includes(query)) ||
        p.bio.toLowerCase().includes(query)
    );
  }

  return results;
}

export function getUniqueLocations(): string[] {
  return getSierraLeoneLocations();
}

export function getUniqueEthnicities(): string[] {
  const ethnicities = getProfessionals().map((p) => p.ethnicity);
  return [...new Set(ethnicities)].sort();
}

export function getAllSkills(): string[] {
  const skills = getProfessionals().flatMap((p) => p.skills);
  return [...new Set(skills)].sort();
}

export function getSkillsByCategory(category: Category): string[] {
  const skills = getProfessionals()
    .filter((p) => p.category === category)
    .flatMap((p) => p.skills);
  return [...new Set(skills)].sort();
}
