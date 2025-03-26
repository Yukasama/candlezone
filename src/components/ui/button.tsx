import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon, LucideProps, MoveLeft, MoveRight } from 'lucide-react';
import * as React from 'react';
import { Loader } from '../loader';

const buttonVariants = cva(
  'flex items-center justify-center font-semibold whitespace-nowrap rounded-full text-sm disabled:pointer-events-none disabled:opacity-50 gap-1.5 cursor-pointer',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10 px-4 py-2',
        icon: 'size-[34px]',
        'icon-sm': 'h-8 px-3',
        lg: 'h-11 px-8',
        sm: 'h-9 px-3',
        'small-icon': 'h-7 w-7',
      },
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        faded:
          'border border-input bg-faded hover:text-accent-foreground hover:bg-secondary',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        gradient:
          'bg-gradient-to-tr from-green-600 to-blue-600 text-white hover:from-green-600/90 hover:to-blue-600/90',
        horizon: 'bg-blue-500 text-white hover:bg-blue-500/90',
        link: 'text-primary underline-offset-4 hover:underline',
        mythic: ' bg-mythic text-white hover:bg-mythic/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        success: 'bg-success text-white hover:bg-success/90',
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: LucideIcon;
  iconEnd?: LucideIcon;
  iconProps?: LucideProps;
  isLoading?: boolean;
  showBackArrow?: boolean;
  showNextArrow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      children,
      className,
      icon: Icon,
      iconEnd: IconEnd,
      iconProps,
      isLoading,
      showBackArrow,
      showNextArrow,
      size,
      variant,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({
            className,
            size,
            variant: isLoading ? 'faded' : variant,
          }),
          'group',
          isLoading && 'border border-zinc-700',
        )}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && <Loader className="-mx-2 dark:invert" size={36} />}

        {!isLoading && Icon ? (
          <Icon className="mr-0.5 size-4" {...iconProps} />
        ) : undefined}
        {!isLoading && showBackArrow ? (
          <MoveLeft className="mt-[1px] mr-[1px] size-4 duration-300 group-hover:-translate-x-[1px]" />
        ) : undefined}

        {children}

        {!isLoading && IconEnd ? (
          <IconEnd className="ml-0.5 size-4" {...iconProps} />
        ) : undefined}
        {!isLoading && showNextArrow ? (
          <MoveRight className="mt-[1px] ml-[1px] size-4 duration-300 group-hover:translate-x-[1px]" />
        ) : undefined}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
