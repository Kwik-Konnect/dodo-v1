"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function StoriesSection() {
  const allPros = useQuery(api.professionals.listProfessionals, {});
  const onlineUsers = allPros?.filter((p) => p.isOnline || p.isLive) ?? [];

  if (!allPros || onlineUsers.length === 0) return null;

  return (
    <section className="border-b border-border py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* View More */}
          <div className="flex items-end gap-2">
            <Link href="/browse" className="text-sm font-medium text-primary hover:underline whitespace-nowrap">
              View More →
            </Link>
          </div>

          <div className="flex gap-3 pl-2">
            {onlineUsers.map((user) => (
              <Link
                key={user.id}
                href={`/professional/${user.id}`}
                className="group flex shrink-0 flex-col items-center gap-1"
              >
                <div className="relative">
                  <div
                    className={`h-16 w-16 rounded-full p-[2px] ${
                      user.isLive
                        ? "bg-gradient-to-br from-primary via-accent to-primary"
                        : "bg-gradient-to-br from-primary to-primary/60"
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full rounded-full border-2 border-sidebar object-cover"
                    />
                  </div>
                  {/* LIVE / Online badge */}
                  {user.isLive ? (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-destructive px-1.5 py-0.5 text-[8px] font-bold uppercase text-white shadow-lg">
                      LIVE
                    </span>
                  ) : (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-sidebar bg-primary"></span>
                  )}
                </div>
                <span className="max-w-[64px] truncate text-[10px] text-muted-foreground group-hover:text-foreground">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
