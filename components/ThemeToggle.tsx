"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="text-sm px-3 py-1.5 rounded-full border transition-colors"
      style={{
        borderColor: "var(--border)",
        color: "var(--text-muted)",
        backgroundColor: "transparent",
      }}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
