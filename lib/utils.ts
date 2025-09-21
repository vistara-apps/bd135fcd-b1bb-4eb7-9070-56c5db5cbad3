import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function getTimeSlots(
  startTime: Date,
  endTime: Date,
  duration: number
): Date[] {
  const slots: Date[] = [];
  const current = new Date(startTime);
  
  while (current < endTime) {
    slots.push(new Date(current));
    current.setMinutes(current.getMinutes() + duration);
  }
  
  return slots;
}

export function findCommonTimeSlots(
  availabilities: Date[][],
  duration: number = 60
): Date[] {
  if (availabilities.length === 0) return [];
  
  // Find intersection of all availability arrays
  const common = availabilities.reduce((acc, current) => {
    return acc.filter(slot => 
      current.some(currentSlot => 
        Math.abs(slot.getTime() - currentSlot.getTime()) < duration * 60 * 1000
      )
    );
  });
  
  return common;
}
