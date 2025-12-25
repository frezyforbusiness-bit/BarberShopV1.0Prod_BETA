import { httpClient } from './httpClient';
import type { BookingDTO, TimeSlotDTO, CreateBookingRequest } from '../../application/dto/BookingDTO';

export const bookingApi = {
  create: (data: CreateBookingRequest): Promise<BookingDTO> => {
    return httpClient.post('/bookings', data);
  },

  getAvailableSlots: (
    shopId: string,
    barberId: string,
    serviceId: string,
    date: string,
  ): Promise<TimeSlotDTO[]> => {
    return httpClient.get('/bookings/availability', {
      params: { shopId, barberId, serviceId, date },
    });
  },

  cancel: (bookingId: string, cancellationCode: string): Promise<void> => {
    return httpClient.post(`/bookings/${bookingId}/cancel`, {
      cancellationCode,
    });
  },
};


