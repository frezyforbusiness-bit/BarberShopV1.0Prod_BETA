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
    try {
      const contextShopId = shopId || this.tenantContext.requireShopId();
      console.log(`[ListServicesUseCase] Executing with shopId: ${contextShopId}`);

      // If shopId provided, validate it matches context (for public endpoints)
      if (shopId) {
        const contextId = this.tenantContext.getShopId();
        if (contextId && contextId !== shopId) {
          throw new Error('Shop ID mismatch');
        }
      }

      const services = await this.serviceRepository.findByShopId(contextShopId);
      console.log(`[ListServicesUseCase] Returning ${services.length} services`);
      return services;
    } catch (error: any) {
      console.error('[ListServicesUseCase] Error:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  }
}



