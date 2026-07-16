"use client";

import * as React from "react";
import {
  MoonIcon as Moon,
  SunIcon as Sun,
} from "@radix-ui/react-icons";

import { Button } from "@repo/ui/button";

/** Reads/writes the `.dark` class on <html> and persists the choice. */
export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ignore write failures (private mode, disabled storage)
    }
    setIsDark(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

/**
 * Runs before paint to set the initial theme from storage / OS preference,
 * avoiding a flash of the wrong theme. Injected as a blocking inline script.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
