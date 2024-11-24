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
import type { ControllerRenderProps, Path } from 'react-hook-form'; // Import Path
import { FormControl, FormItem, FormLabel, FormMessage } from './form';

interface FormValues {
  date: string | Date; // Allow flexibility for date representation
}

interface Props<T extends FormValues = FormValues>
  extends HTMLAttributes<HTMLDivElement> {
  field: ControllerRenderProps<T, Path<T>>; // Use Path<T> here
}

export const DatePicker = <T extends FormValues>({
  field,
  className,
}: Props<T>) => {
  return (
    <Popover modal={true}>
      <FormItem className="f-col">
        <FormLabel>Date</FormLabel>
        <FormControl>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] pl-3">
              {field.value
                ? format(
                    typeof field.value === 'string'
                      ? new Date(field.value) // Convert string to Date if necessary
                      : field.value,
                    'PPP',
                  )
                : 'Select Date'}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
        </FormControl>
        <FormMessage />
      </FormItem>
      <PopoverContent className={cn('w-auto p-0', className)} align="start">
        <Calendar
          mode="single"
          selected={
            typeof field.value === 'string'
              ? new Date(field.value) // Convert string to Date if necessary
              : field.value
          }
          onSelect={(date) => {
            if (date) {
              const localDate = new Date(
                date.getTime() - date.getTimezoneOffset() * 60000,
              );
              field.onChange(localDate.toISOString());
            }
          }}
          disabled={(date) =>
            date > new Date() || date < new Date('1970-01-01')
          }
        />
      </PopoverContent>
    </Popover>
  );
};
