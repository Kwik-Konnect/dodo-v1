"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { getProfessionalById } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

function BookingContent({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const professional = getProfessionalById(id);
  
  if (!professional) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-8 rounded-full bg-muted p-6 w-fit">
            <CalendarDays className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Bookings Temporarily Unavailable
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our booking system is currently undergoing maintenance. Please check back soon or contact the professional directly through messages.
          </p>
          <div className="space-y-4">
            <Button 
              size="lg" 
              onClick={() => router.push(`/professional/${id}`)}
              className="rounded-full"
            >
              View Profile
            </Button>
            <div className="pt-4">
              <Link href="/browse">
                <Button variant="outline" size="lg" className="rounded-full">
                  Browse Other Professionals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage(props: PageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
