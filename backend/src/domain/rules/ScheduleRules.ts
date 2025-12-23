import { TimeSlot } from '../value-objects/TimeSlot';
import { Shop } from '../entities/Shop';
import { Barber } from '../entities/Barber';
import { Booking } from '../entities/Booking';
import { Service } from '../entities/Service';

export class ScheduleRules {
  static generateAvailableSlots(
    date: Date,
    barber: Barber,
    shop: Shop,
    service: Service,
    existingBookings: Booking[],
    blockedSlots: TimeSlot[],
    slotDurationMinutes: number = 30,
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const dayOfWeek = date.getDay();

    // Check if barber is working this day
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[dayOfWeek] as keyof typeof barber.workSchedule;
    const daySchedule = barber.workSchedule[dayName];

    if (!daySchedule.isWorking) {
      return [];
    }

    // Parse working hours
    const [startHour, startMinute] = daySchedule.start.split(':').map(Number);
    const [endHour, endMinute] = daySchedule.end.split(':').map(Number);

    // Ensure shop hours are respected
    const [shopStartHour, shopStartMinute] = shop.settings.openingTime.split(':').map(Number);
    const [shopEndHour, shopEndMinute] = shop.settings.closingTime.split(':').map(Number);

    const actualStartMinutes = Math.max(
      startHour * 60 + startMinute,
      shopStartHour * 60 + shopStartMinute,
    );
    const actualEndMinutes = Math.min(
      endHour * 60 + endMinute,
      shopEndHour * 60 + shopEndMinute,
    );

    // Generate slots
    let currentMinutes = actualStartMinutes;

    while (currentMinutes + service.durationMinutes <= actualEndMinutes) {
      const hour = Math.floor(currentMinutes / 60);
      const minute = currentMinutes % 60;

      try {
        const slot = TimeSlot.create(date, hour, minute, service.durationMinutes);

        // Check if slot overlaps with existing bookings
        const hasConflict = existingBookings.some(
          (booking) =>
            booking.barberId === barber.id &&
            booking.status !== 'CANCELLED' &&
            booking.timeSlot.overlaps(slot),
        );

        // Check if slot is blocked
        const isBlocked = blockedSlots.some((blocked) => blocked.overlaps(slot));

        if (!hasConflict && !isBlocked) {
          slots.push(slot);
        }

        currentMinutes += slotDurationMinutes;
      } catch (error) {
        // Invalid slot, skip
        currentMinutes += slotDurationMinutes;
      }
    }

    return slots;
  }

  static isSlotAvailable(
    timeSlot: TimeSlot,
    barber: Barber,
    shop: Shop,
    service: Service,
    existingBookings: Booking[],
    blockedSlots: TimeSlot[],
  ): boolean {
    const dayOfWeek = timeSlot.getStartTime().getDay();
    const startHour = timeSlot.getStartTime().getHours();
    const startMinute = timeSlot.getStartTime().getMinutes();

    // Check barber is working
    if (!barber.isWorkingAt(dayOfWeek, startHour, startMinute)) {
      return false;
    }

    // Check shop is open
    if (!shop.isOpenAt(startHour, startMinute)) {
      return false;
    }

    // Check duration matches
    if (timeSlot.getDurationMinutes() !== service.durationMinutes) {
      return false;
    }

    // Check conflicts with bookings
    const hasConflict = existingBookings.some(
      (booking) =>
        booking.barberId === barber.id &&
        booking.status !== 'CANCELLED' &&
        booking.timeSlot.overlaps(timeSlot),
    );

    if (hasConflict) {
      return false;
    }

    // Check blocked slots
    const isBlocked = blockedSlots.some((blocked) => blocked.overlaps(timeSlot));

    return !isBlocked;
  }
}

