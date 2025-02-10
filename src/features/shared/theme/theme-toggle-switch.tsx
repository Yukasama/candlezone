'use client';

import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { HTMLAttributes } from 'react';

export const ThemeToggleSwitch = ({
  className,
}: Readonly<HTMLAttributes<HTMLButtonElement>>) => {
  const { setTheme, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      Toggle Theme
      <Switch
        aria-label="Toggle theme"
        checked={isDark}
        className={className}
        onCheckedChange={(checked) => {
          setTheme(checked ? 'dark' : 'light');
        }}
      />
    </div>
  );
};
