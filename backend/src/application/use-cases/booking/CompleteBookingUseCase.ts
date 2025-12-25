import { Injectable, Inject } from '@nestjs/common';
import { BookingRules } from '../../../domain/rules/BookingRules';
import { IBookingRepository } from '../../ports/IBookingRepository';

@Injectable()
export class CompleteBookingUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(bookingId: string): Promise<void> {
    // Find booking
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Validate business rules
    const validation = BookingRules.canCompleteBooking(booking);
    if (!validation.valid) {
      throw new Error(validation.reason);
    }

    // Complete booking
    const completedBooking = booking.complete();

    // Save completed booking
    await this.bookingRepository.update(completedBooking);
  }
}



