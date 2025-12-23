import { Injectable } from '@nestjs/common';
import { ITenantContext } from '../../application/ports/ITenantContext';

@Injectable()
export class TenantContext implements ITenantContext {
  private shopId: string | null = null;

  getShopId(): string | null {
    return this.shopId;
  }

  requireShopId(): string {
    if (!this.shopId) {
      throw new Error('Shop ID is required but not set in tenant context');
    }
    return this.shopId;
  }

  setShopId(shopId: string): void {
    this.shopId = shopId;
  }
}

