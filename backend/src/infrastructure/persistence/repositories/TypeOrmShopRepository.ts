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
    const entity = await this.repository.findOne({ where: { slug } });
    return entity ? this.toDomain(entity) : null;
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

