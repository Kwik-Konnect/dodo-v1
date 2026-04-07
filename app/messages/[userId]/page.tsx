"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChatWindow } from "@/components/messages/chat-window";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ userId: string }>;
}

function DirectMessageContent({ targetUserId }: { targetUserId: string }) {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getOrCreate = useMutation(api.chat.getOrCreateConversation);
  const targetUser = useQuery(
    api.auth.getUserById,
    targetUserId ? (targetUserId as Id<"users">) : "skip"
  );

  useEffect(() => {
    if (user && targetUserId) {
      getOrCreate({
        userId: user.id as Id<"users">,
        participantId: targetUserId as Id<"users">,
      })
        .then((result) => setConversationId(result.conversationId))
        .catch(console.error);
    }
  }, [user?.id, targetUserId]);

  if (!conversationId || !targetUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const content = (
    <div className="h-screen">
      <ChatWindow
        conversationId={conversationId}
        otherUser={{
          id: targetUser.id as Id<"users">,
          name: targetUser.name,
        }}
        onBack={() => window.history.back()}
      />
    </div>
  );

  // Only apply fixed positioning on client-side to avoid hydration issues
  if (!isMounted) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {content}
    </div>
  );
}

export default function DirectMessagePage({ params }: PageProps) {
  const { userId } = use(params);

  return (
    <ProtectedRoute>
      <DirectMessageContent targetUserId={userId} />
    </ProtectedRoute>
  );
}
