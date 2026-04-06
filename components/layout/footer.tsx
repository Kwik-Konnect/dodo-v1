import Link from "next/link";
import { Heart } from "lucide-react";

const footerLinks = {
  forClients: {
    title: "For Clients",
    links: [
      { label: "Browse Professionals", href: "/browse" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Trust & Safety", href: "/trust-safety" },
    ],
  },
  forProfessionals: {
    title: "For Professionals",
    links: [
      { label: "Join Dodo", href: "/join" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Resources", href: "/resources" },
    ],
  },
  categories: {
    title: "Categories",
    links: [
      { label: "Beauty & Wellness", href: "/browse?category=beauty-wellness" },
      { label: "Healthcare", href: "/browse?category=healthcare" },
      { label: "Creative Services", href: "/browse?category=creative" },
      { label: "Home Services", href: "/browse?category=home-services" },
      { label: "Tech Services", href: "/browse?category=tech" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-sidebar">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
                <span className="text-lg font-bold text-primary-foreground">D</span>
              </div>
              <span className="text-xl font-bold text-foreground">Dodo</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Connecting you with talented women professionals across the globe.
            </p>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:mt-12 md:flex-row">
          <p className="order-2 text-sm text-muted-foreground md:order-1">
            &copy; {new Date().getFullYear()} Dodo. All rights reserved.
          </p>
          <div className="order-1 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:order-2">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              Made with <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
