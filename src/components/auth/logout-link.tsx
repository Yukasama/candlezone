'use client'

import { logout } from '@/actions/auth/logout'
import { LogOut } from 'lucide-react'

export const LogoutLink = () => {
  return (
    <button
      onClick={() => logout()}
      aria-label="Sign Out"
      className="flex w-full items-center h-9 p-1 rounded-md px-4 hover:bg-slate-100 dark:hover:bg-slate-900"
    >
      <LogOut size={20} className="mr-2 text-purple" />
      <h2 className="text-[15px]">Sign Out</h2>
    </button>
  )
}
