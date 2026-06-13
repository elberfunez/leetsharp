import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("leetsharp-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    localStorage.setItem("leetsharp-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return [theme, setThemeState];
}
