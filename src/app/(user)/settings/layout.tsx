import { PageLayout } from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/features/auth/actions/get-user';
import { settingsTabs } from '@/features/settings/config/settings-tabs';
import { SettingsLink } from '@/features/settings/settings-link';
import { UserAvatar } from '@/features/user/components/user-avatar';
import type { PropsWithChildren } from 'react';

export default async function SettingsLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const user = await getUser();

  return (
    <PageLayout className="gap-5">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Separator />
      <div className="f-center gap-2">
        <UserAvatar user={user} />
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      <div className="flex gap-8">
        <div className="f-col w-80 gap-1">
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
