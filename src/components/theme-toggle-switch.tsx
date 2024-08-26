'use client';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { type HTMLAttributes } from 'react';
import { Switch } from './ui/switch';

export const ThemeToggleSwitch = ({
  className,
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Switch
      className={cn(className)}
      aria-label="Toggle theme"
      checked={isDark}
      onCheckedChange={() => setTheme(isDark ? 'light' : 'dark')}
    />
  );
};
