'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type HTMLAttributes, useEffect, useState } from 'react';

export const ThemeToggle = ({
  className,
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        className={cn(className, 'bg-background hidden md:flex')}
        size="icon"
        variant="ghost"
        aria-label="Toggle theme"
      >
        <Sun size={20} />
      </Button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <Button
      className={cn(className, 'bg-background hidden md:flex')}
      size="icon"
      variant="ghost"
      aria-label="Toggle theme"
      onClick={() => {
        setTheme(isDark ? 'light' : 'dark');
      }}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};
