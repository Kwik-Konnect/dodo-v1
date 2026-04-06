"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/contexts/auth-context";

interface ChatWindowProps {
  conversationId: Id<"conversations">;
  otherUser: {
    id: Id<"users">;
    name: string;
    avatarUrl?: string;
  };
  onBack?: () => void;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatWindow({ conversationId, otherUser, onBack }: ChatWindowProps) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Real-time messages via Convex reactive query (WebSocket backed)
  const messages = useQuery(api.chat.listMessages, { conversationId });
  const sendMessage = useMutation(api.chat.sendMessage);
  const markRead = useMutation(api.chat.markMessagesRead);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (user) {
      markRead({
        conversationId,
        userId: user.id as Id<"users">,
      }).catch(console.error);
    }
  }, [conversationId, user?.id, messages?.length]);

  const handleSend = async () => {
    if (!input.trim() || !user || isSending) return;

    const text = input.trim();
    setInput("");
    setIsSending(true);

    try {
      await sendMessage({
        conversationId,
        senderId: user.id as Id<"users">,
        content: text,
      });
    } catch (err) {
      console.error("Failed to send message", err);
      setInput(text); // restore on error
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 rounded-full lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-9 w-9 border border-border">
          <AvatarImage src={otherUser.avatarUrl} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {otherUser.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">{otherUser.name}</p>
          <p className="text-xs text-muted-foreground">Active recently</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {!messages ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarImage src={otherUser.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {otherUser.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="mt-3 text-sm font-medium text-foreground">
              {otherUser.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Say hello to start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isOwn = msg.senderId === user?.id;
              const prevMsg = messages[i - 1];
              const showAvatar =
                !isOwn &&
                (!prevMsg || prevMsg.senderId !== msg.senderId);

              return (
                <div
                  key={msg._id}
                  className={cn(
                    "flex items-end gap-2",
                    isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  {!isOwn && (
                    <div className="w-7 shrink-0">
                      {showAvatar && (
                        <Avatar className="h-7 w-7 border border-border">
                          <AvatarImage src={otherUser.avatarUrl} />
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {otherUser.name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}

                  <div
                    className={cn(
                      "group flex flex-col gap-0.5 max-w-[70%]",
                      isOwn && "items-end"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                        isOwn
                          ? "rounded-br-sm bg-primary text-primary-foreground"
                          : "rounded-bl-sm bg-muted text-foreground"
                      )}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity px-1">
                      {formatTime(msg.createdAt)}
                      {isOwn && (
                        <span className="ml-1">
                          {msg.isRead ? "·· Read" : "· Sent"}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="rounded-full bg-muted/60 border-border text-sm"
            maxLength={1000}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="h-9 w-9 shrink-0 rounded-full"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
