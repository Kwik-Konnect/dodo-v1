"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/profile/profile-header";
import { AboutSection } from "@/components/profile/about-section";
import { ServicesSection } from "@/components/profile/services-section";
import { PortfolioSection } from "@/components/profile/portfolio-section";
import { ReviewsSection } from "@/components/profile/reviews-section";
import { formatPrice } from "@/lib/currency";
import { MessageCircle, Calendar } from "lucide-react";
import type { Service } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfessionalPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const professional = useQuery(api.professionals.getProfessionalProfile, {
    userId: id as Id<"users">,
  });

  // undefined = loading, null = not found
  if (professional === null) {
    notFound();
  }

  if (professional === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleSelectService = (service: Service) => {
    router.push(`/book/${professional.id}?service=${service.id}`);
  };

  const handleBookNow = () => {
    if (professional.services.length > 0) {
      router.push(`/book/${professional.id}`);
    }
  };

  const minPrice = professional.services.length > 0
    ? Math.min(...professional.services.map((s) => s.price))
    : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile Header */}
      <ProfileHeader professional={professional as any} />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <AboutSection professional={professional as any} />
            <ServicesSection
              services={professional.services}
              onSelectService={handleSelectService}
            />
            <PortfolioSection portfolio={professional.portfolio} />
            <ReviewsSection
              reviews={professional.reviews as any}
              averageRating={professional.rating}
              totalReviews={professional.reviewCount}
            />
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  {minPrice > 0 && (
                    <div className="mb-4 text-center">
                      <p className="text-sm text-muted-foreground">Starting from</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatPrice(minPrice)}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full rounded-xl"
                      onClick={handleBookNow}
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full rounded-xl"
                      onClick={() => router.push(`/messages/${professional.id}`)}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </div>

                  {/* Quick Info */}
                  <div className="mt-6 space-y-3 border-t border-border pt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response time</span>
                      <span className="font-medium text-foreground">Within 2 hours</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completed jobs</span>
                      <span className="font-medium text-foreground">{professional.reviewCount}+</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Member since</span>
                      <span className="font-medium text-foreground">2022</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
