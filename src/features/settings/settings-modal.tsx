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
import type { User } from '@prisma/client';
import { Layers, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { settingsTabs } from './config/settings-tabs';
import { ProfileForm } from './profile-form';

const DeleteUserModal = dynamic(
  () => import('./delete-user-modal').then((mod) => mod.DeleteUserModal),
  {
    ssr: false,
    loading: () => (
      <Button variant="destructive" className="self-start" size="sm">
        <Trash2 size={18} />
        Delete Account
      </Button>
    ),
  },
);

interface Props {
  user: Pick<User, 'email' | 'name' | 'biography'>;
}

export const SettingsModal = ({ user }: Props) => {
  const [activeTab, setActiveTab] = useState('profile');

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
              {settingsTabs.map(({ id, icon, label }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="f-center h-9 w-full justify-start gap-2"
                >
                  {icon}
                  {label}
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
                {settingsTabs.map(({ id, label }) => (
                  <SelectItem key={id} value={id}>
                    <div className="flex items-center gap-2">{label}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="f-col gap-4">
            <div className="f-col gap-1">
              <h2 className="hidden text-xl font-light lg:flex">
                {settingsTabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
              <Separator />
              <p className="text-sm text-gray-400">
                {settingsTabs.find((tab) => tab.id === activeTab)?.description}
              </p>
            </div>

            {activeTab === 'profile' && <ProfileForm user={user} />}
            {activeTab === 'account' && (
              <>
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
                      Once you delete your account, there is no way to recover
                      it.
                    </small>
                  </div>
                  <DeleteUserModal />
                </div>
              </>
            )}
            {activeTab === 'security' && <p>Coming soon...</p>}
            {activeTab === 'notifications' && <p>Coming soon...</p>}
            {activeTab === 'billing' && <p>Coming soon...</p>}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
