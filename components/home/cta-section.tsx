import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-secondary via-primary to-accent py-16 md:py-20">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/15 blur-[100px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-primary-foreground">
              <Sparkles className="h-4 w-4" />
              Join our community
            </div>
            <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl md:text-4xl">
              Want to Be Discovered?
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base text-primary-foreground/80 sm:text-lg">
              Share your vibe, connect with interesting people, and earn on your terms with Dodo.
              Join thousands of amazing women already on the platform.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button
              size="lg"
              className="rounded-full bg-white px-8 font-semibold text-primary shadow-xl hover:bg-white/90"
              asChild
            >
              <Link href="/join">
                Create Your Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full border-2 border-white/30 px-8 font-semibold text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
