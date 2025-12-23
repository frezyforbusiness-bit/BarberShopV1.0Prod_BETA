import { Barber } from '../../domain/entities/Barber';

export interface IBarberRepository {
  findById(id: string): Promise<Barber | null>;
  findByShopId(shopId: string): Promise<Barber[]>;
  save(barber: Barber): Promise<Barber>;
}

