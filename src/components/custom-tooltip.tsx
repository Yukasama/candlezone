import type { PropsWithChildren, ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface Props extends PropsWithChildren {
  className?: string;
  content: ReactNode | string;
  side?: 'bottom' | 'left' | 'right' | 'top';
  sideOffset?: number;
}

export const CustomTooltip = ({
  children,
  className,
  content,
  side = 'right',
  sideOffset = 10,
}: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={className}
          side={side}
          sideOffset={sideOffset}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
