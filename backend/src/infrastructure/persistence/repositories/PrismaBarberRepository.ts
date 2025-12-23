import { Injectable } from '@nestjs/common';
import { IBarberRepository } from '../../../application/ports/IBarberRepository';
import { Barber, WorkSchedule } from '../../../domain/entities/Barber';
import { PrismaService } from './PrismaService';

@Injectable()
export class PrismaBarberRepository implements IBarberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Barber | null> {
    const prismaBarber = await this.prisma.barber.findUnique({
      where: { id },
    });

    return prismaBarber ? this.toDomain(prismaBarber) : null;
  }

  async findByShopId(shopId: string): Promise<Barber[]> {
    const prismaBarbers = await this.prisma.barber.findMany({
      where: { shopId },
    });

    return prismaBarbers.map((b: any) => this.toDomain(b));
  }

  async save(barber: Barber): Promise<Barber> {
    const prismaBarber = await this.prisma.barber.create({
      data: {
        id: barber.id,
        shopId: barber.shopId,
        name: barber.name,
        workSchedule: barber.workSchedule as any,
        isActive: barber.isActive,
      },
    });

    return this.toDomain(prismaBarber);
  }

  private toDomain(prismaBarber: any): Barber {
    return Barber.create(
      prismaBarber.id,
      prismaBarber.shopId,
      prismaBarber.name,
      prismaBarber.workSchedule as WorkSchedule,
      prismaBarber.isActive,
    );
  }
}

