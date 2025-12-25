import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBarberRepository } from '../../../application/ports/IBarberRepository';
import { Barber, WorkSchedule } from '../../../domain/entities/Barber';
import { BarberEntity } from '../entities/BarberEntity';

@Injectable()
export class TypeOrmBarberRepository implements IBarberRepository {
  constructor(
    @InjectRepository(BarberEntity)
    private readonly repository: Repository<BarberEntity>,
  ) {}

  async findById(id: string): Promise<Barber | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByShopId(shopId: string): Promise<Barber[]> {
    const entities = await this.repository.find({ where: { shopId } });
    return entities.map((e) => this.toDomain(e));
  }

  async save(barber: Barber): Promise<Barber> {
    const entity = this.repository.create({
      id: barber.id,
      shopId: barber.shopId,
      name: barber.name,
      workSchedule: barber.workSchedule as any,
      isActive: barber.isActive,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: BarberEntity): Barber {
    return Barber.create(
      entity.id,
      entity.shopId,
      entity.name,
      entity.workSchedule as WorkSchedule,
      entity.isActive,
    );
  }
}


