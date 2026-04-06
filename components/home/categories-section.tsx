import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories } from "@/lib/data";
import {
  Sparkles,
  Heart,
  Palette,
  Home,
  Briefcase,
  Laptop,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Heart,
  Palette,
  Home,
  Briefcase,
  Laptop,
};

const colorMap: Record<string, string> = {
  "beauty-wellness": "bg-pink-100 text-pink-600",
  "healthcare": "bg-red-100 text-red-600",
  "creative": "bg-amber-100 text-amber-600",
  "home-services": "bg-green-100 text-green-600",
  "professional": "bg-blue-100 text-blue-600",
  "tech": "bg-indigo-100 text-indigo-600",
};

export function CategoriesSection() {
  const categories = getCategories();

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Browse by Category
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Find the perfect professional for any service you need
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Briefcase;
            const colorClass = colorMap[category.id] || "bg-muted text-muted-foreground";

            return (
              <Link key={category.id} href={`/browse?category=${category.id}`}>
                <Card className="group h-full cursor-pointer border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorClass} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-foreground">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
