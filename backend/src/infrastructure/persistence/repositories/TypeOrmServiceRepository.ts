import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IServiceRepository } from '../../../application/ports/IServiceRepository';
import { Service } from '../../../domain/entities/Service';
import { Money } from '../../../domain/value-objects/Money';
import { ServiceEntity } from '../entities/ServiceEntity';

@Injectable()
export class TypeOrmServiceRepository implements IServiceRepository {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly repository: Repository<ServiceEntity>,
  ) {}

  async findById(id: string): Promise<Service | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByShopId(shopId: string): Promise<Service[]> {
    console.log(`[TypeOrmServiceRepository] Finding services for shopId: ${shopId}`);
    try {
      const entities = await this.repository.find({ where: { shopId } });
      console.log(`[TypeOrmServiceRepository] Found ${entities.length} services in database`);
      if (entities.length === 0) {
        // Debug: verifica se ci sono servizi per altri shop
        const allServices = await this.repository.find();
        console.log(`[TypeOrmServiceRepository] Total services in DB: ${allServices.length}`);
        if (allServices.length > 0) {
          console.log(`[TypeOrmServiceRepository] Sample service shopId: ${allServices[0].shopId}, looking for: ${shopId}`);
        }
      }
      return entities.map((e) => this.toDomain(e));
    } catch (error: any) {
      console.error(`[TypeOrmServiceRepository] Error finding services:`, error.message);
      throw error;
    }
  }

  async save(service: Service): Promise<Service> {
    const entity = this.repository.create({
      id: service.id,
      shopId: service.shopId,
      name: service.name,
      description: service.description,
      durationMinutes: service.durationMinutes,
      priceAmount: service.price.getAmount().toString(),
      priceCurrency: service.price.getCurrency(),
      isActive: service.isActive,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(service: Service): Promise<Service> {
    const entity = await this.repository.findOne({ where: { id: service.id } });
    if (!entity) {
      throw new Error('Service not found');
    }
    entity.name = service.name;
    entity.description = service.description;
    entity.durationMinutes = service.durationMinutes;
    entity.priceAmount = service.price.getAmount().toString();
    entity.priceCurrency = service.price.getCurrency();
    entity.isActive = service.isActive;
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: ServiceEntity): Service {
    const price = Money.create(
      Number(entity.priceAmount),
      entity.priceCurrency,
    );
    return Service.create(
      entity.id,
      entity.shopId,
      entity.name,
      entity.description,
      entity.durationMinutes,
      price,
      entity.isActive,
    );
  }
}



