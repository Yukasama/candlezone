import type { PropsWithChildren, ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface Props extends PropsWithChildren {
  content: ReactNode | string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}

export const CustomTooltip = ({
  children,
  content,
  side = 'right',
  sideOffset = 10,
}: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} sideOffset={sideOffset}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
