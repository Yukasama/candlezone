'use client';

import { logout } from '@/actions/auth/logout';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
  return (
    <DropdownMenuItem onClick={() => logout()} className="f-center gap-2">
      <LogOut size={20} />
      Sign Out
    </DropdownMenuItem>
  );
};
