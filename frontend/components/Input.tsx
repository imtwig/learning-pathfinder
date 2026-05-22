import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, size = 'md', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block mb-1.5',
              'text-sm font-medium',
              'text-[rgb(var(--color-text-primary))]',
              error && 'text-[rgb(var(--color-danger-700))]'
            )}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            // Base styles
            'w-full',
            'bg-[rgb(var(--color-surface))]',
            'border border-[rgb(var(--color-border))]',
            'rounded-[var(--radius-base)]',
            'text-[rgb(var(--color-text-primary))]',
            'placeholder:text-[rgb(var(--color-text-muted))]',
            'shadow-[var(--shadow-inner)]',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',

            // Size variants (matches button heights)
            size === 'sm' && 'h-[var(--size-sm)] px-3 text-sm',
            size === 'md' && 'h-[var(--size-md)] px-4 text-base',
            size === 'lg' && 'h-[var(--size-lg)] px-5 text-lg',

            // Error state
            error && [
              'border-[rgb(var(--color-danger-500))]',
              'focus:ring-[rgb(var(--color-danger-500))]',
            ],

            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[rgb(var(--color-danger-700))] flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
