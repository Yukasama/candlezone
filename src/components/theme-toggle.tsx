'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState, type HTMLAttributes } from 'react'

export const ThemeToggle = ({
  className,
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button
        className={cn(className)}
        size="icon"
        variant="outline"
        aria-label="Toggle theme"
      >
        <Sun size={18} />
      </Button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <Button
      className={cn(className)}
      size="icon"
      variant="outline"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
