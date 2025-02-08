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
    'value' | 'onChange'
  >;
}

export const DatePicker = ({ field, className }: Props) => {
  const formattedDate =
    typeof field.value === 'string' ? new Date(field.value) : field.value;

  return (
    <Popover modal={true}>
      <PopoverTrigger className="flex items-center justify-center" asChild>
        <Button variant="ghost" size="icon-sm" className="h-7 w-[183px]">
          <p className="mt-0.5 text-[13px]">
            {field.value ? format(formattedDate, 'PPP') : 'Select Date'}
          </p>
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className={cn('w-auto p-0', className)}
        align="start"
      >
        <Calendar
          mode="single"
          selected={formattedDate}
          onSelect={(date) => {
            field.onChange(date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
