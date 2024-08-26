import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { HTMLAttributes } from 'react';

export const PriceInfoPopover = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <Label className="f-center gap-0.5">
      Price
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className={cn('text-violet-500', className)} />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              If no price is selected, the current price will be used.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Label>
  );
};
