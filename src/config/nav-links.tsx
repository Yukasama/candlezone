import { LayoutDashboard, ListOrdered, Settings, User } from 'lucide-react';

export const loadNavLinks = (userId?: string) => [
  {
    label: 'My Profile',
    href: `/u/${userId}`,
    icon: <User className="mr-2" size={20} />,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="mr-2" size={20} />,
  },
  {
    label: 'My Portfolios',
    href: '/p/new',
    icon: <ListOrdered className="mr-2" size={20} />,
    separator: true,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="mr-2" size={20} />,
  },
];
