import { Injectable, Inject } from '@nestjs/common';
import { Service } from '../../../domain/entities/Service';
import { Money } from '../../../domain/value-objects/Money';
import { IServiceRepository } from '../../ports/IServiceRepository';
import { ITenantContext } from '../../ports/ITenantContext';
import { IIdGenerator } from '../../../domain/ports/IIdGenerator';

export interface CreateServiceRequest {
  shopId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  currency?: string;
}

@Injectable()
export class CreateServiceUseCase {
  constructor(
    @Inject('IServiceRepository')
    private readonly serviceRepository: IServiceRepository,
    @Inject('ITenantContext')
    private readonly tenantContext: ITenantContext,
    @Inject('IIdGenerator')
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(request: CreateServiceRequest): Promise<Service> {
    const shopId = this.tenantContext.requireShopId();

    // Validate tenant context
    if (request.shopId !== shopId) {
      throw new Error('Shop ID mismatch');
    }

    // Create value objects
    const price = Money.create(request.price, request.currency || 'EUR');

    // Create service entity
    const service = Service.create(
      this.idGenerator.generate(),
      shopId,
      request.name,
      request.description,
      request.durationMinutes,
      price,
    );

    // Save service
    return await this.serviceRepository.save(service);
  }
}

