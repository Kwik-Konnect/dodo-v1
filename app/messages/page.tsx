"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConversationList } from "@/components/messages/conversation-list";
import { ChatWindow } from "@/components/messages/chat-window";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { Id } from "@/convex/_generated/dataModel";
import { MessageCircle } from "lucide-react";

function MessagesContent() {
  const { user } = useAuth();
  const [selectedConv, setSelectedConv] = useState<{
    id: Id<"conversations">;
    otherUser: { id: Id<"users">; name: string; avatarUrl?: string };
  } | null>(null);

  const getOrCreate = useMutation(api.chat.getOrCreateConversation);

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

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-3.5rem-4rem)] lg:h-[calc(100vh-3.5rem)]">
      {/* Sidebar — conversation list always visible */}
      <div className="flex h-full w-80 min-w-[18rem] flex-col border-r border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h1 className="text-base font-bold text-foreground">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            userId={user.id as Id<"users">}
            selectedConversationId={selectedConv?.id}
            onSelect={(convId, otherUserId) => {
              handleSelectConversation(convId, otherUserId);
            }}
          />
        </div>
      </div>

      {/* Chat window */}
      <div className="flex h-full flex-1 flex-col">
        {selectedConv ? (
          <ChatWindow
            conversationId={selectedConv.id}
            otherUser={selectedConv.otherUser}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center p-8">
            <div className="rounded-full bg-muted p-6">
              <MessageCircle className="h-10 w-10 text-muted-foreground" />
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

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}
