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
  }, [theme]);

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
