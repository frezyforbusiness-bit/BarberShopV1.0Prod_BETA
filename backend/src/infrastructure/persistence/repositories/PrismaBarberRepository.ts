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
    try {
      // Assicurati che workSchedule sia sempre presente e valido
      if (!prismaBarber.workSchedule) {
        console.error('Barber workSchedule is missing for barber:', prismaBarber.id);
        // Usa un workSchedule di default se mancante
        prismaBarber.workSchedule = {
          monday: { start: '09:00', end: '18:00', isWorking: true },
          tuesday: { start: '09:00', end: '18:00', isWorking: true },
          wednesday: { start: '09:00', end: '18:00', isWorking: true },
          thursday: { start: '09:00', end: '18:00', isWorking: true },
          friday: { start: '09:00', end: '18:00', isWorking: true },
          saturday: { start: '09:00', end: '13:00', isWorking: true },
          sunday: { start: '09:00', end: '13:00', isWorking: false },
        };
      }
      
      return Barber.create(
        prismaBarber.id,
        prismaBarber.shopId,
        prismaBarber.name,
        prismaBarber.workSchedule as WorkSchedule,
        prismaBarber.isActive ?? true,
      );
    } catch (error: any) {
      console.error('Error converting barber to domain:', error.message);
      console.error('Barber data:', JSON.stringify(prismaBarber, null, 2));
      throw new Error(`Failed to convert barber to domain: ${error.message}`);
    }
  }
}

