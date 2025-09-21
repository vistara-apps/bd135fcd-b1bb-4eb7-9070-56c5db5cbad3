export const APP_CONFIG = {
  name: 'Schedulr',
  tagline: 'Effortless group scheduling and niche service booking',
  version: '1.0.0',
  supportEmail: 'support@schedulr.app',
} as const;

export const BOOKING_CONFIG = {
  maxAdvanceBookingDays: 90,
  minAdvanceBookingHours: 2,
  defaultDuration: 60, // minutes
  maxGroupSize: 20,
  waitlistTimeout: 15, // minutes to respond to waitlist notification
} as const;

export const PAYMENT_CONFIG = {
  defaultCurrency: 'USD',
  microTransactionFee: 0.01, // $0.01
  premiumFeatures: {
    advancedFiltering: 0.05,
    priorityWaitlist: 0.10,
    unlimitedGroups: 0.25,
  },
} as const;

export const UI_CONFIG = {
  animation: {
    duration: {
      fast: 150,
      base: 250,
      slow: 350,
    },
    easing: 'cubic-bezier(0.22,1,0.36,1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export const SERVICE_CATEGORIES = [
  { id: 'therapy', label: 'Therapy & Counseling', icon: '🧠' },
  { id: 'fitness', label: 'Fitness & Training', icon: '💪' },
  { id: 'education', label: 'Education & Tutoring', icon: '📚' },
  { id: 'wellness', label: 'Wellness & Spa', icon: '🧘' },
  { id: 'professional', label: 'Professional Services', icon: '💼' },
  { id: 'creative', label: 'Creative & Arts', icon: '🎨' },
  { id: 'other', label: 'Other Services', icon: '⭐' },
] as const;

export const NOTIFICATION_TYPES = {
  GROUP_SCHEDULE_READY: 'group_schedule_ready',
  WAITLIST_SLOT_AVAILABLE: 'waitlist_slot_available',
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_REMINDER: 'booking_reminder',
  BOOKING_CANCELLED: 'booking_cancelled',
} as const;

export const MOCK_DATA = {
  services: [
    {
      serviceId: '1',
      name: 'Specialized Acupuncture',
      description: 'Traditional Chinese acupuncture with modern techniques',
      providerId: 'provider-1',
      availabilityCalendarId: 'cal-1',
      category: 'wellness',
      price: 120,
      duration: 60,
    },
    {
      serviceId: '2',
      name: 'EMDR Therapy',
      description: 'Eye Movement Desensitization and Reprocessing therapy',
      providerId: 'provider-2',
      availabilityCalendarId: 'cal-2',
      category: 'therapy',
      price: 180,
      duration: 90,
    },
    {
      serviceId: '3',
      name: 'Aerial Yoga Classes',
      description: 'Anti-gravity yoga using silk hammocks',
      providerId: 'provider-3',
      availabilityCalendarId: 'cal-3',
      category: 'fitness',
      price: 45,
      duration: 75,
    },
  ],
  providers: [
    {
      providerId: 'provider-1',
      name: 'Dr. Sarah Chen',
      bio: 'Licensed acupuncturist with 15+ years experience',
      contactInfo: { email: 'sarah@example.com' },
      rating: 4.9,
      verified: true,
    },
    {
      providerId: 'provider-2',
      name: 'Michael Rodriguez, LCSW',
      bio: 'Trauma specialist and EMDR certified therapist',
      contactInfo: { email: 'michael@example.com' },
      rating: 4.8,
      verified: true,
    },
    {
      providerId: 'provider-3',
      name: 'Luna Wellness Studio',
      bio: 'Premier aerial yoga and movement studio',
      contactInfo: { email: 'hello@lunawellness.com' },
      rating: 4.7,
      verified: true,
    },
  ],
} as const;
