import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/db';
import { ListOrdered, Settings, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '../auth/logout-button';
import { ExtendedUser } from '../auth/types/next-auth';
import { SettingsModal } from '../settings/settings-modal';
import { ThemeToggleSwitch } from '../shared/theme/theme-toggle-switch';
import { UserAvatar } from './components/user-avatar';

interface Props {
  user: ExtendedUser;
}

export const UserAccountNav = async ({ user }: Readonly<Props>) => {
  const isAdmin = user.role === 'ADMIN';
  const dbUser = await db.user.findUnique({
    select: { email: true, name: true, biography: true },
    where: { id: user.id },
  });

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <UserAvatar user={user} className="size-8 cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={10} className="mr-5 min-w-60">
          <Link
            href={`/u/${user.id}`}
            className="f-center mb-1 gap-2.5 rounded-xl p-2 px-3 pr-3.5 transition-colors hover:bg-accent"
          >
            <UserAvatar user={user} className="size-10" />
            <div>
              <p className="text-[15px] font-medium">{user.name}</p>
              <Badge className="max-w-[180px] truncate bg-violet-500 text-xs text-white">
                <p className="max-w-[160px] truncate">{user.email}</p>
              </Badge>
            </div>
          </Link>

          <Separator className="my-1" />

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

          <DropdownMenuItem>
            <DialogTrigger asChild>
              <div className="f-center w-full gap-2">
                <Settings className="size-5" />
                Settings
              </div>
            </DialogTrigger>
          </DropdownMenuItem>

          <Separator className="my-1" />

          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
      <SettingsModal
        user={{
          email: user.email ?? '',
          name: user.name ?? '',
          biography: dbUser?.biography ?? '',
        }}
      />
    </Dialog>
  );
};
