"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConversationList } from "@/components/messages/conversation-list";
import { ChatWindow } from "@/components/messages/chat-window";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { Id } from "@/convex/_generated/dataModel";
import { MessageCircle, Search, X, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

function MessagesContent() {
  const { user } = useAuth();
  const [selectedConv, setSelectedConv] = useState<{
    id: Id<"conversations">;
    otherUser: { id: Id<"users">; name: string; avatarUrl?: string };
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const getOrCreate = useMutation(api.chat.getOrCreateConversation);
  const searchUsers = useQuery(api.auth.searchUsers, 
    searchQuery.trim() && showSearch ? { query: searchQuery.trim() } : "skip"
  );

  const handleSelectConversation = (
    convId: Id<"conversations">,
    otherUserId: Id<"users">
  ) => {
    // We already have the conversation data from the list
    setSelectedConv((prev) => {
      if (prev?.id === convId) return prev;
      return { id: convId, otherUser: { id: otherUserId, name: "..." } };
    });
  };

  const handleStartNewChat = async (foundUser: { id: Id<"users">; name: string; email: string; avatarUrl?: string }) => {
    if (foundUser.id === user?.id) {
      toast.error("You cannot start a chat with yourself");
      return;
    }

    setIsSearching(true);
    try {
      const result = await getOrCreate({
        userId: user.id as Id<"users">,
        participantId: foundUser.id,
      });

      setSelectedConv({
        id: result.conversationId,
        otherUser: {
          id: foundUser.id,
          name: foundUser.name,
          avatarUrl: foundUser.avatarUrl,
        },
      });
      
      setShowSearch(false);
      setSearchQuery("");
      toast.success(`Started chat with ${foundUser.name}`);
    } catch (error) {
      toast.error("Failed to start chat. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearch(false);
  };

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-3.5rem-4rem)] lg:h-[calc(100vh-3.5rem)]">
      {/* Mobile: Full-screen conversation list when no chat selected */}
      {/* Desktop: Sidebar always visible */}
      <div className={cn(
        "flex h-full flex-col border-r border-border bg-card",
        "w-full lg:w-80 lg:min-w-[18rem]",
        selectedConv && "hidden lg:flex"
      )}>
        {/* Header with search */}
        <div className="flex flex-col border-b border-border bg-card">
          <div className="flex items-center gap-2 px-4 py-3.5">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h1 className="text-base font-bold text-foreground">Messages</h1>
          </div>
          
          {/* Search bar */}
          <div className="px-4 pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by email or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                className="pl-10 pr-10 h-9 text-sm rounded-full bg-muted/60 border-border"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </form>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {showSearch ? (
            <SearchResults
              searchUsers={searchUsers}
              isLoading={!searchUsers}
              onStartChat={handleStartNewChat}
              isSearching={isSearching}
              clearSearch={clearSearch}
            />
          ) : (
            <ConversationList
              userId={user.id as Id<"users">}
              selectedConversationId={selectedConv?.id}
              onSelect={(convId, otherUserId) => {
                handleSelectConversation(convId, otherUserId);
              }}
            />
          )}
        </div>
      </div>

      {/* Chat window - full screen on mobile, sidebar on desktop */}
      <div className={cn(
        "flex h-full flex-col",
        !selectedConv && "hidden lg:flex"
      )}>
        {selectedConv ? (
          <ChatWindow
            conversationId={selectedConv.id}
            otherUser={selectedConv.otherUser}
            onBack={() => setSelectedConv(null)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center p-4 lg:p-8">
            <div className="rounded-full bg-muted p-4 lg:p-6">
              <MessageCircle className="h-8 w-8 lg:h-10 lg:w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              Your messages
            </h3>
            <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
              Select a conversation or start a new one from any profile page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Search Results Component
function SearchResults({ 
  searchUsers, 
  isLoading, 
  onStartChat, 
  isSearching,
  clearSearch 
}: {
  searchUsers: any[] | undefined;
  isLoading: boolean;
  onStartChat: (user: any) => void;
  isSearching: boolean;
  clearSearch: () => void;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl p-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!searchUsers || searchUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <UserPlus className="h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">No users found</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try searching with a different email or phone number
        </p>
        <Button variant="outline" size="sm" className="mt-3 rounded-full" onClick={clearSearch}>
          Clear search
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 py-2 border-b border-border">
        <p className="text-xs text-muted-foreground">
          {searchUsers.length} user{searchUsers.length !== 1 ? 's' : ''} found
        </p>
      </div>
      <div className="flex flex-col p-2">
        {searchUsers.map((foundUser) => (
          <div
            key={foundUser.id}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={foundUser.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {foundUser.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {foundUser.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {foundUser.email}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartChat(foundUser)}
              disabled={isSearching}
              className="h-8 px-3 rounded-full text-xs"
            >
              {isSearching ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                "Chat"
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}
