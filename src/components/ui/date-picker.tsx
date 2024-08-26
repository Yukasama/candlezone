import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { FieldValues } from 'react-hook-form';
import { FormControl, FormItem, FormLabel, FormMessage } from './form';

interface Props {
  field: FieldValues;
}

export function DatePicker({ field }: Readonly<Props>) {
  return (
    <Popover modal={true}>
      <FormItem className="f-col">
        <FormLabel>Date</FormLabel>
        <FormControl>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] pl-3">
              {field.value
                ? format(new Date(field.value as string), 'PPP')
                : 'Select Date'}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
        </FormControl>
        <FormMessage />
      </FormItem>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={new Date(field.value as string)}
          onSelect={(date) => {
            if (date) {
              const localDate = new Date(
                date.getTime() - date.getTimezoneOffset() * 60000,
              );
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
}
