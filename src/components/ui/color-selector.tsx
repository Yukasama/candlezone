import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { COLORS } from '@/lib/utils/generate-colors';
import { RadioGroup } from '@radix-ui/react-radio-group';
import type { HTMLAttributes } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { RadioGroupItem } from './radio-group';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: RegisterOptions;
  label: string;
}

export const ColorSelector = ({ className, field, label }: Props) => {
  return (
    <FormItem className={cn('space-y-2', className)}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <RadioGroup
          className="flex items-center gap-1.5"
          onValueChange={field.onChange}
          value={field.value as string}
        >
          {COLORS.map((color) => (
            <RadioGroupItem
              aria-label={color}
              className="size-6 shadow-none"
              key={color}
              style={{ backgroundColor: color, borderColor: color }}
              value={color}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </FormItem>
  );
};
