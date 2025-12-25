import { Shop } from '../../domain/entities/Shop';

export interface IShopRepository {
  findById(id: string): Promise<Shop | null>;
  findBySlug(slug: string): Promise<Shop | null>;
  save(shop: Shop): Promise<Shop>;
}



