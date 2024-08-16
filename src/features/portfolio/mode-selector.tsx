'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { loadPortfolioLinks } from '@/config/load-portfolio-links'
import { ChevronsUpDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const ModeSelector = ({ portfolioId }: { portfolioId: string }) => {
  const pathname = usePathname()

  const currentTag = pathname.split('/').pop()
  const currentMode = currentTag === portfolioId ? 'overview' : currentTag
  const links = loadPortfolioLinks(portfolioId)

  return (
    <Popover>
      <PopoverTrigger asChild className="f-center">
        <Button
          size="icon-sm"
          variant={
            currentMode === 'overview'
              ? 'horizon'
              : currentMode === 'performance'
                ? 'success'
                : currentMode === 'analyze'
                  ? 'mythic'
                  : 'secondary'
          }
        >
          {links.find(({ href }) => href === pathname)?.title}
          <ChevronsUpDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="f-col w-32 p-0">
        {links.map(({ title, href }) => (
          <Link
            className="f-box hover:bg-faded h-8 border-b text-[15px]"
            key={title}
            href={href}
          >
            {title}
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  )
}
