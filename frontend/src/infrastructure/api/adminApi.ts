import { httpClient } from './httpClient';
import type { BookingDTO } from '../../application/dto/BookingDTO';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    shopId: string;
  };
}

export const adminApi = {
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return httpClient.post('/admin/auth/login', data);
  },

  getDailyBookings: (date: string): Promise<BookingDTO[]> => {
    return httpClient.get('/admin/bookings', {
      params: { date },
    });
  },

  completeBooking: (bookingId: string): Promise<void> => {
    return httpClient.post(`/admin/bookings/${bookingId}/complete`);
  },

  blockTimeSlot: (data: {
    barberId: string;
    date: string;
    startHour: number;
    startMinute: number;
    durationMinutes: number;
    reason: string;
  }): Promise<void> => {
    return httpClient.post('/admin/time-slots/block', data);
  },
};


