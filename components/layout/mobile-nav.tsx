"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Home, Search, Film, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Id } from "@/convex/_generated/dataModel";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Discover", icon: Search },
  { href: "/shorts", label: "Shorts", icon: Film },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];

function MessagesTabBadge({ userId }: { userId: Id<"users"> }) {
  const unread = useQuery(api.chat.getTotalUnreadCount, { userId });
  if (!unread || unread === 0) return null;
  return (
    <span className="absolute -top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[8px] font-bold text-white">
      {unread > 99 ? "99+" : unread}
    </span>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-sidebar/95 backdrop-blur-lg lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon
                className={cn("h-5 w-5", isActive ? "text-primary" : "")}
              />
              {tab.label}
              {tab.label === "Messages" && user && (
                <MessagesTabBadge userId={user.id as Id<"users">} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
