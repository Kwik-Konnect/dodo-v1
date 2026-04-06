"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Menu, User, Bell, MessageCircle, CheckCheck } from "lucide-react";
import { getCategories } from "@/lib/data";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function NotificationBell({ userId }: { userId: Id<"users"> }) {
  const unreadCount = useQuery(api.notifications.getUnreadCount, { userId });
  const notifications = useQuery(api.notifications.listNotifications, { userId });
  const markAllRead = useMutation(api.notifications.markAllRead);

  const count = unreadCount ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-bold text-secondary-foreground">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground"
              onClick={() => markAllRead({ userId })}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {!notifications || notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={cn(
                  "flex items-start gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-muted/50",
                  !n.isRead && "bg-primary/5"
                )}
              >
                <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {n.actor?.name?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">{n.message}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!n.isRead && (
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                )}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MessageBadge({ userId }: { userId: Id<"users"> }) {
  const unread = useQuery(api.chat.getTotalUnreadCount, { userId });
  const count = unread ?? 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
      asChild
    >
      <Link href="/messages">
        <MessageCircle className="h-[18px] w-[18px]" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const categories = getCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Mobile Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/25">
            <span className="text-base font-bold text-primary-foreground">D</span>
          </div>
          <span className="text-lg font-bold text-foreground">Dodo</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-lg sm:flex">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search professionals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-border bg-muted/60 pl-10 pr-4 text-sm placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-background"
            />
          </div>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {user ? (
            <>
              {/* Live message count */}
              <MessageBadge userId={user.id as Id<"users">} />
              {/* Live notification count */}
              <NotificationBell userId={user.id as Id<"users">} />
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full text-muted-foreground" asChild>
                <Link href="/messages">
                  <MessageCircle className="h-[18px] w-[18px]" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full text-muted-foreground">
                <Bell className="h-[18px] w-[18px]" />
              </Button>
            </>
          )}

          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border-2 border-primary/30">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {user.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/feeds">
                    <Bell className="mr-2 h-4 w-4" />
                    Feed
                  </Link>
                </DropdownMenuItem>
                {user.isProfessional && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="hidden rounded-full px-4 text-xs font-semibold sm:inline-flex"
                asChild
              >
                <Link href="/auth">Sign Up</Link>
              </Button>
              <Button
                size="sm"
                className="hidden rounded-full px-5 text-xs font-semibold sm:inline-flex"
                asChild
              >
                <Link href="/auth">Login</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] border-border bg-sidebar p-0 text-sidebar-foreground">
              <SheetHeader className="border-b border-sidebar-border p-4">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <span className="text-sm font-bold text-primary-foreground">D</span>
                  </div>
                  Dodo
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-3">
                <form onSubmit={(e) => { handleSearch(e); setIsOpen(false); }} className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg bg-muted/50 pl-10 pr-4 text-sm"
                    />
                  </div>
                </form>

                <Link href="/" className="rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground" onClick={() => setIsOpen(false)}>Home</Link>
                <Link href="/browse" className="rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground" onClick={() => setIsOpen(false)}>Browse</Link>
                <Link href="/feeds" className="rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground" onClick={() => setIsOpen(false)}>Feed</Link>
                <Link href="/messages" className="rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground" onClick={() => setIsOpen(false)}>Messages</Link>
                <Link href="/how-it-works" className="rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground" onClick={() => setIsOpen(false)}>How It Works</Link>

                <div className="my-2 border-t border-sidebar-border" />
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/browse?category=${category.id}`}
                    className="rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}

                <div className="mt-auto border-t border-sidebar-border pt-4">
                  {user ? (
                    <>
                      <Button variant="outline" className="w-full rounded-lg" asChild>
                        <Link href="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
                      </Button>
                      <Button variant="outline" className="mt-2 w-full rounded-lg" asChild>
                        <Link href="/settings" onClick={() => setIsOpen(false)}>Settings</Link>
                      </Button>
                      <Button variant="ghost" className="mt-2 w-full rounded-lg text-muted-foreground" onClick={() => { signOut(); setIsOpen(false); }}>
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full rounded-lg" asChild>
                      <Link href="/auth" onClick={() => setIsOpen(false)}>Login / Sign Up</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
