import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'white';
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', variant = 'primary', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(
          'inline-block rounded-full animate-spin border-4',

          // Size variants
          size === 'sm' && 'w-4 h-4 border-2',
          size === 'md' && 'w-6 h-6 border-[3px]',
          size === 'lg' && 'w-10 h-10 border-4',

          // Variant colors
          variant === 'primary' && 'border-[rgb(var(--color-primary-200))] border-t-[rgb(var(--color-primary-600))]',
          variant === 'secondary' && 'border-[rgb(var(--color-neutral-200))] border-t-[rgb(var(--color-neutral-600))]',
          variant === 'white' && 'border-white/30 border-t-white',

          className
        )}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner };
