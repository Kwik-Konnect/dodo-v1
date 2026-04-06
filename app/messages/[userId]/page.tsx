"use client";

import { use, useEffect, useState } from "react";
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
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

  const getOrCreate = useMutation(api.chat.getOrCreateConversation);
  const targetUser = useQuery(
    api.auth.getUserById,
    { userId: targetUserId as Id<"users"> }
  );

  useEffect(() => {
    if (!user) return;

    getOrCreate({
      userId: user.id as Id<"users">,
      participantId: targetUserId as Id<"users">,
    })
      .then((result) => setConversationId(result.conversationId))
      .catch(console.error);
  }, [user?.id, targetUserId]);

  if (!conversationId || !targetUser) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem-4rem)] lg:h-[calc(100vh-3.5rem)]">
      <ChatWindow
        conversationId={conversationId}
        otherUser={{
          id: targetUser.id as Id<"users">,
          name: targetUser.name,
        }}
      />
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
