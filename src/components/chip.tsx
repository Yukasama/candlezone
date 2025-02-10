import { cn } from '@/lib/utils';
import { CheckCircle, TriangleAlert } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Badge } from './ui/badge';

interface Props extends HTMLAttributes<HTMLDivElement> {
  message: string;
  size?: 'sm' | 'md';
  isError?: boolean;
}

export const Chip = ({
  message,
  size = 'md',
  isError,
  className,
}: Readonly<Props>) => {
  const isSmall = size === 'sm';

  return (
    <Badge
      className={cn(
        'self-center text-[13px]',
        isSmall ? 'p-[3px] px-1.5' : 'p-1 px-2.5',
        isError
          ? 'border-destructive bg-destructive/60'
          : 'border-success bg-success/60',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center text-white',
          isSmall ? 'gap-1.5' : 'gap-[7px]',
        )}
      >
        {isError ? (
          <TriangleAlert size={isSmall ? 16 : 18} />
        ) : (
          <CheckCircle size={isSmall ? 16 : 18} />
        )}
        <p className={cn(isSmall && 'text-sm')}>{message}</p>
      </div>
    </Badge>
  );
};
