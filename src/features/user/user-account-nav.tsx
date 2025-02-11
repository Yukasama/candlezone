import { Badge } from '@/components/ui/badge';
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
import { ThemeToggleSwitch } from '../shared/theme/theme-toggle-switch';
import { UserAvatar } from './components/user-avatar';

interface Props {
  user: ExtendedUser;
}

export const UserAccountNav = async ({ user }: Readonly<Props>) => {
  const isAdmin = user.role === 'ADMIN';

  const firstPortfolio = await db.portfolio.findFirst({
    select: { id: true },
    where: { userId: user.id },
  });

  const sendToPortfolio = firstPortfolio ? `/p/${firstPortfolio.id}` : '/p/new';

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <UserAvatar className="size-8 cursor-pointer" user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-5 min-w-60" sideOffset={10}>
        <Link
          className="hover:bg-accent mb-1 flex items-center gap-2.5 rounded-xl p-2 px-3 pr-3.5 transition-colors"
          href={`/u/${user.id}`}
        >
          <UserAvatar className="size-10" user={user} />
          <div>
            <p className="text-[15px] font-medium">{user.name}</p>
            <Badge className="max-w-[180px] truncate" variant="gradient">
              <p className="max-w-[160px] truncate">{user.email}</p>
            </Badge>
          </div>
        </Link>

        <Separator className="my-1" />

        {isAdmin && (
          <>
            <Link href="/admin/dashboard">
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings2 className="size-5" />
                Stock Control
              </DropdownMenuItem>
            </Link>
            <Separator className="my-1" />
          </>
        )}

        <Link href={sendToPortfolio}>
          <DropdownMenuItem className="flex items-center gap-2">
            <ListOrdered className="size-5" />
            Portfolios
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem className="hover:bg-background flex items-center gap-2">
          <ThemeToggleSwitch />
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            className="flex w-full items-center gap-2"
            href="/settings/profile"
          >
            <Settings className="size-5" />
            Settings
          </Link>
        </DropdownMenuItem>

        <Separator className="my-1" />

        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
