import { Button } from '@/components/ui/button';
import { DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/db';
import {
  CreditCard,
  Layers,
  LockIcon,
  MessageCircle,
  Settings2,
  UserIcon,
} from 'lucide-react';
import { User } from 'next-auth';
import { DeleteUserModal } from './delete-user-modal';
import { ProfileForm } from './profile-form';

interface Props {
  user?: User;
}

export const SettingsModal = async ({ user }: Props) => {
  const dbUser = await db.user.findFirst({
    select: { email: true, name: true, biography: true },
    where: { id: user?.id },
  });

  const tabs = [
    {
      id: 'profile',
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
    <DialogContent className="max-w-[900px] p-0 md:w-[600px] lg:w-[900px]">
      <Tabs
        defaultValue="profile"
        orientation="vertical"
        className="f-col h-[700px] lg:h-[600px] lg:w-[900px] lg:flex-row"
      >
        <div className="bg-faded w-full space-y-2 p-5 lg:w-96 lg:space-y-4">
          <div className="lg:f-col hidden gap-1 px-1">
            <h2 className="text-lg font-medium">Account</h2>
            <p className="text-gray-400">Manage account info</p>
          </div>

          <TabsList className="f-col h-[186px] w-full justify-start gap-[3px] bg-transparent px-0 pt-3 sm:pt-0 lg:h-60">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="f-center h-9 w-full justify-start gap-2"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="profile" className="w-full p-6 lg:p-12">
          <div className="f-col gap-4">
            <div className="f-col gap-1">
              <h2 className="text-xl font-light">Profile</h2>
              <Separator />
              <p className="text-sm text-gray-400">
                These changes will appear on your public profile.
              </p>
            </div>
            <ProfileForm user={dbUser} />
          </div>
        </TabsContent>
        <TabsContent value="account" className="w-full p-6 lg:p-12">
          <div className="f-col gap-4">
            <div className="f-col gap-1">
              <h2 className="text-xl font-light">Export Data</h2>
              <Separator />
              <small className="text-sm text-gray-400">
                Export all data related to your account we have stored in our
                database (Coming soon)
              </small>
            </div>

            <Button variant="secondary" className="self-start" size="sm">
              <Layers size={18} />
              Export Data
            </Button>

            <div className="f-col mt-5 gap-1">
              <h2 className="text-xl font-light">Delete Account</h2>
              <Separator />
              <small className="text-sm text-gray-400">
                Once you delete your account, there is no way to recover it.
              </small>
            </div>

            <DeleteUserModal />
          </div>
        </TabsContent>
        <TabsContent value="security" className="w-full p-6 lg:p-12">
          <div className="f-col gap-4">
            <div className="f-col gap-1">
              <h2 className="text-xl font-light">Security</h2>
              <Separator />
              <small className="text-sm text-gray-400">
                Manage your account security settings
              </small>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="w-full p-6 lg:p-12">
          <div className="f-col gap-4">
            <div className="f-col gap-1">
              <h2 className="text-xl font-light">Notifications</h2>
              <Separator />
              <small className="text-sm text-gray-400">
                Manage your account notification settings
              </small>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="billing" className="w-full p-6 lg:p-12">
          <div className="f-col gap-4">
            <div className="f-col gap-1">
              <h2 className="text-xl font-light">Billing Information</h2>
              <Separator />
              <small className="text-sm text-gray-400">
                Manage your account billing information
              </small>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};
