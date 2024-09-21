import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SettingsModal } from '@/features/settings/settings-modal';
import { ListOrdered, Settings, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '../auth/logout-button';
import { ExtendedUser } from '../auth/types/next-auth';
import { ThemeToggleSwitch } from '../shared/theme-toggle-switch';
import { UserAvatar } from './components/user-avatar';

interface Props {
  user: ExtendedUser;
}

export const UserAccountNav = ({ user }: Readonly<Props>) => {
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <UserAvatar user={user} className="size-8 cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={10} className="-translate-x-4">
          <Link
            href={`/u/${user.id}`}
            className="f-center mb-1 gap-2.5 rounded-md p-2 transition-colors hover:bg-accent"
          >
            <UserAvatar user={user} className="size-10" />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-purple w-[190px] truncate text-sm">
                {user.email}
              </p>
            </div>
          </Link>

          {isAdmin && (
            <>
              <Link href="/admin/dashboard">
                <DropdownMenuItem className="f-center gap-2">
                  <Settings2 className="size-5" />
                  Stock Control
                </DropdownMenuItem>
              </Link>
              <Separator className="my-1" />
            </>
          )}

          <Link href="/p/new">
            <DropdownMenuItem className="f-center gap-2">
              <ListOrdered className="size-5" />
              Portfolios
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem className="f-center gap-2 hover:bg-background">
            <ThemeToggleSwitch />
          </DropdownMenuItem>

          <DropdownMenuItem className="f-center gap-2">
            <DialogTrigger asChild>
              <div className="f-center gap-2">
                <Settings className="size-5" />
                Settings
              </div>
            </DialogTrigger>
          </DropdownMenuItem>

          <Separator className="my-1" />

          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
      <SettingsModal user={user} />
    </Dialog>
  );
};
