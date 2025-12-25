import { Injectable, Inject } from '@nestjs/common';
import { IBarberRepository } from '../../ports/IBarberRepository';
import { ITenantContext } from '../../ports/ITenantContext';
import { Barber } from '../../../domain/entities/Barber';

@Injectable()
export class ListBarbersUseCase {
  constructor(
    @Inject('IBarberRepository')
    private readonly barberRepository: IBarberRepository,
    @Inject('ITenantContext')
    private readonly tenantContext: ITenantContext,
  ) {}

  async execute(shopId?: string): Promise<Barber[]> {
    const contextShopId = shopId || this.tenantContext.requireShopId();

    // If shopId provided, validate it matches context (for public endpoints)
    if (shopId) {
      const contextId = this.tenantContext.getShopId();
      if (contextId && contextId !== shopId) {
        throw new Error('Shop ID mismatch');
      }
    }

    const barbers = await this.barberRepository.findByShopId(contextShopId);
    // Only return active barbers for public endpoints
    return shopId ? barbers.filter((b) => b.isActive) : barbers;
  }
}



