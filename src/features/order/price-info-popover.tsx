import { CustomTooltip } from '@/components/ui/custom-tooltip';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { HTMLAttributes } from 'react';

export const PriceInfoPopover = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <Label className="f-center gap-0.5">
      Price
      <CustomTooltip
        side="top"
        sideOffset={4}
        content="If no price is selected, the current price will be used."
      >
        <Info className={cn('text-violet-500', className)} />
      </CustomTooltip>
    </Label>
  );
};
