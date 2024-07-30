'use client'

import { logout } from '@/actions/auth/logout'
import { LogOut } from 'lucide-react'

export const LogoutLink = () => {
  return (
    <button
      onClick={() => logout()}
      aria-label="Sign Out"
      className="flex h-9 w-full items-center rounded-md p-1 px-4 hover:bg-gray-100 dark:hover:bg-gray-900"
    >
      <LogOut size={20} className="mr-2" />
      <h2 className="text-[15px]">Sign Out</h2>
    </button>
  )
}
