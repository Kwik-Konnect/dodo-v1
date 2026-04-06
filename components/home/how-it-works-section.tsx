import { Search, UserCheck, Calendar, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover & Swipe",
    description:
      "Browse profiles, swipe through matches, and find someone who vibes with you. Filter by interests, location, and more.",
  },
  {
    icon: UserCheck,
    title: "View Profiles & Stories",
    description:
      "Check out detailed profiles with photos, interests, stories, and reviews. Get a feel for who they really are.",
  },
  {
    icon: Calendar,
    title: "Chat & Book",
    description:
      "Start a conversation, plan a hangout or date, and book time together with secure payments.",
  },
  {
    icon: Star,
    title: "Meet & Rate",
    description:
      "Meet up, have a great time, and leave a review to help the community.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-secondary/10 blur-[100px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How Dodo Works
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Meeting new people and booking hangouts is simple
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Step Number */}
              <span className="absolute -top-3 left-5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30">
                {index + 1}
              </span>

              {/* Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <step.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="mt-3.5 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
