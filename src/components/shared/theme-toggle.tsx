"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";

export default function ThemeToggle({
  className,
}: React.HTMLAttributes<HTMLButtonElement>) {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <Button
      className={cn(className)}
      size="sm"
      variant="flat"
      isIconOnly
      aria-label="Toggle theme"
      startContent={isLight ? <Sun size={18} /> : <Moon size={18} />}
      onClick={() => setTheme(isLight ? "dark" : "light")}
    />
  );
}
