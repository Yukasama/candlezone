import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Loader } from '../loader';

const buttonVariants = cva(
  'flex items-center justify-center font-semibold whitespace-nowrap rounded-full text-sm disabled:pointer-events-none disabled:opacity-50 gap-1.5 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        faded: 'border border-input bg-faded hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        success: 'bg-success text-white hover:bg-success/90',
        horizon: 'bg-blue-500 text-white hover:bg-blue-500/90',
        mythic: ' bg-mythic text-white hover:bg-mythic/90',
        gradient:
          ' bg-gradient-to-tr from-blue-600 to-violet-600 text-white hover:from-blue-600/90 hover:to-violet-600/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'size-[34px]',
        'icon-sm': 'h-8 px-3',
        'small-icon': 'h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      asChild = false,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant: isLoading ? 'faded' : variant,
            size,
            className,
          }),
          isLoading && 'gap-0 border border-zinc-700 p-0 pr-4 pl-[5px]',
        )}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading && <Loader size={36} className="dark:invert" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
