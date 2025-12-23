import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { BookingModule } from './BookingModule';
import { AdminModule } from './AdminModule';
import { TenantContextMiddleware } from '../../infrastructure/tenant/TenantContextMiddleware';
import { TenantContext } from '../../infrastructure/tenant/TenantContext';
import { TypeOrmShopRepository } from '../../infrastructure/persistence/repositories/TypeOrmShopRepository';
import { DomainExceptionFilter } from '../http/filters/DomainExceptionFilter';
import {
  ShopEntity,
  UserEntity,
  BarberEntity,
  ServiceEntity,
  BookingEntity,
  BlockedSlotEntity,
} from '../../infrastructure/persistence/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
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
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      ShopEntity,
      UserEntity,
      BarberEntity,
      ServiceEntity,
      BookingEntity,
      BlockedSlotEntity,
    ]),
    BookingModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    TenantContext,
    {
      provide: 'IShopRepository',
      useClass: TypeOrmShopRepository,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantContextMiddleware)
      .forRoutes('*');
  }
}

