"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { MessageCircle } from "lucide-react";

interface ConversationListProps {
  userId: Id<"users">;
  selectedConversationId?: Id<"conversations">;
  onSelect: (conversationId: Id<"conversations">, otherUserId: Id<"users">) => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function ConversationList({
  userId,
  selectedConversationId,
  onSelect,
}: ConversationListProps) {
  const conversations = useQuery(api.chat.listConversations, { userId });

  if (!conversations) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl p-3">
            <div className="h-11 w-11 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-40 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="rounded-full bg-muted p-4">
          <MessageCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">No messages yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Visit a profile and tap Chat to start a conversation
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-0.5 p-2">
      {conversations.map((conv) => {
        const isSelected = conv._id === selectedConversationId;
        return (
          <li key={conv._id}>
            <button
              onClick={() =>
                conv.otherUser && onSelect(conv._id, conv.otherUser.id)
              }
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                isSelected
                  ? "bg-primary/10 text-foreground"
                  : "hover:bg-muted/60 text-foreground"
              )}
            >
              <div className="relative shrink-0">
                <Avatar className="h-11 w-11 border border-border">
                  <AvatarImage src={conv.otherUser?.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {conv.otherUser?.name?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator could go here */}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "truncate text-sm",
                      conv.unreadCount > 0
                        ? "font-semibold text-foreground"
                        : "font-medium text-foreground/80"
                    )}
                  >
                    {conv.otherUser?.name ?? "Unknown"}
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {timeAgo(conv.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p
                    className={cn(
                      "truncate text-xs",
                      conv.unreadCount > 0
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {conv.lastMessageText ?? "Start a conversation..."}
                  </p>
                  {conv.unreadCount > 0 && (
                    <Badge className="h-4 min-w-4 shrink-0 rounded-full px-1 text-[9px]">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
