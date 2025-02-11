import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: Pick<
    ControllerRenderProps<{ date: string }, 'date'>,
    'onChange' | 'value'
  >;
}

export const DatePicker = ({ className, field }: Props) => {
  const formattedDate =
    typeof field.value === 'string' ? new Date(field.value) : field.value;

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild className="flex items-center justify-center">
        <Button className="h-7 w-[183px]" size="icon-sm" variant="ghost">
          <p className="mt-0.5 text-[13px]">
            {field.value ? format(formattedDate, 'PPP') : 'Select Date'}
          </p>
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn('w-auto p-0', className)}
        side="bottom"
      >
        <Calendar
          mode="single"
          onSelect={(date) => field.onChange(date)}
          selected={formattedDate}
        />
      </PopoverContent>
    </Popover>
  );
};
