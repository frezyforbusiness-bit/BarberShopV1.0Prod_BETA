import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../../application/ports/IServiceRepository';
import { Service } from '../../../domain/entities/Service';
import { Money } from '../../../domain/value-objects/Money';
import { PrismaService } from './PrismaService';

@Injectable()
export class PrismaServiceRepository implements IServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Service | null> {
    const prismaService = await this.prisma.service.findUnique({
      where: { id },
    });

    return prismaService ? this.toDomain(prismaService) : null;
  }

  async findByShopId(shopId: string): Promise<Service[]> {
    const prismaServices = await this.prisma.service.findMany({
      where: { shopId },
    });

    return prismaServices.map((s: any) => this.toDomain(s));
  }

  async save(service: Service): Promise<Service> {
    const prismaService = await this.prisma.service.create({
      data: {
        id: service.id,
        shopId: service.shopId,
        name: service.name,
        description: service.description,
        durationMinutes: service.durationMinutes,
        priceAmount: service.price.getAmount(),
        priceCurrency: service.price.getCurrency(),
        isActive: service.isActive,
      },
    });

    return this.toDomain(prismaService);
  }

  async update(service: Service): Promise<Service> {
    const prismaService = await this.prisma.service.update({
      where: { id: service.id },
      data: {
        name: service.name,
        description: service.description,
        durationMinutes: service.durationMinutes,
        priceAmount: service.price.getAmount(),
        priceCurrency: service.price.getCurrency(),
        isActive: service.isActive,
      },
    });

    return this.toDomain(prismaService);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({
      where: { id },
    });
  }

  private toDomain(prismaService: any): Service {
    const price = Money.create(
      Number(prismaService.priceAmount),
      prismaService.priceCurrency,
    );

    return Service.create(
      prismaService.id,
      prismaService.shopId,
      prismaService.name,
      prismaService.description,
      prismaService.durationMinutes,
      price,
      prismaService.isActive,
    );
  }
}

