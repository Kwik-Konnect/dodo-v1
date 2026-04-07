"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  priority?: boolean;
  alt?: string;
};

const LOGO_BY_THEME: Record<string, string> = {
  sage: "/sage-light-logo.png",
  "sun-olive": "/sun-and-olive-light-logo.png",
  molten: "/molten-light-logo.png",
};

export function ThemeLogo({ className, priority = false, alt = "Dodo logo" }: Props) {
  const { theme } = useTheme();

  const src = useMemo(() => {
    return LOGO_BY_THEME[theme] ?? LOGO_BY_THEME["sage"];
  }, [theme]);

  return (
    <Image
      src={src}
      alt={alt}
      width={140}
      height={36}
      className={cn("h-9 w-auto object-contain", className)}
      priority={priority}
    />
  );
}
