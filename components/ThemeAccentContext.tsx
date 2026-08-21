"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AccentColor = "red" | "purple" | "cyan" | "amber";

interface AccentConfig {
  name: string;
  primary: string;
  hover: string;
  gradient: string;
  shadow: string;
  border: string;
}

export const ACCENTS: Record<AccentColor, AccentConfig> = {
  red: {
    name: "Crimson Red",
    primary: "#e50914",
    hover: "#dc2626",
    gradient: "from-red-600 to-rose-700",
    shadow: "shadow-red-600/30",
    border: "border-red-500/40",
  },
  purple: {
    name: "Cyberpunk Purple",
    primary: "#8b5cf6",
    hover: "#7c3aed",
    gradient: "from-purple-600 to-indigo-700",
    shadow: "shadow-purple-600/30",
    border: "border-purple-500/40",
  },
  cyan: {
    name: "Neon Cyan",
    primary: "#06b6d4",
    hover: "#0891b2",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/30",
    border: "border-cyan-500/40",
  },
  amber: {
    name: "Amber Gold",
    primary: "#f59e0b",
    hover: "#d97706",
    gradient: "from-amber-500 to-yellow-600",
    shadow: "shadow-amber-500/30",
    border: "border-amber-500/40",
  },
};

interface ThemeAccentContextType {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  accentConfig: AccentConfig;
}

const ThemeAccentContext = createContext<ThemeAccentContextType>({
  accent: "red",
  setAccent: () => {},
  accentConfig: ACCENTS.red,
});

export const ThemeAccentProvider = ({ children }: { children: React.ReactNode }) => {
  const [accent, setAccentState] = useState<AccentColor>("red");

  useEffect(() => {
    const saved = localStorage.getItem("filmzy_accent") as AccentColor;
    if (saved && ACCENTS[saved]) {
      setAccentState(saved);
      document.documentElement.setAttribute("data-accent", saved);
    }
  }, []);

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    localStorage.setItem("filmzy_accent", newAccent);
    document.documentElement.setAttribute("data-accent", newAccent);
  };

  return (
    <ThemeAccentContext.Provider
      value={{
        accent,
        setAccent,
        accentConfig: ACCENTS[accent] || ACCENTS.red,
      }}
    >
      {children}
    </ThemeAccentContext.Provider>
  );
};

export const useThemeAccent = () => useContext(ThemeAccentContext);
