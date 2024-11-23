import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { COLORS } from '@/lib/utils/generate-colors';
import { RadioGroup } from '@radix-ui/react-radio-group';
import { HTMLAttributes } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { RadioGroupItem } from './radio-group';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: ControllerRenderProps<FieldValues, 'color'>;
}

export const ColorSelector = ({ field, className }: Props) => {
  return (
    <FormItem className={cn('space-y-2', className)}>
      <FormLabel>Background Color</FormLabel>
      <FormControl>
        <RadioGroup
          value={field.value as string}
          onValueChange={field.onChange}
          className="f-center gap-1.5"
        >
          {COLORS.map((color) => (
            <RadioGroupItem
              key={color}
              value={color}
              aria-label={color}
              style={{
                backgroundColor: color,
                borderColor: color,
              }}
              className="size-6 shadow-none"
            />
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
