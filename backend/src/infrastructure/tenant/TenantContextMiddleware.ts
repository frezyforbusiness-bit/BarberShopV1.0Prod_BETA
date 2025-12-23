import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './TenantContext';
import { IShopRepository } from '../../application/ports/IShopRepository';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantContext: TenantContext,
    private readonly shopRepository: IShopRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract shop slug from subdomain (e.g., barbershop1.app.com -> barbershop1)
    const host = req.get('host') || '';
    const subdomain = host.split('.')[0];

    // Also check if shopId is provided in headers (for admin requests)
    const shopIdHeader = req.get('x-shop-id');
    const shopSlugParam = req.params.shopSlug || req.query.shopSlug;

    let shopId: string | null = null;

    if (shopIdHeader) {
      shopId = shopIdHeader;
    } else if (shopSlugParam) {
      const shop = await this.shopRepository.findBySlug(
        shopSlugParam as string,
      );
      if (shop) {
        shopId = shop.id;
      }
    } else if (subdomain && subdomain !== 'www' && subdomain !== 'admin') {
      const shop = await this.shopRepository.findBySlug(subdomain);
      if (shop) {
        shopId = shop.id;
      }
    }

    if (shopId) {
      this.tenantContext.setShopId(shopId);
    }

    next();
  }
}

