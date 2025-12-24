import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from '../http/controllers/AdminController';
import { AdminLoginUseCase } from '../../application/use-cases/admin/AdminLoginUseCase';
import { ListDailyBookingsUseCase } from '../../application/use-cases/admin/ListDailyBookingsUseCase';
import { BlockTimeSlotUseCase } from '../../application/use-cases/admin/BlockTimeSlotUseCase';
import { CompleteBookingUseCase } from '../../application/use-cases/booking/CompleteBookingUseCase';
import { JwtStrategy } from '../../infrastructure/auth/JwtStrategy';
import { JwtAuthService } from '../../infrastructure/auth/JwtAuthService';
import { TypeOrmUserRepository } from '../../infrastructure/persistence/repositories/TypeOrmUserRepository';
import { TypeOrmBookingRepository } from '../../infrastructure/persistence/repositories/TypeOrmBookingRepository';
import { TypeOrmBarberRepository } from '../../infrastructure/persistence/repositories/TypeOrmBarberRepository';
import { TypeOrmServiceRepository } from '../../infrastructure/persistence/repositories/TypeOrmServiceRepository';
import { TypeOrmBlockedSlotRepository } from '../../infrastructure/persistence/repositories/TypeOrmBlockedSlotRepository';
import { TenantContext } from '../../infrastructure/tenant/TenantContext';
import { SystemClock } from '../../infrastructure/adapters/SystemClock';
import { UuidGenerator } from '../../infrastructure/adapters/UuidGenerator';
import {
  UserEntity,
  BookingEntity,
  BarberEntity,
  ServiceEntity,
  BlockedSlotEntity,
} from '../../infrastructure/persistence/entities';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      BookingEntity,
      BarberEntity,
      ServiceEntity,
      BlockedSlotEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [
    // Use Cases
    AdminLoginUseCase,
    ListDailyBookingsUseCase,
    BlockTimeSlotUseCase,
    CompleteBookingUseCase,

    // Auth
    JwtStrategy,
    {
      provide: 'IAuthService',
      useClass: JwtAuthService,
    },

    // Repositories
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'IBookingRepository',
      useClass: TypeOrmBookingRepository,
    },
    {
      provide: 'IBarberRepository',
      useClass: TypeOrmBarberRepository,
    },
    {
      provide: 'IServiceRepository',
      useClass: TypeOrmServiceRepository,
    },
    {
      provide: 'IBlockedSlotRepository',
      useClass: TypeOrmBlockedSlotRepository,
    },

    // Services
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
  exports: ['IAuthService'],
})
export class AdminModule {}

