import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from 'next-auth';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  user?: User;
}

export const UserAvatar = ({ user, className }: Readonly<Props>) => {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={user?.image ?? undefined} alt="Profile" />
      <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
