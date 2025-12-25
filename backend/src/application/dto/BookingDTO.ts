import { BookingStatus } from '../../domain/entities/Booking';

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
  date: string; // ISO date string
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  status: BookingStatus;
  cancellationCode: string;
  createdAt: string; // ISO datetime string
}


