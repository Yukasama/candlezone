'use client';

import { cn } from '@/lib/utils';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

interface RangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: 'top' | 'bottom';
  label?: (value: number) => string;
}

const RangeSlider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ className, label, labelPosition = 'top', value, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className,
    )}
    value={value}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary" />
    </SliderPrimitive.Track>
    {(value ?? props.defaultValue)?.map((val, i) => (
      <SliderPrimitive.Thumb
        key={`thumb-${String(i)}`}
        className={cn(
          'group relative block h-4 w-4 rounded-full border border-primary/50 bg-background transition-colors',
          'hover:border-primary hover:bg-accent',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'data-[dragging]:border-primary data-[dragging]:bg-accent',
        )}
        aria-label={`Value ${String(i + 1)}`}
      >
        {label && (
          <div
            className={cn(
              'absolute left-1/2 -translate-x-1/2 rounded bg-accent/90 px-2 py-1',
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
