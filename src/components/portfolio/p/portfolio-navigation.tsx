'use client'

import { buttonVariants } from '@/components/ui/button'
import { BarChart2, LayoutDashboard, PieChart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  portfolioId: string
}

export default function PortfolioNavigation({ portfolioId }: Readonly<Props>) {
  const pathname = usePathname()

  const PORTFOLIO_LINKS = [
    {
      title: 'Overview',
      href: `/p/${portfolioId}`,
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: 'Performance',
      href: `/p/${portfolioId}/performance`,
      icon: <BarChart2 size={20} />,
    },
    {
      title: 'Statistics',
      href: `/p/${portfolioId}/statistics`,
      icon: <PieChart size={20} />,
    },
  ]

  return (
    <div className="flex gap-2">
      {PORTFOLIO_LINKS.map((link) => (
        <Link
          className={buttonVariants({
            variant: pathname === link.href ? 'default' : 'secondary',
          })}
          key={link.title}
          aria-label={link.title}
          href={link.href}
        >
          {link.icon}
          {link.title}
        </Link>
      ))}
    </div>
  )
}
