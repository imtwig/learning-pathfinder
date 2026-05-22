import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, helperText, error, id, onChange, ...props }, ref) => {
    const [fileName, setFileName] = useState<string>('');
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFileName(file ? file.name : '');
      onChange?.(e);
    };

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
        <div className="relative">
          <input
            ref={ref}
            type="file"
            id={inputId}
            onChange={handleChange}
            className={cn(
              'absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10',
              props.disabled && 'cursor-not-allowed'
            )}
            {...props}
          />
          <div
            className={cn(
              // Base styles
              'flex items-center gap-3',
              'w-full min-h-[2.5rem]',
              'bg-[rgb(var(--color-surface))]',
              'border border-[rgb(var(--color-border))]',
              'rounded-lg',
              'px-3 py-2',
              'text-sm',
              'transition-all duration-150',

              // Error state
              error && 'border-[rgb(var(--color-danger-500))]',

              // Disabled state
              props.disabled && 'opacity-50 cursor-not-allowed',

              className
            )}
          >
            <span className={cn(
              'flex-1 truncate',
              fileName ? 'text-[rgb(var(--color-text-primary))]' : 'text-[rgb(var(--color-text-muted))]'
            )}>
              {fileName || 'Choose a file...'}
            </span>
          </div>
        </div>
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

FileInput.displayName = 'FileInput';

export { FileInput };
