'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type HTMLAttributes, useEffect, useState } from 'react';

export const ThemeToggle = ({
  className,
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const isDark = theme === 'dark';

  return (
    <Button
      aria-label="Toggle theme"
      className={cn(className, 'bg-background hidden md:flex')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      size="icon"
      variant="ghost"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};
