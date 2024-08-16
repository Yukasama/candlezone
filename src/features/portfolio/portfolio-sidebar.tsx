'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { loadPortfolioLinks } from '@/config/load-portfolio-links'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  portfolioId: string
}

export const PortfolioSidebar = ({ portfolioId }: Readonly<Props>) => {
  const pathname = usePathname()
  const links = loadPortfolioLinks(portfolioId)

  return (
    <div className="f-col relative w-16 items-center gap-[5px] border-r p-3.5">
      <TooltipProvider>
        {links.map((link) => (
          <Tooltip key={link.title}>
            <TooltipTrigger asChild>
              <Link
                className={cn(
                  'f-box h-8 gap-2 rounded-md p-1 px-2 text-gray-400 hover:text-black dark:hover:text-gray-100',
                  pathname === link.href &&
                    'bg-faded text-black dark:text-gray-100',
                )}
                href={link.href}
              >
                {link.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{link.title}</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
