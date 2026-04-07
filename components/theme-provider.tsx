"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = string;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = {
  children: React.ReactNode;
  defaultTheme: Theme;
  themes: Theme[];
};

const STORAGE_KEY = "theme";
const FAVICONS: Record<string, string> = {
  sage: "/sage-light-logo.png",
  "sun-olive": "/sun-and-olive-light-logo.png",
  molten: "/molten-light-logo.png",
};

export function ThemeProvider({ children, defaultTheme, themes }: Props) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Hydrate from localStorage once mounted
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && themes.includes(stored)) {
      setThemeState(stored);
    } else {
      setThemeState(defaultTheme);
    }
  }, [defaultTheme, themes]);

  // Apply to document attribute and persist
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);

    const favicon = FAVICONS[theme] ?? FAVICONS[defaultTheme] ?? "/favicon.ico";
    const rels = ["icon", "shortcut icon"];
    rels.forEach((rel) => {
      let link = document.querySelector<HTMLLinkElement>(`link[rel='${rel}']`);
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.type = "image/png";
      link.href = favicon;
    });
    // Apple touch icon
    let apple = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
    if (!apple) {
      apple = document.createElement("link");
      apple.rel = "apple-touch-icon";
      document.head.appendChild(apple);
    }
    apple.href = favicon;
  }, [theme, defaultTheme]);

  const value = useMemo(
    () => ({ theme, setTheme: setThemeState, themes }),
    [theme, themes]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
