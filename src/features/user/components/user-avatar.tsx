import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from 'next-auth';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  px?: number;
  user?: User;
}

export const UserAvatar = ({ className, px = 40, user }: Readonly<Props>) => {
  return (
    <Avatar asChild>
      <button aria-label="User avatar" className={cn(className)}>
        <AvatarImage
          alt="Profile"
          height={px}
          src={user?.image ?? undefined}
          width={px}
        />
        <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
      </button>
    </Avatar>
  );
};
