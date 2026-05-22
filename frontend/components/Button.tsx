import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'font-semibold',
          'transition-all',
          'duration-[var(--transition-fast)]',
          'ease-[var(--ease-out)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
          'active:scale-[0.98]',

          // Size variants (height from design tokens)
          size === 'sm' && 'h-[var(--size-sm)] px-3 text-sm rounded-[var(--radius-base)]',
          size === 'md' && 'h-[var(--size-md)] px-4 text-base rounded-[var(--radius-base)]',
          size === 'lg' && 'h-[var(--size-lg)] px-6 text-lg rounded-[var(--radius-md)]',
          size === 'xl' && 'h-[var(--size-xl)] px-8 text-xl rounded-[var(--radius-md)]',

          // Variant styles
          variant === 'primary' && [
            'bg-[rgb(var(--color-primary-600))] text-white',
            'hover:bg-[rgb(var(--color-primary-700))] hover:shadow-[var(--glow-primary)] hover:-translate-y-0.5',
            'active:translate-y-0',
            'focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-500))] focus-visible:shadow-[var(--glow-primary)]',
            'shadow-md',
          ],
          variant === 'secondary' && [
            'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-primary))]',
            'border border-[rgb(var(--color-border))]',
            'hover:bg-[rgb(var(--color-neutral-700))] hover:border-[rgb(var(--color-neutral-600))] hover:shadow-sm',
            'focus-visible:ring-[rgb(var(--color-neutral-500))]',
          ],
          variant === 'outline' && [
            'bg-transparent border border-[rgb(var(--color-border))]',
            'text-[rgb(var(--color-text-primary))]',
            'hover:bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary-600))] hover:text-[rgb(var(--color-primary-500))]',
            'focus-visible:ring-[rgb(var(--color-primary-500))]',
          ],
          variant === 'ghost' && [
            'bg-transparent text-[rgb(var(--color-text-secondary))]',
            'hover:bg-[rgb(var(--color-surface))] hover:text-[rgb(var(--color-text-primary))]',
            'focus-visible:ring-[rgb(var(--color-neutral-600))]',
          ],
          variant === 'danger' && [
            'bg-[rgb(var(--color-danger-600))] text-white',
            'hover:bg-[rgb(var(--color-danger-700))] hover:shadow-md hover:-translate-y-0.5',
            'active:translate-y-0',
            'focus-visible:ring-[rgb(var(--color-danger-500))]',
          ],

          // Full width
          fullWidth && 'w-full',

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
