import { Booking } from '../../domain/entities/Booking';
import { TimeSlot } from '../../domain/value-objects/TimeSlot';

export interface IBookingRepository {
  save(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findBySlot(barberId: string, timeSlot: TimeSlot): Promise<Booking | null>;
  findByBarberAndDate(barberId: string, date: Date): Promise<Booking[]>;
  findByShopAndDate(shopId: string, date: Date): Promise<Booking[]>;
  findByCancellationCode(code: string): Promise<Booking | null>;
  findOverlappingBookings(
    barberId: string,
    timeSlot: TimeSlot,
  ): Promise<Booking[]>;
  update(booking: Booking): Promise<Booking>;
}


