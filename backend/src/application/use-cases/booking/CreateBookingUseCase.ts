import { Injectable, Inject } from '@nestjs/common';
import { Booking } from '../../../domain/entities/Booking';
import { TimeSlot } from '../../../domain/value-objects/TimeSlot';
import { Email } from '../../../domain/value-objects/Email';
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber';
import { BookingRules } from '../../../domain/rules/BookingRules';
import { IBookingRepository } from '../../ports/IBookingRepository';
import { IShopRepository } from '../../ports/IShopRepository';
import { IBarberRepository } from '../../ports/IBarberRepository';
import { IServiceRepository } from '../../ports/IServiceRepository';
import { INotificationService } from '../../ports/INotificationService';
import { ITenantContext } from '../../ports/ITenantContext';
import { IIdGenerator } from '../../../domain/ports/IIdGenerator';
import { IClock } from '../../../domain/ports/IClock';
import { CreateBookingRequest } from '../../dto/CreateBookingRequest';
import { BookingDTO } from '../../dto/BookingDTO';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    @Inject('IShopRepository')
    private readonly shopRepository: IShopRepository,
    @Inject('IBarberRepository')
    private readonly barberRepository: IBarberRepository,
    @Inject('IServiceRepository')
    private readonly serviceRepository: IServiceRepository,
    @Inject('INotificationService')
    private readonly notificationService: INotificationService,
    @Inject('ITenantContext')
    private readonly tenantContext: ITenantContext,
    @Inject('IIdGenerator')
    private readonly idGenerator: IIdGenerator,
    @Inject('IClock')
    private readonly clock: IClock,
  ) {}

  async execute(request: CreateBookingRequest): Promise<BookingDTO> {
    const shopId = this.tenantContext.requireShopId();

    // Validate tenant context
    if (request.shopId !== shopId) {
      throw new Error('Shop ID mismatch');
    }

    // Load domain entities
    const shop = await this.shopRepository.findById(shopId);
    if (!shop) {
      throw new Error('Shop not found');
    }

    const service = await this.serviceRepository.findById(request.serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    if (service.shopId !== shopId) {
      throw new Error('Service does not belong to shop');
    }

    const barber = await this.barberRepository.findById(request.barberId);
    if (!barber) {
      throw new Error('Barber not found');
    }

    if (barber.shopId !== shopId) {
      throw new Error('Barber does not belong to shop');
    }

    // Create value objects
    const customerPhone = PhoneNumber.create(request.customerPhone);
    const customerEmail = request.customerEmail
      ? Email.create(request.customerEmail)
      : null;

    // Parse date
    const bookingDate = new Date(request.date);
    bookingDate.setHours(0, 0, 0, 0);

    // Create time slot
    const timeSlot = TimeSlot.create(
      bookingDate,
      request.startHour,
      request.startMinute,
      service.durationMinutes,
    );

    // Check for existing bookings
    const existingBookings =
      await this.bookingRepository.findOverlappingBookings(
        barber.id,
        timeSlot,
      );

    // Validate business rules
    const validation = BookingRules.canCreateBooking(
      timeSlot,
      service,
      barber,
      shop,
      existingBookings,
      this.clock,
    );

    if (!validation.valid) {
      throw new Error(validation.reason);
    }

    // Generate IDs and cancellation code
    const bookingId = this.idGenerator.generate();
    const cancellationCode = this.generateCancellationCode();

    // Create booking entity
    const booking = Booking.create(
      bookingId,
      shopId,
      barber.id,
      service.id,
      request.customerName,
      customerPhone,
      customerEmail,
      timeSlot,
      cancellationCode,
      this.clock,
    );

    // Save booking
    const savedBooking = await this.bookingRepository.save(booking);

    // Send confirmation notification
    await this.notificationService.sendBookingConfirmation(savedBooking);

    // Map to DTO
    return this.mapToDTO(savedBooking, barber.name, service);
  }

  private generateCancellationCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private mapToDTO(
    booking: Booking,
    barberName: string,
    service: {
      name: string;
      durationMinutes: number;
      price: { getAmount(): number; getCurrency(): string };
    },
  ): BookingDTO {
    return {
      id: booking.id,
      shopId: booking.shopId,
      barberId: booking.barberId,
      barberName,
      serviceId: booking.serviceId,
      serviceName: service.name,
      serviceDuration: service.durationMinutes,
      servicePrice: service.price.getAmount(),
      serviceCurrency: service.price.getCurrency(),
      customerName: booking.customerName,
      customerPhone: booking.customerPhone.getValue(),
      customerEmail: booking.customerEmail?.getValue() || null,
      date: booking.timeSlot.getDate().toISOString().split('T')[0],
      startTime: booking.timeSlot.getStartTime().toISOString(),
      endTime: booking.timeSlot.getEndTime().toISOString(),
      status: booking.status,
      cancellationCode: booking.cancellationCode,
      createdAt: booking.createdAt.toISOString(),
    };
  }
}


