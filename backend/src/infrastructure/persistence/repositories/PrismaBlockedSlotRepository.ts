import { Injectable } from '@nestjs/common';
import {
  IBlockedSlotRepository,
  BlockedSlot,
} from '../../../application/ports/IBlockedSlotRepository';
import { TimeSlot } from '../../../domain/value-objects/TimeSlot';
import { PrismaService } from './PrismaService';

@Injectable()
export class PrismaBlockedSlotRepository implements IBlockedSlotRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByBarberAndDate(
    barberId: string,
    date: Date,
  ): Promise<BlockedSlot[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const prismaSlots = await this.prisma.blockedSlot.findMany({
      where: {
        barberId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return prismaSlots.map((s: any) => this.toDomain(s));
  }

  async save(blockedSlot: BlockedSlot): Promise<BlockedSlot> {
    const prismaSlot = await this.prisma.blockedSlot.create({
      data: {
        id: blockedSlot.id,
        shopId: blockedSlot.shopId,
        barberId: blockedSlot.barberId,
        date: blockedSlot.timeSlot.getDate(),
        startTime: blockedSlot.timeSlot.getStartTime(),
        endTime: blockedSlot.timeSlot.getEndTime(),
        reason: blockedSlot.reason,
        createdAt: blockedSlot.createdAt,
      },
    });

    return this.toDomain(prismaSlot);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.blockedSlot.delete({
      where: { id },
    });
  }

  private toDomain(prismaSlot: any): BlockedSlot {
    const timeSlot = TimeSlot.fromDates(
      new Date(prismaSlot.startTime),
      new Date(prismaSlot.endTime),
    );

    return {
      id: prismaSlot.id,
      shopId: prismaSlot.shopId,
      barberId: prismaSlot.barberId,
      timeSlot,
      reason: prismaSlot.reason,
      createdAt: new Date(prismaSlot.createdAt),
    };
  }
}

