import { TimeSlot } from '../../domain/value-objects/TimeSlot';

export interface BlockedSlot {
  id: string;
  shopId: string;
  barberId: string;
  timeSlot: TimeSlot;
  reason: string;
  createdAt: Date;
}

export interface IBlockedSlotRepository {
  findByBarberAndDate(barberId: string, date: Date): Promise<BlockedSlot[]>;
  save(blockedSlot: BlockedSlot): Promise<BlockedSlot>;
  delete(id: string): Promise<void>;
}


