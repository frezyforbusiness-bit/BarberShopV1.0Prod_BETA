import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './TenantContext';
import { IShopRepository } from '../../application/ports/IShopRepository';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantContext: TenantContext,
    @Inject('IShopRepository')
    private readonly shopRepository: IShopRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract shop slug from subdomain (e.g., barbershop1.app.com -> barbershop1)
      const host = req.get('host') || '';
      const subdomain = host.split('.')[0];

      // Also check if shopId is provided in headers (for admin requests)
      const shopIdHeader = req.get('x-shop-id');
      // Il controller usa @Param('slug'), quindi il parametro si chiama 'slug'
      const shopSlugParam = req.params.slug || req.params.shopSlug || req.query.shopSlug || req.query.slug;

      let shopId: string | null = null;

      if (shopIdHeader) {
        shopId = shopIdHeader;
      } else if (shopSlugParam) {
        try {
          const shop = await this.shopRepository.findBySlug(
            shopSlugParam as string,
          );
          if (shop) {
            shopId = shop.id;
            console.log(`✅ Shop found: ${shopSlugParam} -> ${shopId}`);
          } else {
            console.warn(`⚠️  Shop not found for slug: ${shopSlugParam}`);
          }
        } catch (error: any) {
          console.error(`❌ Error finding shop by slug ${shopSlugParam}:`, error.message);
        }
      } else if (subdomain && subdomain !== 'www' && subdomain !== 'admin') {
        try {
          const shop = await this.shopRepository.findBySlug(subdomain);
          if (shop) {
            shopId = shop.id;
          }
        } catch (error: any) {
          console.error(`❌ Error finding shop by subdomain ${subdomain}:`, error.message);
        }
      }

      if (shopId) {
        this.tenantContext.setShopId(shopId);
      } else {
        console.warn(`⚠️  No shop ID resolved for request: ${req.method} ${req.path}`);
      }

      next();
    } catch (error: any) {
      console.error('❌ TenantContextMiddleware error:', error.message);
      console.error('Stack:', error.stack);
      next(error);
    }
  }
}

