'use client';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar, Users, Clock, Bell } from 'lucide-react';

const features = [
  {
    id: 'niche-services',
    title: 'Find Niche Services',
    description: 'Discover and book specialized services that are hard to find elsewhere.',
    icon: Calendar,
    color: 'text-blue-600',
    action: 'Browse Services',
    href: '/services',
  },
  {
    id: 'group-scheduling',
    title: 'Group Scheduling',
    description: 'Coordinate with friends and find the perfect time for everyone.',
    icon: Users,
    color: 'text-green-600',
    action: 'Create Group',
    href: '/groups',
  },
  {
    id: 'waitlist-management',
    title: 'Smart Waitlists',
    description: 'Get notified instantly when cancellations open up slots.',
    icon: Clock,
    color: 'text-orange-600',
    action: 'Join Waitlist',
    href: '/waitlist',
  },
  {
    id: 'reminders',
    title: 'Never Miss Again',
    description: 'Automated reminders and re-booking suggestions.',
    icon: Bell,
    color: 'text-purple-600',
    action: 'Set Reminders',
    href: '/reminders',
  },
];

export function FeatureGrid() {
  const handleFeatureClick = (href: string) => {
    // In a real app, this would navigate to the feature
    console.log(`Navigating to ${href}`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          What would you like to do?
        </h2>
        <p className="text-muted-foreground">
          Choose from our core features to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          
          return (
            <Card key={feature.id} variant="elevated" className="hover:scale-105 transition-transform duration-200">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-muted ${feature.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleFeatureClick(feature.href)}
                  className="w-full"
                >
                  {feature.action}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          Premium features available with micro-transactions on Base
        </p>
      </div>
    </div>
  );
}
