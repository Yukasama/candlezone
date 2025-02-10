import { cn } from '@/lib/utils';
import * as React from 'react';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      className={cn(
        'border-input bg-background placeholder:text-muted-foreground flex h-10 w-full rounded-full border px-3.5 py-2 pt-2.5 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
