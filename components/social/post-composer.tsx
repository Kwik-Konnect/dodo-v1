"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface PostComposerProps {
  onPosted?: () => void;
  placeholder?: string;
}

export function PostComposer({
  onPosted,
  placeholder = "What's on your mind?",
}: PostComposerProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPost = useMutation(api.posts.createPost);

  if (!user) return null;

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPost({
        authorId: user.id as Id<"users">,
        content: content.trim(),
      });
      setContent("");
      onPosted?.();
    } catch (err) {
      console.error("Failed to create post", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0 border border-border">
          <AvatarImage src={user.profile?.socialLinks?.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {user.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "min-h-[80px] resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/60"
            )}
            maxLength={500}
          />

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span
              className={cn(
                "text-xs",
                content.length > 450
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {content.length}/500
            </span>

            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="rounded-full gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
