'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/utils/cn'
import { Button } from '../ui/button'
import type { HTMLAttributes } from 'react'

export default function ThemeToggle({
  className,
}: Readonly<HTMLAttributes<HTMLButtonElement>>) {
  const { theme, setTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <Button
      className={cn(className)}
      size="icon"
      variant="outline"
      aria-label="Toggle theme"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
    >
      {isLight ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
