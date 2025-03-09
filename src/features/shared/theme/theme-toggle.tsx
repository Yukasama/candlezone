'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type HTMLAttributes, useEffect, useState } from 'react';

export const ThemeToggle = ({
  className,
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!theme || theme === 'system') {
      setTheme('system');
    }
  }, [theme, setTheme]);

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const isDark = mounted && resolvedTheme === 'dark';

  if (!mounted) {
    return (
      <Button
        aria-label="Toggle theme"
        className={cn(className, 'bg-background hidden md:flex')}
        size="icon"
        variant="ghost"
      >
        <Sun size={20} />
      </Button>
    );
  }

  return (
    <Button
      aria-label="Toggle theme"
      className={cn(className, 'bg-background hidden md:flex')}
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};
