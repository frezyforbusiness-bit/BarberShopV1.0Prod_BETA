import { Injectable, Inject } from '@nestjs/common';
import { TimeSlot } from '../../../domain/value-objects/TimeSlot';
import { ScheduleRules } from '../../../domain/rules/ScheduleRules';
import { IShopRepository } from '../../ports/IShopRepository';
import { IBarberRepository } from '../../ports/IBarberRepository';
import { IServiceRepository } from '../../ports/IServiceRepository';
import { IBookingRepository } from '../../ports/IBookingRepository';
import { IBlockedSlotRepository } from '../../ports/IBlockedSlotRepository';
import { ITenantContext } from '../../ports/ITenantContext';
import { TimeSlotDTO } from '../../dto/TimeSlotDTO';

@Injectable()
export class ListAvailableSlotsUseCase {
  constructor(
    @Inject('IShopRepository')
    private readonly shopRepository: IShopRepository,
    @Inject('IBarberRepository')
    private readonly barberRepository: IBarberRepository,
    @Inject('IServiceRepository')
    private readonly serviceRepository: IServiceRepository,
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    @Inject('IBlockedSlotRepository')
    private readonly blockedSlotRepository: IBlockedSlotRepository,
    @Inject('ITenantContext')
    private readonly tenantContext: ITenantContext,
  ) {}

  async execute(
    shopId: string,
    barberId: string,
    serviceId: string,
    date: Date,
  ): Promise<TimeSlotDTO[]> {
    // Validate tenant context
    const contextShopId = this.tenantContext.requireShopId();
    if (shopId !== contextShopId) {
      throw new Error('Shop ID mismatch');
    }

    // Load domain entities
    const shop = await this.shopRepository.findById(shopId);
    if (!shop) {
      throw new Error('Shop not found');
    }

    const barber = await this.barberRepository.findById(barberId);
    if (!barber || barber.shopId !== shopId) {
      throw new Error('Barber not found');
    }

    const service = await this.serviceRepository.findById(serviceId);
    if (!service || service.shopId !== shopId) {
      throw new Error('Service not found');
    }

    // Load existing bookings for the date
    const existingBookings =
      await this.bookingRepository.findByBarberAndDate(barberId, date);

    // Load blocked slots
    const blockedSlotsData =
      await this.blockedSlotRepository.findByBarberAndDate(barberId, date);
    const blockedSlots = blockedSlotsData.map((b) => b.timeSlot);

    // Generate available slots using business rules
    const availableSlots = ScheduleRules.generateAvailableSlots(
      date,
      barber,
      shop,
      service,
      existingBookings,
      blockedSlots,
      shop.settings.slotDurationMinutes,
    );

    // Map to DTOs
    return availableSlots.map((slot) => ({
      date: slot.getDate().toISOString().split('T')[0],
      startTime: slot.getStartTime().toISOString(),
      endTime: slot.getEndTime().toISOString(),
      durationMinutes: slot.getDurationMinutes(),
    }));
  }
}



