import { httpClient } from './httpClient';
import type { BookingDTO, TimeSlotDTO, CreateBookingRequest } from '../../application/dto/BookingDTO';

export const bookingApi = {
  create: (data: CreateBookingRequest, shopSlug?: string): Promise<BookingDTO> => {
    // Pass shopSlug as query parameter so backend middleware can resolve shopId
    const params = shopSlug ? { shopSlug } : {};
    return httpClient.post('/bookings', data, { params });
  },

  getAvailableSlots: (
    shopId: string,
    barberId: string,
    serviceId: string,
    date: string,
    shopSlug?: string,
  ): Promise<TimeSlotDTO[]> => {
    // Pass shopSlug as query parameter so backend middleware can resolve shopId
    const params: any = { shopId, barberId, serviceId, date };
    if (shopSlug) {
      params.shopSlug = shopSlug;
    }
    return httpClient.get('/bookings/availability', { params });
  },

  cancel: (bookingId: string, cancellationCode: string): Promise<void> => {
    return httpClient.post(`/bookings/${bookingId}/cancel`, {
      cancellationCode,
    });
  },
};


