import { Injectable } from '@nestjs/common';
import { IShopRepository } from '../../../application/ports/IShopRepository';
import { Shop, ShopSettings } from '../../../domain/entities/Shop';
import { PrismaService } from './PrismaService';

@Injectable()
export class PrismaShopRepository implements IShopRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Shop | null> {
    const prismaShop = await this.prisma.shop.findUnique({
      where: { id },
    });

    return prismaShop ? this.toDomain(prismaShop) : null;
  }

  async findBySlug(slug: string): Promise<Shop | null> {
    const prismaShop = await this.prisma.shop.findUnique({
      where: { slug },
    });

    return prismaShop ? this.toDomain(prismaShop) : null;
  }

  async save(shop: Shop): Promise<Shop> {
    const prismaShop = await this.prisma.shop.create({
      data: {
        id: shop.id,
        name: shop.name,
        slug: shop.slug,
        settings: shop.settings as any,
        isActive: shop.isActive,
      },
    });

    return this.toDomain(prismaShop);
  }

  private toDomain(prismaShop: any): Shop {
    return Shop.create(
      prismaShop.id,
      prismaShop.name,
      prismaShop.slug,
      prismaShop.settings as ShopSettings,
      prismaShop.isActive,
    );
  }
}


