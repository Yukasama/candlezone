'use client'

import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  ChartNetwork,
  LayoutDashboard,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface Props {
  portfolioId: string
}

export default function PortfolioNavigation({ portfolioId }: Readonly<Props>) {
  const pathname = usePathname()
  const [open, setOpen] = useState(true)

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
      title: 'Analytics',
      href: `/p/${portfolioId}/analytics`,
      icon: <ChartNetwork size={18} />,
    },
    {
      title: 'Settings',
      href: `/p/${portfolioId}/settings`,
      icon: <Settings size={18} />,
    },
  ]

  return (
    <div
      className={`f-col relative h-screen w-16 gap-[5px] border-r p-3.5 ${open ? 'md:px-4.5 md:w-80' : 'items-center'}`}
    >
      <Button
        size="icon"
        variant="outline"
        className={`mb-1.5 self-center ${open && 'lg:self-end'}`}
        onClick={() => setOpen(!open)}
      >
        {open ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
      </Button>
      {portfolioLinks.map((link) => (
        <Link
          key={link.title}
          className={`f-box h-8 items-center gap-2 rounded-md p-1 px-2 text-gray-400 hover:text-black dark:hover:text-gray-100 md:justify-start ${pathname === link.href && 'bg-faded text-black dark:text-gray-100'}`}
          href={link.href}
        >
          {link.icon}
          <p className={`hidden ${open && 'md:flex'}`}>{link.title}</p>
        </Link>
      ))}
    </div>
  )
}
