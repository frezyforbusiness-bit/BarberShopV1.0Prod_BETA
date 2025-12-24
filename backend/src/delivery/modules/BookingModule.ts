import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from '../http/controllers/BookingController';
import { ServiceController } from '../http/controllers/ServiceController';
import { CreateBookingUseCase } from '../../application/use-cases/booking/CreateBookingUseCase';
import { ListAvailableSlotsUseCase } from '../../application/use-cases/booking/ListAvailableSlotsUseCase';
import { CancelBookingUseCase } from '../../application/use-cases/booking/CancelBookingUseCase';
import { CompleteBookingUseCase } from '../../application/use-cases/booking/CompleteBookingUseCase';
import { ListServicesUseCase } from '../../application/use-cases/service/ListServicesUseCase';
import { ListBarbersUseCase } from '../../application/use-cases/service/ListBarbersUseCase';
import { CreateServiceUseCase } from '../../application/use-cases/service/CreateServiceUseCase';
import { TypeOrmBookingRepository } from '../../infrastructure/persistence/repositories/TypeOrmBookingRepository';
import { TypeOrmServiceRepository } from '../../infrastructure/persistence/repositories/TypeOrmServiceRepository';
import { TypeOrmBarberRepository } from '../../infrastructure/persistence/repositories/TypeOrmBarberRepository';
import { TypeOrmShopRepository } from '../../infrastructure/persistence/repositories/TypeOrmShopRepository';
import { TypeOrmBlockedSlotRepository } from '../../infrastructure/persistence/repositories/TypeOrmBlockedSlotRepository';
import { EmailService } from '../../infrastructure/notifications/EmailService';
import { TenantContext } from '../../infrastructure/tenant/TenantContext';
import { SystemClock } from '../../infrastructure/adapters/SystemClock';
import { UuidGenerator } from '../../infrastructure/adapters/UuidGenerator';
import {
  BookingEntity,
  ServiceEntity,
  BarberEntity,
  ShopEntity,
  BlockedSlotEntity,
} from '../../infrastructure/persistence/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      ServiceEntity,
      BarberEntity,
      ShopEntity,
      BlockedSlotEntity,
    ]),
  ],
  controllers: [BookingController, ServiceController],
  providers: [
    // Use Cases
    CreateBookingUseCase,
    ListAvailableSlotsUseCase,
    CancelBookingUseCase,
    CompleteBookingUseCase,
    ListServicesUseCase,
    ListBarbersUseCase,
    CreateServiceUseCase,

    // Repositories
    {
      provide: 'IBookingRepository',
      useClass: TypeOrmBookingRepository,
    },
    {
      provide: 'IServiceRepository',
      useClass: TypeOrmServiceRepository,
    },
    {
      provide: 'IBarberRepository',
      useClass: TypeOrmBarberRepository,
    },
    {
      provide: 'IShopRepository',
      useClass: TypeOrmShopRepository,
    },
    {
      provide: 'IBlockedSlotRepository',
      useClass: TypeOrmBlockedSlotRepository,
    },

    // Services
    {
      provide: 'INotificationService',
      useClass: EmailService,
    },
    {
      provide: 'ITenantContext',
      useClass: TenantContext,
    },
    {
      provide: 'IClock',
      useClass: SystemClock,
    },
    {
      provide: 'IIdGenerator',
      useClass: UuidGenerator,
    },
  ],
  exports: [
    'IBookingRepository',
    'IServiceRepository',
    'IBarberRepository',
    'IShopRepository',
    'IBlockedSlotRepository',
  ],
})
export class BookingModule {}

