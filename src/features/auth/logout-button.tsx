'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { logout } from './actions/logout';

export const LogoutButton = () => {
  return (
    <DropdownMenuItem
      className="flex items-center gap-2"
      onClick={() => logout()}
    >
      <LogOut size={20} />
      Sign Out
    </DropdownMenuItem>
  );
};
