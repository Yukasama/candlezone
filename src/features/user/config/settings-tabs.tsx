import {
  CreditCard,
  LockIcon,
  MessageCircle,
  Settings2,
  UserIcon,
} from 'lucide-react';

export const settingsTabs = [
  {
    id: 'profile',
    label: 'Profile',
    description: 'These changes will appear on your public profile.',
    icon: <UserIcon size={18} />,
  },
  {
    id: 'account',
    label: 'Account',
    description: 'These changes will affect your personal account',
    icon: <Settings2 size={18} />,
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Manage your account security settings',
    icon: <LockIcon size={18} />,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Manage your notification settings',
    icon: <MessageCircle size={18} />,
  },
  {
    id: 'billing',
    label: 'Billing',
    description: 'Manage your billing information',
    icon: <CreditCard size={18} />,
  },
];
