"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Star,
  HelpCircle,
  Mail,
  Download,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Search, badge: "!" },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/blacklisted", label: "Blacklisted", icon: Ban },
  { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[200px] flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
          <span className="text-lg font-bold text-primary-foreground">D</span>
        </div>
        <span className="text-xl font-bold text-sidebar-foreground">Dodo</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href.split("?")[0]) &&
                  item.href !== "/";
            return (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/15 text-primary shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0",
                      isActive ? "text-primary" : ""
                    )}
                  />
                  {item.label}
                  {(item as any).badge && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {(item as any).badge}
                    </span>
                  )}
                  {(item as any).dot && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-primary"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom CTA */}
      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/join"
          className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <Download className="h-4 w-4" />
          Create Profile
        </Link>
      </div>
    </aside>
  );
}
