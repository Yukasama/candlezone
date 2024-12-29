'use client';

import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { HTMLAttributes } from 'react';

export const ThemeToggleSwitch = ({
  className,
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      Toggle Theme
      <Switch
        className={cn(className)}
        aria-label="Toggle theme"
        checked={isDark}
        onCheckedChange={() => {
          setTheme(isDark ? 'light' : 'dark');
        }}
      />
    </>
  );
};
