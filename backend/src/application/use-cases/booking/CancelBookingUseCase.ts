import { Injectable, Inject } from '@nestjs/common';
import { BookingRules } from '../../../domain/rules/BookingRules';
import { IBookingRepository } from '../../ports/IBookingRepository';
import { INotificationService } from '../../ports/INotificationService';
import { IClock } from '../../../domain/ports/IClock';

@Injectable()
export class CancelBookingUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    @Inject('INotificationService')
    private readonly notificationService: INotificationService,
    @Inject('IClock')
    private readonly clock: IClock,
  ) {}

  async execute(bookingId: string, cancellationCode: string): Promise<void> {
    // Find booking
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Verify cancellation code
    if (!booking.verifyCancellationCode(cancellationCode)) {
      throw new Error('Invalid cancellation code');
    }

    // Validate business rules
    const validation = BookingRules.canCancelBooking(booking, this.clock);
    if (!validation.valid) {
      throw new Error(validation.reason);
    }

    // Cancel booking
    const cancelledBooking = booking.cancel(this.clock);

    // Save cancelled booking
    await this.bookingRepository.update(cancelledBooking);

    // Send cancellation notification
    await this.notificationService.sendBookingCancellation(cancelledBooking);
  }
}

