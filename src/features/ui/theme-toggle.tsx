"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  function toggleTheme() {
    if (theme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return (
    <Button onClick={toggleTheme} size="icon" variant="outline">
      {theme == "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
