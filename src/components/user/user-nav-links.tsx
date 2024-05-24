'use client'

import {
  LayoutDashboard,
  ListOrdered,
  Settings,
  Settings2,
  User as UserIcon,
} from 'lucide-react'
import { SheetClose } from '../ui/sheet'
import { Separator } from '../ui/separator'
import { User } from 'next-auth'
import Link from 'next/link'

interface Props {
  user: User
  isAdmin?: boolean
}

export default function UserNavLinks({ user, isAdmin }: Readonly<Props>) {
  const NAV_LINKS = [
    {
      label: 'My Profile',
      href: `/u/${user.id}`,
      icon: <UserIcon className="w-5 h-5 mr-2 text-purple" />,
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5 mr-2 text-purple" />,
    },
    {
      label: 'My Portfolios',
      href: '/portfolio',
      icon: <ListOrdered className="w-5 h-5 mr-2 text-purple" />,
      separator: true,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="w-5 h-5 mr-2 text-purple" />,
    },
  ]

  return (
    <>
      {isAdmin && (
        <>
          <SheetClose className="w-full" asChild>
            <Link
              href="/admin/dashboard"
              prefetch={false}
              className="flex items-center w-full h-9 p-1 mb-[1px] rounded-md px-4 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <Settings2 className="w-5 h-5 mr-2 text-purple" />
              <h2 className="text-[15px]">Stock Control</h2>
            </Link>
          </SheetClose>
          <Separator className="my-2" />
        </>
      )}

      {NAV_LINKS.map((link) => (
        <>
          <SheetClose key={link.label + 1} className="w-full" asChild>
            <Link
              href={link.href}
              className="flex items-center h-9 p-1 mb-[1px] rounded-md px-4 hover:bg-slate-100 dark:hover:bg-slate-900 w-full"
            >
              {link.icon}
              <h2 className="text-[15px]">{link.label}</h2>
            </Link>
          </SheetClose>
          {link.separator && <Separator className="my-2" />}
        </>
      ))}
    </>
  )
}
