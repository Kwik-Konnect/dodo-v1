import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  UserCheck,
  Calendar,
  Star,
  Shield,
  CreditCard,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description:
      "Browse through our diverse community of talented women professionals. Use filters to find exactly what you need based on skills, location, ethnicity, ratings, and price range.",
  },
  {
    icon: UserCheck,
    title: "Review Profiles",
    description:
      "Explore detailed profiles complete with portfolios, client reviews, service offerings, and pricing. Get to know professionals before reaching out.",
  },
  {
    icon: MessageCircle,
    title: "Connect & Discuss",
    description:
      "Send messages to professionals to discuss your specific needs, ask questions, and ensure they're the right fit for your project.",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description:
      "After your service, share your experience by leaving a rating and review. Help others find great professionals and build our community.",
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "All professionals go through a verification process to ensure quality and authenticity.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Your payments are protected with our secure escrow system powered by Monime.",
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    description: "Chat directly with professionals to discuss your needs before booking.",
  },
  {
    icon: Star,
    title: "Trusted Reviews",
    description: "Read authentic reviews from real clients to make informed decisions.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-accent/30 to-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            How Dodo Works
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Finding and hiring talented women professionals has never been easier. 
            Follow these simple steps to connect with the perfect expert for your needs.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`flex flex-col items-center gap-8 md:flex-row ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Icon */}
                <div className="relative shrink-0">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
                    <step.icon className="h-12 w-12 text-primary" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className={`flex-1 text-center md:text-left ${index % 2 === 1 ? "md:text-right" : ""}`}>
                  <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Why Choose Dodo?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We make it safe and easy to find and work with talented professionals
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Browse our community of talented professionals and find the perfect match for your needs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/browse">
                Browse Professionals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <Link href="/join">Join as a Professional</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
