import { Module } from '@nestjs/common';
import { BookingController } from '../http/controllers/BookingController';
import { ServiceController } from '../http/controllers/ServiceController';
import { CreateBookingUseCase } from '../../application/use-cases/booking/CreateBookingUseCase';
import { ListAvailableSlotsUseCase } from '../../application/use-cases/booking/ListAvailableSlotsUseCase';
import { CancelBookingUseCase } from '../../application/use-cases/booking/CancelBookingUseCase';
import { CompleteBookingUseCase } from '../../application/use-cases/booking/CompleteBookingUseCase';
import { ListServicesUseCase } from '../../application/use-cases/service/ListServicesUseCase';
import { ListBarbersUseCase } from '../../application/use-cases/service/ListBarbersUseCase';
import { CreateServiceUseCase } from '../../application/use-cases/service/CreateServiceUseCase';
import { PrismaService } from '../../infrastructure/persistence/repositories/PrismaService';
import { PrismaBookingRepository } from '../../infrastructure/persistence/repositories/PrismaBookingRepository';
import { PrismaServiceRepository } from '../../infrastructure/persistence/repositories/PrismaServiceRepository';
import { PrismaBarberRepository } from '../../infrastructure/persistence/repositories/PrismaBarberRepository';
import { PrismaShopRepository } from '../../infrastructure/persistence/repositories/PrismaShopRepository';
import { PrismaBlockedSlotRepository } from '../../infrastructure/persistence/repositories/PrismaBlockedSlotRepository';
import { EmailService } from '../../infrastructure/notifications/EmailService';
import { TenantContext } from '../../infrastructure/tenant/TenantContext';
import { SystemClock } from '../../infrastructure/adapters/SystemClock';
import { UuidGenerator } from '../../infrastructure/adapters/UuidGenerator';

@Module({
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
    PrismaService,
    {
      provide: 'IBookingRepository',
      useClass: PrismaBookingRepository,
    },
    {
      provide: 'IServiceRepository',
      useClass: PrismaServiceRepository,
    },
    {
      provide: 'IBarberRepository',
      useClass: PrismaBarberRepository,
    },
    {
      provide: 'IShopRepository',
      useClass: PrismaShopRepository,
    },
    {
      provide: 'IBlockedSlotRepository',
      useClass: PrismaBlockedSlotRepository,
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

