import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/features/auth/actions/get-user';
import { Enable2faModal } from '@/features/auth/enable-2fa-modal';
import { db } from '@/lib/db';
import { Check, Minus } from 'lucide-react';

export default async function SettingsSecuritysPage() {
  const user = await getUser();
  const dbUser = await db.user.findUnique({
    select: { accounts: { select: { provider: true } }, twoFactor: true },
    where: { id: user?.id },
  });

  const onlyCredentials =
    dbUser?.accounts.length === 1 &&
    dbUser.accounts[0].provider === 'credentials';

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl">Security</h1>
        <p className="text-desc text-sm">
          Manage and administer your security settings
        </p>
        <Separator className="mt-2" />
      </div>
      <div className="bg-faded space-y-3 rounded-lg p-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-md font-light">2FA Authentication</h2>
          <Separator />
          <small className="text-desc text-xs">
            Add an extra layer of security to your account
          </small>
        </div>
        <>
          {onlyCredentials ? (
            <>
              {dbUser.twoFactor ? (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-success flex items-center justify-center rounded-full p-1">
                      <Check className="size-3.5" />
                    </div>
                    <p className="text-sm">Two Factor Authentication Enabled</p>
                  </div>
                  <Button size="icon-sm" variant="secondary">
                    Disable
                  </Button>
                </div>
              ) : (
                <Enable2faModal />
              )}
            </>
          ) : (
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-accent flex items-center justify-center rounded-full p-1">
                  <Minus className="size-3.5" />
                </div>
                <p className="text-sm">
                  Two Factor Authentication Disabled for OAuth
                </p>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
