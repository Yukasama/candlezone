'use client'

import { Separator } from '@/components/ui/separator'
import { SheetClose } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  ListOrdered,
  Settings,
  Settings2,
  User as UserIcon,
} from 'lucide-react'
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
      icon: <UserIcon className="mr-2" size={20} />,
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="mr-2" size={20} />,
    },
    {
      label: 'My Portfolios',
      href: '/portfolio',
      icon: <ListOrdered className="mr-2" size={20} />,
      separator: true,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="mr-2" size={20} />,
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
              className="mb-[1px] flex h-9 w-full items-center rounded-md p-1 px-4 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <Settings2 className="mr-2 h-5 w-5" />
              <h2 className="text-[15px]">Stock Control</h2>
            </Link>
          </SheetClose>
          <Separator className="my-2" />
        </>
      )}

      {NAV_LINKS.map((link) => (
        <div key={link.href}>
          <SheetClose className="w-full" asChild>
            <Link
              href={link.href}
              className="mb-[1px] flex h-9 w-full items-center rounded-md p-1 px-4 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              {link.icon}
              <h2 className="text-[15px]">{link.label}</h2>
            </Link>
          </SheetClose>
          {link.separator && <Separator className="my-2" />}
        </div>
      ))}
    </>
  )
}
