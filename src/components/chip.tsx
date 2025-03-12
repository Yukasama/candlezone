import { cn } from '@/lib/utils';
import { CheckCircle, Info, TriangleAlert } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Badge } from './ui/badge';

type FormMessageType = 'error' | 'info' | 'success';

interface Props extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: 'md' | 'sm';
  type?: FormMessageType;
}

const styles: Record<FormMessageType, string> = {
  error: 'border-destructive/80 bg-destructive/40',
  info: 'border-accent bg-faded',
  success: 'border-success bg-success/60',
};

export const ChipMessage = ({
  className,
  message,
  size = 'md',
  type = 'error',
}: Readonly<Props>) => {
  const isSmall = size === 'sm';

  return (
    <>
      {message && (
        <Badge
          className={cn(
            'self-center text-[13px]',
            isSmall ? 'p-[3px] px-1.5' : 'p-[5px] px-4',
            styles[type],
            className,
          )}
        >
          <div
            className={cn(
              'flex items-center text-white',
              isSmall ? 'gap-1.5' : 'gap-[7px]',
            )}
          >
            {type === 'info' && <Info size={isSmall ? 16 : 18} />}
            {type === 'error' && <TriangleAlert size={isSmall ? 16 : 18} />}
            {type === 'success' && <CheckCircle size={isSmall ? 16 : 18} />}
            <p className={cn(isSmall && 'text-sm', 'mb-[1px]')}>{message}</p>
          </div>
        </Badge>
      )}
    </>
  );
};
