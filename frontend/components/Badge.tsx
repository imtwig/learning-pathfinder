import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium',
          'rounded-[var(--radius-sm)]',
          'whitespace-nowrap',

          // Size variants
          size === 'sm' && 'px-2 py-0.5 text-xs',
          size === 'md' && 'px-2.5 py-1 text-sm',
          size === 'lg' && 'px-3 py-1.5 text-base',

          // Variant styles
          variant === 'default' && [
            'bg-[rgb(var(--color-neutral-800))]',
            'text-[rgb(var(--color-neutral-300))]',
            'border border-[rgb(var(--color-neutral-700))]',
          ],
          variant === 'success' && [
            'bg-[rgb(var(--color-success-100))]',
            'text-[rgb(var(--color-success-700))]',
            'border border-[rgb(var(--color-success-200))]',
          ],
          variant === 'warning' && [
            'bg-[rgb(var(--color-warning-100))]',
            'text-[rgb(var(--color-warning-700))]',
            'border border-[rgb(var(--color-warning-200))]',
          ],
          variant === 'danger' && [
            'bg-[rgb(var(--color-danger-100))]',
            'text-[rgb(var(--color-danger-700))]',
            'border border-[rgb(var(--color-danger-200))]',
          ],
          variant === 'info' && [
            'bg-[rgb(var(--color-primary-100))]',
            'text-[rgb(var(--color-primary-700))]',
            'border border-[rgb(var(--color-primary-200))]',
          ],

          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
