import { Service } from '../../domain/entities/Service';

export interface IServiceRepository {
  findById(id: string): Promise<Service | null>;
  findByShopId(shopId: string): Promise<Service[]>;
  save(service: Service): Promise<Service>;
  update(service: Service): Promise<Service>;
  delete(id: string): Promise<void>;
}



