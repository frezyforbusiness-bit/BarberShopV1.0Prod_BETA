import { Injectable, Inject } from '@nestjs/common';
import { IServiceRepository } from '../../ports/IServiceRepository';
import { ITenantContext } from '../../ports/ITenantContext';
import { Service } from '../../../domain/entities/Service';

@Injectable()
export class ListServicesUseCase {
  constructor(
    @Inject('IServiceRepository')
    private readonly serviceRepository: IServiceRepository,
    @Inject('ITenantContext')
    private readonly tenantContext: ITenantContext,
  ) {}

  async execute(shopId?: string): Promise<Service[]> {
    const contextShopId = shopId || this.tenantContext.requireShopId();

    // If shopId provided, validate it matches context (for public endpoints)
    if (shopId) {
      const contextId = this.tenantContext.getShopId();
      if (contextId && contextId !== shopId) {
        throw new Error('Shop ID mismatch');
      }
    }

    return await this.serviceRepository.findByShopId(contextShopId);
  }
}

