import { dataStore } from './store';
import {
  User,
  Service,
  Provider,
  Booking,
  GroupSchedule,
  WaitlistEntry,
  ApiResponse,
  PaginatedResponse
} from './types';

// User API
export const userApi = {
  create: async (userData: Omit<User, 'userId'>): Promise<ApiResponse<User>> => {
    try {
      const user = dataStore.createUser(userData);
      return { data: user, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to create user' };
    }
  },

  get: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const user = dataStore.getUser(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      return { data: user, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get user' };
    }
  },

  update: async (userId: string, updates: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const user = dataStore.updateUser(userId, updates);
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      return { data: user, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update user' };
    }
  },
};

// Service API
export const serviceApi = {
  getAll: async (): Promise<ApiResponse<Service[]>> => {
    try {
      const services = dataStore.getServices();
      return { data: services, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get services' };
    }
  },

  get: async (serviceId: string): Promise<ApiResponse<Service>> => {
    try {
      const service = dataStore.getService(serviceId);
      if (!service) {
        return { success: false, error: 'Service not found' };
      }
      return { data: service, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get service' };
    }
  },

  search: async (query: string, category?: string): Promise<ApiResponse<Service[]>> => {
    try {
      const services = dataStore.getServices();
      let filtered = services;

      if (query) {
        filtered = filtered.filter(service =>
          service.name.toLowerCase().includes(query.toLowerCase()) ||
          service.description.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (category) {
        filtered = filtered.filter(service => service.category === category);
      }

      return { data: filtered, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to search services' };
    }
  },

  getAvailableSlots: async (serviceId: string, date: string): Promise<ApiResponse<Date[]>> => {
    try {
      const service = dataStore.getService(serviceId);
      if (!service) {
        return { success: false, error: 'Service not found' };
      }

      const dateObj = new Date(date);
      const availableSlots = dataStore.getAvailableSlots(serviceId, dateObj);
      const bookedSlots = dataStore.getBookedSlots(serviceId, dateObj);

      const available = availableSlots.filter(slot =>
        !bookedSlots.some(booked =>
          booked.getTime() === slot.getTime()
        )
      );

      return { data: available, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get available slots' };
    }
  },
};

// Provider API
export const providerApi = {
  getAll: async (): Promise<ApiResponse<Provider[]>> => {
    try {
      const providers = dataStore.getProviders();
      return { data: providers, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get providers' };
    }
  },

  get: async (providerId: string): Promise<ApiResponse<Provider>> => {
    try {
      const provider = dataStore.getProvider(providerId);
      if (!provider) {
        return { success: false, error: 'Provider not found' };
      }
      return { data: provider, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get provider' };
    }
  },
};

// Booking API
export const bookingApi = {
  create: async (bookingData: Omit<Booking, 'bookingId' | 'status'>): Promise<ApiResponse<Booking>> => {
    try {
      const booking = dataStore.createBooking(bookingData);
      return { data: booking, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to create booking' };
    }
  },

  getUserBookings: async (userId: string): Promise<ApiResponse<Booking[]>> => {
    try {
      const bookings = dataStore.getBookings(userId);
      return { data: bookings, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get bookings' };
    }
  },

  get: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    try {
      const booking = dataStore.getBooking(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }
      return { data: booking, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get booking' };
    }
  },

  update: async (bookingId: string, updates: Partial<Booking>): Promise<ApiResponse<Booking>> => {
    try {
      const booking = dataStore.updateBooking(bookingId, updates);
      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }
      return { data: booking, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update booking' };
    }
  },

  cancel: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    try {
      const booking = dataStore.updateBooking(bookingId, { status: 'cancelled' });
      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }
      return { data: booking, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to cancel booking' };
    }
  },
};

// Group Schedule API
export const groupScheduleApi = {
  create: async (scheduleData: Omit<GroupSchedule, 'scheduleId' | 'status'>): Promise<ApiResponse<GroupSchedule>> => {
    try {
      const schedule = dataStore.createGroupSchedule(scheduleData);
      return { data: schedule, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to create group schedule' };
    }
  },

  getUserSchedules: async (userId: string): Promise<ApiResponse<GroupSchedule[]>> => {
    try {
      const schedules = dataStore.getGroupSchedules(userId);
      return { data: schedules, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get group schedules' };
    }
  },

  get: async (scheduleId: string): Promise<ApiResponse<GroupSchedule>> => {
    try {
      const schedule = dataStore.getGroupSchedule(scheduleId);
      if (!schedule) {
        return { success: false, error: 'Group schedule not found' };
      }
      return { data: schedule, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get group schedule' };
    }
  },

  update: async (scheduleId: string, updates: Partial<GroupSchedule>): Promise<ApiResponse<GroupSchedule>> => {
    try {
      const schedule = dataStore.updateGroupSchedule(scheduleId, updates);
      if (!schedule) {
        return { success: false, error: 'Group schedule not found' };
      }
      return { data: schedule, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update group schedule' };
    }
  },

  submitAvailability: async (scheduleId: string, userId: string, availability: Date[]): Promise<ApiResponse<GroupSchedule>> => {
    try {
      const schedule = dataStore.getGroupSchedule(scheduleId);
      if (!schedule) {
        return { success: false, error: 'Group schedule not found' };
      }

      // In a real app, this would store user availability separately
      // For now, we'll just update the schedule status if all users have responded
      const updatedSchedule = dataStore.updateGroupSchedule(scheduleId, {
        proposedTimes: [...(schedule.proposedTimes || []), ...availability]
      });

      if (!updatedSchedule) {
        return { success: false, error: 'Failed to update availability' };
      }

      return { data: updatedSchedule, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to submit availability' };
    }
  },
};

// Waitlist API
export const waitlistApi = {
  join: async (entryData: Omit<WaitlistEntry, 'waitlistId' | 'entryTime' | 'priority' | 'notified'>): Promise<ApiResponse<WaitlistEntry>> => {
    try {
      const entry = dataStore.createWaitlistEntry(entryData);
      return { data: entry, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to join waitlist' };
    }
  },

  getServiceWaitlist: async (serviceId: string): Promise<ApiResponse<WaitlistEntry[]>> => {
    try {
      const entries = dataStore.getWaitlistEntries(serviceId);
      return { data: entries, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to get waitlist' };
    }
  },

  remove: async (waitlistId: string): Promise<ApiResponse<boolean>> => {
    try {
      const deleted = dataStore.deleteWaitlistEntry(waitlistId);
      return { data: deleted, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to remove from waitlist' };
    }
  },

  notifyNextUser: async (serviceId: string): Promise<ApiResponse<WaitlistEntry | null>> => {
    try {
      const entries = dataStore.getWaitlistEntries(serviceId)
        .filter(entry => !entry.notified)
        .sort((a, b) => a.entryTime.getTime() - b.entryTime.getTime());

      if (entries.length === 0) {
        return { data: null, success: true };
      }

      const nextEntry = entries[0];
      const updatedEntry = dataStore.updateWaitlistEntry(nextEntry.waitlistId, { notified: true });

      return { data: updatedEntry, success: true };
    } catch (error) {
      return { success: false, error: 'Failed to notify next user' };
    }
  },
};

// Utility API functions
export const initializeMockData = async (): Promise<ApiResponse<void>> => {
  try {
    // Initialize with mock data from constants
    const { MOCK_DATA } = await import('./constants');

    // Create providers
    for (const provider of MOCK_DATA.providers) {
      dataStore.createProvider(provider);
    }

    // Create services
    for (const service of MOCK_DATA.services) {
      dataStore.createService(service);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to initialize mock data' };
  }
};

