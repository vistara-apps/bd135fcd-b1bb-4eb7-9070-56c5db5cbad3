import { cn } from '../../lib/utils';
import { CardProps } from '../../lib/types';

export function Card({
  variant = 'default',
  children,
  className = '',
}: CardProps) {
  const baseClasses = 'card p-6';
  
  const variantClasses = {
    default: '',
    elevated: 'shadow-lg hover:shadow-xl transition-shadow duration-200',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
}
