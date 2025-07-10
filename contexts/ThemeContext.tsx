'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
type ThemeOption = Theme | "default";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: ThemeOption) => void;
}>({
  theme: "light",
  setTheme: () => {},
});

export default function ThemeContextProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const systemTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const preferredTheme = savedTheme || systemTheme;

    setThemeState(preferredTheme);

    // Reset class first, then apply
    document.documentElement.classList.remove("dark");
    if (preferredTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const changeTheme = (newTheme: ThemeOption) => {
    if (newTheme === "default") {
      const systemTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setThemeState(systemTheme);

      document.documentElement.classList.remove("dark");
      if (systemTheme === "dark") {
        document.documentElement.classList.add("dark");
      }

      localStorage.removeItem("theme");
    } else {
      setThemeState(newTheme);

      document.documentElement.classList.remove("dark");
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      }

      localStorage.setItem("theme", newTheme);
    }
  };

  const value = useMemo(() => ({
    theme,
    setTheme: changeTheme
  }), [theme]);

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
