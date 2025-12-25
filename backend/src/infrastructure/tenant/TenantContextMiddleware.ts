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
      // Extract shop slug from subdomain (fallback if not in URL)
      // For public domain (barbershopv10prodbeta-production.up.railway.app), 
      // slug is extracted from URL path, not subdomain
      const host = req.get('host') || '';
      const subdomain = host.split('.')[0];
      
      console.log(`[TenantContextMiddleware] Host: ${host}, Subdomain: ${subdomain}`);

      // Also check if shopId is provided in headers (for admin requests)
      const shopIdHeader = req.get('x-shop-id');
      
      // Extract slug from URL path (e.g., /api/v1/shops/barbershop/barbers -> barbershop)
      // This works for both subdomain-based (barbershop.railway.internal) and 
      // path-based (barbershopv10prodbeta-production.up.railway.app/api/v1/shops/barbershop/barbers) URLs
      // req.params is not available in middleware, so we parse the URL manually
      let shopSlugFromUrl: string | null = null;
      const path = req.path || req.url.split('?')[0];
      
      console.log(`[TenantContextMiddleware] Processing request: ${req.method} ${path}`);
      
      // Match pattern: /api/v1/shops/{slug}/...
      const shopsPattern = /\/api\/v1\/shops\/([^\/]+)/;
      const match = path.match(shopsPattern);
      if (match && match[1]) {
        shopSlugFromUrl = match[1];
        console.log(`[TenantContextMiddleware] Extracted slug from URL: ${shopSlugFromUrl}`);
      } else {
        console.log(`[TenantContextMiddleware] No slug found in URL pattern`);
      }
      
      // Il controller usa @Param('slug'), quindi il parametro si chiama 'slug'
      // Priority: URL path slug > query params (subdomain is fallback)
      const shopSlugParam = req.params?.slug || req.params?.shopSlug || shopSlugFromUrl || req.query.shopSlug || req.query.slug;
      
      console.log(`[TenantContextMiddleware] Final shopSlugParam: ${shopSlugParam || 'null'}`);

      let shopId: string | null = null;

      if (shopIdHeader) {
        shopId = shopIdHeader;
        console.log(`[TenantContextMiddleware] Using shopId from header: ${shopId}`);
      } else if (shopSlugParam) {
        try {
          console.log(`[TenantContextMiddleware] Looking up shop by slug: ${shopSlugParam}`);
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
          console.error(`❌ Error stack:`, error.stack);
        }
      } else if (subdomain && subdomain !== 'www' && subdomain !== 'admin') {
        try {
          console.log(`[TenantContextMiddleware] No slug in URL/query, trying subdomain: ${subdomain}`);
          const shop = await this.shopRepository.findBySlug(subdomain);
          if (shop) {
            shopId = shop.id;
            console.log(`✅ Shop found by subdomain: ${subdomain} -> ${shopId}`);
          } else {
            console.warn(`⚠️  Shop not found for subdomain: ${subdomain}`);
          }
        } catch (error: any) {
          console.error(`❌ Error finding shop by subdomain ${subdomain}:`, error.message);
          console.error(`❌ Error stack:`, error.stack);
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

