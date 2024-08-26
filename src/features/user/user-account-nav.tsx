import { LogoutLink } from '@/components/auth/logout-link';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserAvatar } from '@/components/user/user-avatar';
import { UserNavLinks } from '@/features/user/user-nav-links';
import { User } from 'next-auth';

interface Props {
  user: User;
  isAdmin?: boolean;
}

export const UserAccountNav = ({ user, isAdmin }: Readonly<Props>) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <UserAvatar user={user} className="h-8 w-8 cursor-pointer" />
      </SheetTrigger>

      <SheetContent className="rounded-l-lg">
        <div className="f-center mb-1 gap-2.5 p-2">
          <UserAvatar user={user} className="h-10 w-10" />
          <div className="f-col">
            <p className="font-medium">{user.name}</p>
            <p className="text-purple w-[200px] truncate text-sm">
              {user.email}
            </p>
          </div>
        </div>

        <UserNavLinks user={user} isAdmin={isAdmin} />
        <Separator className="my-2" />
        <LogoutLink />
      </SheetContent>
    </Sheet>
  );
};
