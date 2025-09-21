import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'textarea';
}

export function Input({
  label,
  error,
  variant = 'default',
  className = '',
  ...props
}: InputProps) {
  const baseClasses = 'w-full px-3 py-2 border border-input rounded-md bg-surface text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-card-foreground">
          {label}
        </label>
      )}
      {variant === 'textarea' ? (
        <textarea
          className={cn(baseClasses, 'min-h-[80px] resize-vertical', className)}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={cn(baseClasses, className)}
          {...props}
        />
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
