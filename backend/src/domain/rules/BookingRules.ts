import { Booking } from '../entities/Booking';
import { TimeSlot } from '../value-objects/TimeSlot';
import { Shop } from '../entities/Shop';
import { Service } from '../entities/Service';
import { Barber } from '../entities/Barber';
import { IClock } from '../ports/IClock';

export class BookingRules {
  static canCreateBooking(
    timeSlot: TimeSlot,
    service: Service,
    barber: Barber,
    shop: Shop,
    existingBookings: Booking[],
    clock: IClock,
  ): { valid: boolean; reason?: string } {
    // Rule 1: Booking cannot be in the past
    if (timeSlot.getStartTime() <= clock.now()) {
      return { valid: false, reason: 'Cannot create booking in the past' };
    }

    // Rule 2: Barber must be active
    if (!barber.isActive) {
      return { valid: false, reason: 'Barber is not active' };
    }

    // Rule 3: Service must be active
    if (!service.isActive) {
      return { valid: false, reason: 'Service is not active' };
    }

    // Rule 4: Shop must be active
    if (!shop.isActive) {
      return { valid: false, reason: 'Shop is not active' };
    }

    // Rule 5: Time slot must be within shop operating hours
    const startHour = timeSlot.getStartTime().getHours();
    const startMinute = timeSlot.getStartTime().getMinutes();
    if (!shop.isOpenAt(startHour, startMinute)) {
      return { valid: false, reason: 'Time slot is outside shop operating hours' };
    }

    // Rule 6: Barber must be working at this time
    const dayOfWeek = timeSlot.getStartTime().getDay();
    if (!barber.isWorkingAt(dayOfWeek, startHour, startMinute)) {
      return { valid: false, reason: 'Barber is not working at this time' };
    }

    // Rule 7: Time slot duration must match service duration
    if (timeSlot.getDurationMinutes() !== service.durationMinutes) {
      return { valid: false, reason: 'Time slot duration does not match service duration' };
    }

    // Rule 8: No overlapping bookings for the same barber
    const conflictingBooking = existingBookings.find(
      (booking) =>
        booking.barberId === barber.id &&
        booking.status !== 'CANCELLED' &&
        booking.timeSlot.overlaps(timeSlot),
    );

    if (conflictingBooking) {
      return { valid: false, reason: 'Time slot is already booked for this barber' };
    }

    return { valid: true };
  }

  static canCancelBooking(booking: Booking, clock: IClock): { valid: boolean; reason?: string } {
    if (booking.status === 'CANCELLED') {
      return { valid: false, reason: 'Booking is already cancelled' };
    }

    if (booking.status === 'COMPLETED') {
      return { valid: false, reason: 'Cannot cancel completed booking' };
    }

    // Business rule: cannot cancel within 2 hours before start
    const now = clock.now();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const timeUntilStart = booking.timeSlot.getStartTime().getTime() - now.getTime();

    if (timeUntilStart < twoHoursInMs && timeUntilStart > 0) {
      return {
        valid: false,
        reason: 'Cannot cancel booking less than 2 hours before start time',
      };
    }

    return { valid: true };
  }

  static canCompleteBooking(booking: Booking): { valid: boolean; reason?: string } {
    if (booking.status === 'CANCELLED') {
      return { valid: false, reason: 'Cannot complete cancelled booking' };
    }

    if (booking.status === 'COMPLETED') {
      return { valid: false, reason: 'Booking is already completed' };
    }

    return { valid: true };
  }
}



