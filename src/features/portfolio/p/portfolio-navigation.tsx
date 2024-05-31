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

  const portfolioLinks = [
    {
      title: 'Overview',
      href: `/p/${portfolioId}`,
      icon: <LayoutDashboard size={18} />,
    },
    {
      title: 'Performance',
      href: `/p/${portfolioId}/performance`,
      icon: <BarChart2 size={18} />,
    },
    {
      title: 'Statistics',
      href: `/p/${portfolioId}/statistics`,
      icon: <PieChart size={18} />,
    },
  ]

  return (
    <div className="flex gap-2">
      {portfolioLinks.map((link) => (
        <Link
          className={buttonVariants({
            size: 'sm',
            variant: pathname === link.href ? 'default' : 'secondary',
          })}
          key={link.title}
          aria-label={link.title}
          href={link.href}
        >
          {link.icon}
          <p className="text-sm">{link.title}</p>
        </Link>
      ))}
    </div>
  )
}
