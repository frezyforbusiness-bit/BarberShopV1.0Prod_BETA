import { Booking } from '../../domain/entities/Booking';

export interface INotificationService {
  sendBookingConfirmation(booking: Booking): Promise<void>;
  sendBookingCancellation(booking: Booking): Promise<void>;
  sendBookingReminder(booking: Booking): Promise<void>;
}



