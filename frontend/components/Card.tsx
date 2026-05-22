import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', elevation = 'sm', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'bg-[rgb(var(--color-surface))]',
          'border border-[rgb(var(--color-border))]',
          'rounded-[var(--radius-md)]',
          'transition-all',
          'duration-[var(--transition-base)]',
          'ease-[var(--ease-out)]',
          'backdrop-blur-sm',

          // Padding variants (internal spacing)
          padding === 'sm' && 'p-4',
          padding === 'md' && 'p-6',
          padding === 'lg' && 'p-8',

          // Elevation variants
          elevation === 'none' && 'shadow-none',
          elevation === 'sm' && 'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
          elevation === 'md' && 'shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]',
          elevation === 'lg' && 'shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)]',

          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-4', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-lg font-semibold',
          'text-[rgb(var(--color-text-primary))]',
          'leading-[var(--leading-tight)]',
          className
        )}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm',
          'text-[rgb(var(--color-text-secondary))]',
          'leading-[var(--leading-normal)]',
          'mt-1',
          className
        )}
        {...props}
      />
    );
  }
);

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-6 flex items-center gap-3', className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
