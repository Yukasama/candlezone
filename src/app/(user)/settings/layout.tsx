import { PageLayout } from '@/components/page-layout';
import { getUser } from '@/features/auth/actions/get-user';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { settingsTabs } from '@/features/user/config/settings-tabs';
import { SettingsLink } from '@/features/user/settings/settings-link';
import type { PropsWithChildren } from 'react';

export default async function SettingsLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const user = await getUser();

  return (
    <PageLayout className="gap-5">
      <div className="flex items-center gap-2.5">
        <UserAvatar user={user} />
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hide-scrollbar flex w-full flex-row gap-1 overflow-x-scroll lg:w-80 lg:flex-col">
          {settingsTabs.map(({ id, icon, label }) => (
            <SettingsLink
              key={id}
              href={`/settings/${id}`}
              icon={icon}
              label={label}
            />
          ))}
        </div>
        <div className="w-full">{children}</div>
      </div>
    </PageLayout>
  );
}
