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
import { FormControl, FormItem, FormLabel, FormMessage } from './form';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: Pick<
    ControllerRenderProps<{ date: string | Date }, 'date'>,
    'value' | 'onChange'
  >;
}

export const DatePicker = ({ field, className }: Props) => {
  const formattedDate =
    typeof field.value === 'string' ? new Date(field.value) : field.value;

  return (
    <Popover modal={true}>
      <FormItem className="f-col">
        <FormLabel className="text-sm text-gray-400">Date</FormLabel>
        <FormControl>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] pl-3">
              {field.value ? format(formattedDate, 'PPP') : 'Select Date'}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
        </FormControl>
        <FormMessage />
      </FormItem>
      <PopoverContent className={cn('w-auto p-0', className)} align="start">
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
