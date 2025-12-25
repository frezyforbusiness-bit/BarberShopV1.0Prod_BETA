import { Injectable, Inject } from '@nestjs/common';
import { IBookingRepository } from '../../ports/IBookingRepository';
import { IBarberRepository } from '../../ports/IBarberRepository';
import { IServiceRepository } from '../../ports/IServiceRepository';
import { ITenantContext } from '../../ports/ITenantContext';
import { BookingDTO } from '../../dto/BookingDTO';

@Injectable()
export class ListDailyBookingsUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    @Inject('IBarberRepository')
    private readonly barberRepository: IBarberRepository,
    @Inject('IServiceRepository')
    private readonly serviceRepository: IServiceRepository,
    @Inject('ITenantContext')
    private readonly tenantContext: ITenantContext,
  ) {}

  async execute(date: Date): Promise<BookingDTO[]> {
    const shopId = this.tenantContext.requireShopId();

    // Load bookings for the date
    const bookings = await this.bookingRepository.findByShopAndDate(
      shopId,
      date,
    );

    // Load barbers and services in parallel for mapping
    const barberIds = [...new Set(bookings.map((b) => b.barberId))];
    const serviceIds = [...new Set(bookings.map((b) => b.serviceId))];

    const barbers = await Promise.all(
      barberIds.map((id) => this.barberRepository.findById(id)),
    );
    const services = await Promise.all(
      serviceIds.map((id) => this.serviceRepository.findById(id)),
    );

    const barberMap = new Map(
      barbers
        .filter((b) => b !== null)
        .map((b) => [b!.id, b!]),
    );
    const serviceMap = new Map(
      services
        .filter((s) => s !== null)
        .map((s) => [s!.id, s!]),
    );

    // Map to DTOs
    return bookings.map((booking) => {
      const barber = barberMap.get(booking.barberId);
      const service = serviceMap.get(booking.serviceId);

      return {
        id: booking.id,
        shopId: booking.shopId,
        barberId: booking.barberId,
        barberName: barber?.name || 'Unknown',
        serviceId: booking.serviceId,
        serviceName: service?.name || 'Unknown',
        serviceDuration: service?.durationMinutes || 0,
        servicePrice: service?.price.getAmount() || 0,
        serviceCurrency: service?.price.getCurrency() || 'EUR',
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
    });
  }
}


