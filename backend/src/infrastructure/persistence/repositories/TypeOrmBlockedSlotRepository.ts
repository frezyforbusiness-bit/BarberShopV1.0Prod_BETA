import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  IBlockedSlotRepository,
  BlockedSlot,
} from '../../../application/ports/IBlockedSlotRepository';
import { TimeSlot } from '../../../domain/value-objects/TimeSlot';
import { BlockedSlotEntity } from '../entities/BlockedSlotEntity';

@Injectable()
export class TypeOrmBlockedSlotRepository implements IBlockedSlotRepository {
  constructor(
    @InjectRepository(BlockedSlotEntity)
    private readonly repository: Repository<BlockedSlotEntity>,
  ) {}

  async findByBarberAndDate(
    barberId: string,
    date: Date,
  ): Promise<BlockedSlot[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const entities = await this.repository.find({
      where: {
        barberId,
        date: Between(startOfDay, endOfDay),
      },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async save(blockedSlot: BlockedSlot): Promise<BlockedSlot> {
    const entity = this.repository.create({
      id: blockedSlot.id,
      shopId: blockedSlot.shopId,
      barberId: blockedSlot.barberId,
      date: blockedSlot.timeSlot.getDate(),
      startTime: blockedSlot.timeSlot.getStartTime(),
      endTime: blockedSlot.timeSlot.getEndTime(),
      reason: blockedSlot.reason,
      createdAt: blockedSlot.createdAt,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: BlockedSlotEntity): BlockedSlot {
    const timeSlot = TimeSlot.fromDates(
      new Date(entity.startTime),
      new Date(entity.endTime),
    );
    return {
      id: entity.id,
      shopId: entity.shopId,
      barberId: entity.barberId,
      timeSlot,
      reason: entity.reason,
      createdAt: new Date(entity.createdAt),
    };
  }
}

