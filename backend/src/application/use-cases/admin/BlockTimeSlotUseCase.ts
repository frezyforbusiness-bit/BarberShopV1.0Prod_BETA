import { Injectable, Inject } from '@nestjs/common';
import { TimeSlot } from '../../../domain/value-objects/TimeSlot';
import { IBlockedSlotRepository } from '../../ports/IBlockedSlotRepository';
import { IBarberRepository } from '../../ports/IBarberRepository';
import { ITenantContext } from '../../ports/ITenantContext';
import { IIdGenerator } from '../../../domain/ports/IIdGenerator';
import { IClock } from '../../../domain/ports/IClock';

export interface BlockTimeSlotRequest {
  shopId: string;
  barberId: string;
  date: string; // ISO date string
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  reason: string;
}

@Injectable()
export class BlockTimeSlotUseCase {
  constructor(
    @Inject('IBlockedSlotRepository')
    private readonly blockedSlotRepository: IBlockedSlotRepository,
    @Inject('IBarberRepository')
    private readonly barberRepository: IBarberRepository,
    @Inject('ITenantContext')
    private readonly tenantContext: ITenantContext,
    @Inject('IIdGenerator')
    private readonly idGenerator: IIdGenerator,
    @Inject('IClock')
    private readonly clock: IClock,
  ) {}

  async execute(request: BlockTimeSlotRequest): Promise<void> {
    const shopId = this.tenantContext.requireShopId();

    // Validate tenant context
    if (request.shopId !== shopId) {
      throw new Error('Shop ID mismatch');
    }

    // Validate barber
    const barber = await this.barberRepository.findById(request.barberId);
    if (!barber || barber.shopId !== shopId) {
      throw new Error('Barber not found');
    }

    // Create time slot
    const bookingDate = new Date(request.date);
    bookingDate.setHours(0, 0, 0, 0);
    const timeSlot = TimeSlot.create(
      bookingDate,
      request.startHour,
      request.startMinute,
      request.durationMinutes,
    );

    // Create blocked slot
    const blockedSlot = {
      id: this.idGenerator.generate(),
      shopId,
      barberId: request.barberId,
      timeSlot,
      reason: request.reason,
      createdAt: this.clock.now(),
    };

    // Save blocked slot
    await this.blockedSlotRepository.save(blockedSlot);
  }
}


