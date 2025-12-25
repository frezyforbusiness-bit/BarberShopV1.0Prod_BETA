import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IShopRepository } from '../../../application/ports/IShopRepository';
import { Shop, ShopSettings } from '../../../domain/entities/Shop';
import { ShopEntity } from '../entities/ShopEntity';

@Injectable()
export class TypeOrmShopRepository implements IShopRepository {
  constructor(
    @InjectRepository(ShopEntity)
    private readonly repository: Repository<ShopEntity>,
  ) {}

  async findById(id: string): Promise<Shop | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findBySlug(slug: string): Promise<Shop | null> {
    console.log(`[TypeOrmShopRepository] Finding shop by slug: ${slug}`);
    try {
      const entity = await this.repository.findOne({ where: { slug } });
      if (entity) {
        console.log(`[TypeOrmShopRepository] Shop found: ${entity.name} (id: ${entity.id}, slug: ${entity.slug})`);
      } else {
        console.log(`[TypeOrmShopRepository] Shop not found for slug: ${slug}`);
        // Debug: lista tutti gli shop
        const allShops = await this.repository.find();
        console.log(`[TypeOrmShopRepository] Total shops in DB: ${allShops.length}`);
        if (allShops.length > 0) {
          allShops.forEach(s => console.log(`  - Shop: ${s.name}, slug: ${s.slug}, id: ${s.id}`));
        }
      }
      return entity ? this.toDomain(entity) : null;
    } catch (error: any) {
      console.error(`[TypeOrmShopRepository] Error finding shop by slug:`, error.message);
      throw error;
    }
  }

  async save(shop: Shop): Promise<Shop> {
    const entity = this.repository.create({
      id: shop.id,
      name: shop.name,
      slug: shop.slug,
      settings: shop.settings as any,
      isActive: shop.isActive,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: ShopEntity): Shop {
    return Shop.create(
      entity.id,
      entity.name,
      entity.slug,
      entity.settings as ShopSettings,
      entity.isActive,
    );
  }
}



