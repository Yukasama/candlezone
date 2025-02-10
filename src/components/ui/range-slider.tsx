'use client';

import { cn } from '@/lib/utils';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

interface RangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  label?: (value: number) => string;
  labelPosition?: 'bottom' | 'top';
}

const RangeSlider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ className, label, labelPosition = 'top', value, ...props }, ref) => (
  <SliderPrimitive.Root
    className={cn(
      'relative flex w-full touch-none items-center select-none',
      className,
    )}
    ref={ref}
    value={value}
    {...props}
  >
    <SliderPrimitive.Track className="bg-secondary relative h-1.5 w-full grow rounded-full">
      <SliderPrimitive.Range className="bg-primary absolute h-full rounded-full" />
    </SliderPrimitive.Track>
    {(value ?? props.defaultValue)?.map((val, i) => (
      <SliderPrimitive.Thumb
        aria-label={`Value ${String(i + 1)}`}
        className={cn(
          'group border-primary/50 bg-background relative block h-4 w-4 rounded-full border transition-colors',
          'hover:border-primary hover:bg-accent',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          'data-[dragging]:border-primary data-[dragging]:bg-accent',
        )}
        key={`thumb-${String(i)}`}
      >
        {label && (
          <div
            className={cn(
              'bg-accent/90 absolute left-1/2 -translate-x-1/2 rounded px-2 py-1',
              'text-xs font-medium opacity-0',
              'group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 group-data-[dragging]:opacity-100',
              labelPosition === 'top' ? '-top-7' : 'top-6',
            )}
          >
            {label(val)}
          </div>
        )}
      </SliderPrimitive.Thumb>
    ))}
  </SliderPrimitive.Root>
));

RangeSlider.displayName = 'RangeSlider';

export { RangeSlider };
