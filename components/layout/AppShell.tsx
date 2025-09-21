'use client';

import { cn } from '../../lib/utils';

interface AppShellProps {
  variant?: 'default' | 'compact';
  children: React.ReactNode;
  className?: string;
}

export function AppShell({
  variant = 'default',
  children,
  className = '',
}: AppShellProps) {
  const containerClasses = {
    default: 'container py-6',
    compact: 'container py-4',
  };

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className={containerClasses[variant]}>
        {children}
      </div>
    </div>
  );
}
