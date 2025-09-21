// Core data model types
export interface User {
  userId: string;
  farcasterHandle?: string;
  walletAddress?: string;
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  groupScheduling: boolean;
  serviceBookings: boolean;
  waitlistUpdates: boolean;
  reminders: boolean;
}

export interface Service {
  serviceId: string;
  name: string;
  description: string;
  providerId: string;
  availabilityCalendarId: string;
  category: ServiceCategory;
  price?: number;
  duration: number; // in minutes
}

export interface Provider {
  providerId: string;
  name: string;
  bio: string;
  contactInfo: ContactInfo;
  bookingPlatformUrl?: string;
  rating?: number;
  verified: boolean;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
}

export interface Booking {
  bookingId: string;
  userId: string;
  serviceId: string;
  providerId: string;
  dateTime: Date;
  status: BookingStatus;
  paymentDetails?: PaymentDetails;
  notes?: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  transactionHash?: string;
  status: PaymentStatus;
}

export interface GroupSchedule {
  scheduleId: string;
  groupId: string;
  title: string;
  description?: string;
  proposedTimes: Date[];
  finalTime?: Date;
  attendeeIds: string[];
  createdBy: string;
  status: GroupScheduleStatus;
}

export interface WaitlistEntry {
  waitlistId: string;
  userId: string;
  serviceId: string;
  entryTime: Date;
  priority: number;
  notified: boolean;
}

// Enums
export enum ServiceCategory {
  THERAPY = 'therapy',
  FITNESS = 'fitness',
  EDUCATION = 'education',
  WELLNESS = 'wellness',
  PROFESSIONAL = 'professional',
  CREATIVE = 'creative',
  OTHER = 'other'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum GroupScheduleStatus {
  COLLECTING = 'collecting',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// UI Component Props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface CardProps {
  variant?: 'default' | 'elevated';
  children: React.ReactNode;
  className?: string;
}

export interface CalendarProps {
  variant?: 'default' | 'multiSelect';
  selectedDates?: Date[];
  onDateSelect?: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
