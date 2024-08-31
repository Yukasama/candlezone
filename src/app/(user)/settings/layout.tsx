import { UserAvatar } from '@/components/user/user-avatar';
import { SettingsItem } from '@/features/user/settings/settings-item';
import { getUser } from '@/lib/auth';
import {
  CreditCard,
  LockIcon,
  MessageCircle,
  Settings2,
  UserIcon,
} from 'lucide-react';
import type { PropsWithChildren } from 'react';

export default async function SettingsLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const user = await getUser();
  const tabs = [
    {
      id: 'settings',
      label: 'Public Profile',
      icon: <UserIcon size={18} />,
    },
    {
      id: 'account',
      label: 'Account',
      icon: <Settings2 size={18} />,
    },
    {
      id: 'security',
      label: 'Security',
      icon: <LockIcon size={18} />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <MessageCircle size={18} />,
    },
    {
      id: 'billing',
      label: 'Billing Information',
      icon: <CreditCard size={18} />,
    },
  ];

  return (
    <div className="f-col gap-7 p-8 px-6 sm:gap-10 sm:p-12 md:pl-20 md:pr-14 lg:pl-32 lg:pr-28 xl:pl-64 xl:pr-56">
      <div className="f-center gap-3">
        <UserAvatar user={user} className="size-12" />
        <div className="f-col">
          <h3 className="text-xl font-medium">{user?.name}</h3>
          <p className="text-sm text-gray-400">
            User Settings associated with your account
          </p>
        </div>
      </div>

      <div className="f-col gap-10 sm:flex-row md:gap-16">
        <div className="f-col min-w-full gap-0.5 sm:min-w-[250px] lg:min-w-[300px]">
          {tabs.map((tab) => (
            <SettingsItem key={tab.id} {...tab} />
          ))}
        </div>
        <div className="flex flex-1 px-2">{children}</div>
      </div>
    </div>
  );
}
