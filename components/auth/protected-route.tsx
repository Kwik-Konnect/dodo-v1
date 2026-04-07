"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireProfessional?: boolean;
}

export function ProtectedRoute({ children, requireProfessional = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/auth?returnTo=${returnTo}`);
      } else if (requireProfessional && !user.isProfessional) {
        router.push("/");
      }
    }
  }, [user, isLoading, router, requireProfessional]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  if (requireProfessional && !user.isProfessional) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
