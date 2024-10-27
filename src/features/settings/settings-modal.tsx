'use client';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@prisma/client';
import {
  CreditCard,
  Layers,
  LockIcon,
  MessageCircle,
  Settings2,
  UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { DeleteUserModal } from './delete-user-modal';
import { ProfileForm } from './profile-form';

interface Props {
  user: Pick<User, 'email' | 'name' | 'biography'>;
}

export const SettingsModal = ({ user }: Props) => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
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
      label: 'Billing',
      icon: <CreditCard size={18} />,
    },
  ];

  return (
    <DialogContent className="max-w-[900px] overflow-hidden rounded-xl p-0 sm:w-[80%] lg:w-[900px]">
      <div className="f-col h-[450px] overflow-auto lg:h-[600px] lg:flex-row">
        <div className="bg-faded w-full space-y-2 lg:w-96 lg:space-y-4 lg:p-5">
          <div className="lg:f-col hidden gap-1 px-1">
            <DialogTitle className="text-lg font-medium">Account</DialogTitle>
            <DialogDescription className="text-gray-400">
              Manage account info
            </DialogDescription>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            orientation="vertical"
            className="hidden lg:block"
          >
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
          </Tabs>
        </div>

        <div className="relative w-full p-6 lg:p-12">
          <div className="sticky top-3 lg:hidden">
            <Select
              onValueChange={(value) => setActiveTab(value)}
              defaultValue={activeTab}
            >
              <SelectTrigger className="w-fit -translate-x-3 gap-2 border-none text-xl font-light">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => (
                  <SelectItem key={tab.id} value={tab.id}>
                    <div className="flex items-center gap-2">{tab.label}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {activeTab === 'profile' && (
            <div className="f-col gap-4">
              <div className="f-col gap-1">
                <h2 className="hidden text-xl font-light lg:flex">Profile</h2>
                <Separator />
                <p className="text-sm text-gray-400">
                  These changes will appear on your public profile.
                </p>
              </div>
              <ProfileForm user={user} />
            </div>
          )}
          {activeTab === 'account' && (
            <div className="f-col gap-5">
              <div className="f-col gap-1">
                <h2 className="hidden text-xl font-light lg:flex">Account</h2>
                <Separator />
                <p className="text-sm text-gray-400">
                  These changes will affect your personal account
                </p>
              </div>
              <div className="space-y-3">
                <div className="f-col gap-0.5">
                  <h2 className="text-md font-light">Export Data</h2>
                  <Separator />
                  <small className="text-xs text-gray-400">
                    Export all data related to your account we have stored in
                    our database (Coming soon)
                  </small>
                </div>
                <Button variant="secondary" className="self-start" size="sm">
                  <Layers size={18} />
                  Export Data
                </Button>
              </div>
              <div className="space-y-3">
                <div className="f-col gap-0.5">
                  <h2 className="text-md font-light">Delete Account</h2>
                  <Separator />
                  <small className="text-xs text-gray-400">
                    Once you delete your account, there is no way to recover it.
                  </small>
                </div>
                <DeleteUserModal />
              </div>
            </div>
          )}
          {activeTab === 'security' && (
            <div className="f-col gap-4">
              <div className="f-col gap-1">
                <h2 className="hidden text-xl font-light lg:flex">Security</h2>
                <Separator />
                <small className="text-sm text-gray-400">
                  Manage your account security settings
                </small>
              </div>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="f-col gap-4">
              <div className="f-col gap-1">
                <h2 className="hidden text-xl font-light lg:flex">
                  Notifications
                </h2>
                <Separator />
                <small className="text-sm text-gray-400">
                  Manage your account notification settings
                </small>
              </div>
            </div>
          )}
          {activeTab === 'billing' && (
            <div className="f-col gap-4">
              <div className="f-col gap-1">
                <h2 className="hidden text-xl font-light lg:flex">
                  Billing Information
                </h2>
                <Separator />
                <small className="text-sm text-gray-400">
                  Manage your account billing information
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
};
