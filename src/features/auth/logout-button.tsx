'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { logout } from './actions/logout';

export const LogoutButton = () => {
  return (
    <DropdownMenuItem onClick={() => logout()} className="f-center gap-2">
      <LogOut size={20} />
      Sign Out
    </DropdownMenuItem>
  );
};
