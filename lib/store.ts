import {
  User,
  Service,
  Provider,
  Booking,
  GroupSchedule,
  WaitlistEntry,
  BookingStatus,
  GroupScheduleStatus,
  NotificationPreferences
} from './types';

// In-memory data store with localStorage persistence
class DataStore {
  private data: {
    users: Map<string, User>;
    services: Map<string, Service>;
    providers: Map<string, Provider>;
    bookings: Map<string, Booking>;
    groupSchedules: Map<string, GroupSchedule>;
    waitlistEntries: Map<string, WaitlistEntry>;
  };

  constructor() {
    this.data = {
      users: new Map(),
      services: new Map(),
      providers: new Map(),
      bookings: new Map(),
      groupSchedules: new Map(),
      waitlistEntries: new Map(),
    };
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('schedulr-data');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.data.users = new Map(parsed.users || []);
        this.data.services = new Map(parsed.services || []);
        this.data.providers = new Map(parsed.providers || []);
        this.data.bookings = new Map(parsed.bookings || []);
        this.data.groupSchedules = new Map(parsed.groupSchedules || []);
        this.data.waitlistEntries = new Map(parsed.waitlistEntries || []);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;

    try {
      const serialized = {
        users: Array.from(this.data.users.entries()),
        services: Array.from(this.data.services.entries()),
        providers: Array.from(this.data.providers.entries()),
        bookings: Array.from(this.data.bookings.entries()),
        groupSchedules: Array.from(this.data.groupSchedules.entries()),
        waitlistEntries: Array.from(this.data.waitlistEntries.entries()),
      };
      localStorage.setItem('schedulr-data', JSON.stringify(serialized));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }

  // User operations
  createUser(userData: Omit<User, 'userId'>): User {
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const user: User = { ...userData, userId };
    this.data.users.set(userId, user);
    this.saveToStorage();
    return user;
  }

  getUser(userId: string): User | undefined {
    return this.data.users.get(userId);
  }

  updateUser(userId: string, updates: Partial<User>): User | null {
    const user = this.data.users.get(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.data.users.set(userId, updatedUser);
    this.saveToStorage();
    return updatedUser;
  }

  // Service operations
  createService(serviceData: Omit<Service, 'serviceId'>): Service {
    const serviceId = `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const service: Service = { ...serviceData, serviceId };
    this.data.services.set(serviceId, service);
    this.saveToStorage();
    return service;
  }

  getServices(): Service[] {
    return Array.from(this.data.services.values());
  }

  getService(serviceId: string): Service | undefined {
    return this.data.services.get(serviceId);
  }

  // Provider operations
  createProvider(providerData: Omit<Provider, 'providerId'>): Provider {
    const providerId = `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const provider: Provider = { ...providerData, providerId };
    this.data.providers.set(providerId, provider);
    this.saveToStorage();
    return provider;
  }

  getProviders(): Provider[] {
    return Array.from(this.data.providers.values());
  }

  getProvider(providerId: string): Provider | undefined {
    return this.data.providers.get(providerId);
  }

  // Booking operations
  createBooking(bookingData: Omit<Booking, 'bookingId'>): Booking {
    const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const booking: Booking = {
      ...bookingData,
      bookingId,
      status: BookingStatus.PENDING
    };
    this.data.bookings.set(bookingId, booking);
    this.saveToStorage();
    return booking;
  }

  getBookings(userId?: string): Booking[] {
    const bookings = Array.from(this.data.bookings.values());
    return userId ? bookings.filter(b => b.userId === userId) : bookings;
  }

  getBooking(bookingId: string): Booking | undefined {
    return this.data.bookings.get(bookingId);
  }

  updateBooking(bookingId: string, updates: Partial<Booking>): Booking | null {
    const booking = this.data.bookings.get(bookingId);
    if (!booking) return null;

    const updatedBooking = { ...booking, ...updates };
    this.data.bookings.set(bookingId, updatedBooking);
    this.saveToStorage();
    return updatedBooking;
  }

  // Group Schedule operations
  createGroupSchedule(scheduleData: Omit<GroupSchedule, 'scheduleId'>): GroupSchedule {
    const scheduleId = `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const schedule: GroupSchedule = {
      ...scheduleData,
      scheduleId,
      status: GroupScheduleStatus.COLLECTING
    };
    this.data.groupSchedules.set(scheduleId, schedule);
    this.saveToStorage();
    return schedule;
  }

  getGroupSchedules(userId?: string): GroupSchedule[] {
    const schedules = Array.from(this.data.groupSchedules.values());
    return userId ? schedules.filter(s => s.attendeeIds.includes(userId)) : schedules;
  }

  getGroupSchedule(scheduleId: string): GroupSchedule | undefined {
    return this.data.groupSchedules.get(scheduleId);
  }

  updateGroupSchedule(scheduleId: string, updates: Partial<GroupSchedule>): GroupSchedule | null {
    const schedule = this.data.groupSchedules.get(scheduleId);
    if (!schedule) return null;

    const updatedSchedule = { ...schedule, ...updates };
    this.data.groupSchedules.set(scheduleId, updatedSchedule);
    this.saveToStorage();
    return updatedSchedule;
  }

  // Waitlist operations
  createWaitlistEntry(entryData: Omit<WaitlistEntry, 'waitlistId'>): WaitlistEntry {
    const waitlistId = `waitlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const entry: WaitlistEntry = {
      ...entryData,
      waitlistId,
      entryTime: new Date(),
      priority: 1,
      notified: false
    };
    this.data.waitlistEntries.set(waitlistId, entry);
    this.saveToStorage();
    return entry;
  }

  getWaitlistEntries(serviceId?: string): WaitlistEntry[] {
    const entries = Array.from(this.data.waitlistEntries.values());
    return serviceId ? entries.filter(e => e.serviceId === serviceId) : entries;
  }

  getWaitlistEntry(waitlistId: string): WaitlistEntry | undefined {
    return this.data.waitlistEntries.get(waitlistId);
  }

  updateWaitlistEntry(waitlistId: string, updates: Partial<WaitlistEntry>): WaitlistEntry | null {
    const entry = this.data.waitlistEntries.get(waitlistId);
    if (!entry) return null;

    const updatedEntry = { ...entry, ...updates };
    this.data.waitlistEntries.set(waitlistId, updatedEntry);
    this.saveToStorage();
    return updatedEntry;
  }

  deleteWaitlistEntry(waitlistId: string): boolean {
    const deleted = this.data.waitlistEntries.delete(waitlistId);
    if (deleted) this.saveToStorage();
    return deleted;
  }

  // Utility methods
  getAvailableSlots(serviceId: string, date: Date): Date[] {
    // Simple mock implementation - in real app would check provider calendar
    const service = this.data.services.get(serviceId);
    if (!service) return [];

    const slots: Date[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM

    for (let hour = startHour; hour < endHour; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      slots.push(slotTime);
    }

    return slots;
  }

  getBookedSlots(serviceId: string, date: Date): Date[] {
    const bookings = Array.from(this.data.bookings.values())
      .filter(b => b.serviceId === serviceId && b.status === BookingStatus.CONFIRMED);

    return bookings
      .filter(b => {
        const bookingDate = new Date(b.dateTime);
        return bookingDate.toDateString() === date.toDateString();
      })
      .map(b => new Date(b.dateTime));
  }

  // Initialize with mock data
  initializeMockData() {
    // This will be called to populate initial data
    console.log('Mock data initialization would go here');
  }
}

// Export singleton instance
export const dataStore = new DataStore();

