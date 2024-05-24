'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface Props {
  id: string
  label: string
  icon: ReactNode
}

export const SettingsItem = ({ id, label, icon }: Readonly<Props>) => {
  const pathname = usePathname()

  return (
    <Link
      key={id}
      href={`/settings/${id === 'settings' ? '' : id}`}
      className={`text-md flex gap-3 p-1.5 px-3 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/50 items-center ${
        pathname.split('/').pop() === id && 'bg-slate-100 dark:bg-slate-800'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
