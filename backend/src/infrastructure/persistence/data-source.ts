import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  ShopEntity,
  UserEntity,
  BarberEntity,
  ServiceEntity,
  BookingEntity,
  BlockedSlotEntity,
} from './entities';

export const createDataSource = (configService: ConfigService) => {
  return new DataSource({
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    entities: [
      ShopEntity,
      UserEntity,
      BarberEntity,
      ServiceEntity,
      BookingEntity,
      BlockedSlotEntity,
    ],
    synchronize: false, // Usa migrations in produzione
    logging: process.env.NODE_ENV === 'development',
  });
};

