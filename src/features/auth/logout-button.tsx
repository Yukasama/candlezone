'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  return (
    <DropdownMenuItem
      className="flex items-center gap-2"
      onClick={() => signOut()}
    >
      <LogOut size={20} />
      Sign Out
    </DropdownMenuItem>
  );
};
