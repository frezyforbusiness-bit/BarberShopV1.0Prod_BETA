export interface BookingDTO {
  id: string;
  shopId: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  servicePrice: number;
  serviceCurrency: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  cancellationCode: string;
  createdAt: string;
}

export interface TimeSlotDTO {
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface CreateBookingRequest {
  shopId: string;
  barberId: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  startHour: number;
  startMinute: number;
}



