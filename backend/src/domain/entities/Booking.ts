import { TimeSlot } from '../value-objects/TimeSlot';
import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';
import { IClock } from '../ports/IClock';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class Booking {
  private constructor(
    public readonly id: string,
    public readonly shopId: string,
    public readonly barberId: string,
    public readonly serviceId: string,
    public readonly customerName: string,
    public readonly customerPhone: PhoneNumber,
    public readonly customerEmail: Email | null,
    public readonly timeSlot: TimeSlot,
    public readonly status: BookingStatus,
    public readonly createdAt: Date,
    public readonly cancellationCode: string,
  ) {}

  static create(
    id: string,
    shopId: string,
    barberId: string,
    serviceId: string,
    customerName: string,
    customerPhone: PhoneNumber,
    customerEmail: Email | null,
    timeSlot: TimeSlot,
    cancellationCode: string,
    clock: IClock,
  ): Booking {
    if (!id || !id.trim()) {
      throw new Error('Booking ID cannot be empty');
    }
    if (!shopId || !shopId.trim()) {
      throw new Error('Shop ID cannot be empty');
    }
    if (!barberId || !barberId.trim()) {
      throw new Error('Barber ID cannot be empty');
    }
    if (!serviceId || !serviceId.trim()) {
      throw new Error('Service ID cannot be empty');
    }
    if (!customerName || !customerName.trim()) {
      throw new Error('Customer name cannot be empty');
    }
    if (!cancellationCode || !cancellationCode.trim()) {
      throw new Error('Cancellation code cannot be empty');
    }

    // Business rule: cannot create booking in the past
    const now = clock.now();
    if (timeSlot.getStartTime() <= now) {
      throw new Error('Cannot create booking in the past');
    }

    return new Booking(
      id,
      shopId,
      barberId,
      serviceId,
      customerName,
      customerPhone,
      customerEmail,
      timeSlot,
      BookingStatus.PENDING,
      now,
      cancellationCode,
    );
  }

  static reconstruct(
    id: string,
    shopId: string,
    barberId: string,
    serviceId: string,
    customerName: string,
    customerPhone: PhoneNumber,
    customerEmail: Email | null,
    timeSlot: TimeSlot,
    status: BookingStatus,
    createdAt: Date,
    cancellationCode: string,
  ): Booking {
    return new Booking(
      id,
      shopId,
      barberId,
      serviceId,
      customerName,
      customerPhone,
      customerEmail,
      timeSlot,
      status,
      createdAt,
      cancellationCode,
    );
  }

  confirm(): Booking {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be confirmed');
    }
    return new Booking(
      this.id,
      this.shopId,
      this.barberId,
      this.serviceId,
      this.customerName,
      this.customerPhone,
      this.customerEmail,
      this.timeSlot,
      BookingStatus.CONFIRMED,
      this.createdAt,
      this.cancellationCode,
    );
  }

  complete(): Booking {
    if (this.status !== BookingStatus.CONFIRMED && this.status !== BookingStatus.PENDING) {
      throw new Error('Only confirmed or pending bookings can be completed');
    }
    return new Booking(
      this.id,
      this.shopId,
      this.barberId,
      this.serviceId,
      this.customerName,
      this.customerPhone,
      this.customerEmail,
      this.timeSlot,
      BookingStatus.COMPLETED,
      this.createdAt,
      this.cancellationCode,
    );
  }

  cancel(clock: IClock): Booking {
    if (this.status === BookingStatus.CANCELLED) {
      throw new Error('Booking is already cancelled');
    }
    if (this.status === BookingStatus.COMPLETED) {
      throw new Error('Cannot cancel completed booking');
    }

    // Business rule: cannot cancel within 2 hours before start
    const now = clock.now();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const timeUntilStart = this.timeSlot.getStartTime().getTime() - now.getTime();

    if (timeUntilStart < twoHoursInMs && timeUntilStart > 0) {
      throw new Error('Cannot cancel booking less than 2 hours before start time');
    }

    return new Booking(
      this.id,
      this.shopId,
      this.barberId,
      this.serviceId,
      this.customerName,
      this.customerPhone,
      this.customerEmail,
      this.timeSlot,
      BookingStatus.CANCELLED,
      this.createdAt,
      this.cancellationCode,
    );
  }

  canBeCancelled(clock: IClock): boolean {
    if (this.status === BookingStatus.CANCELLED || this.status === BookingStatus.COMPLETED) {
      return false;
    }

    const now = clock.now();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const timeUntilStart = this.timeSlot.getStartTime().getTime() - now.getTime();

    return timeUntilStart >= twoHoursInMs;
  }

  verifyCancellationCode(code: string): boolean {
    return this.cancellationCode === code;
  }
}

