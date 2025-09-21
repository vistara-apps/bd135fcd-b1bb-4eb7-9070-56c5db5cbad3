'use client';

import { useMiniKit } from '@coinbase/minikit';

export function WelcomeHeader() {
  const { context } = useMiniKit();
  
  const displayName = context?.user?.displayName || 'Friend';

  return (
    <div className="text-center space-y-4 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold text-card-foreground">
          Welcome to Schedulr
        </h1>
        <p className="text-base font-normal leading-7 text-muted-foreground max-w-2xl mx-auto">
          Hey {displayName}! Find niche services, coordinate group events, and never miss an appointment again.
        </p>
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Connected to Base</span>
        </div>
      </div>
    </div>
  );
}
