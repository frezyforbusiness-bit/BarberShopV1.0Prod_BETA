import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from '../http/controllers/AdminController';
import { AdminLoginUseCase } from '../../application/use-cases/admin/AdminLoginUseCase';
import { ListDailyBookingsUseCase } from '../../application/use-cases/admin/ListDailyBookingsUseCase';
import { BlockTimeSlotUseCase } from '../../application/use-cases/admin/BlockTimeSlotUseCase';
import { JwtStrategy } from '../../infrastructure/auth/JwtStrategy';
import { JwtAuthService } from '../../infrastructure/auth/JwtAuthService';
import { PrismaUserRepository } from '../../infrastructure/persistence/repositories/PrismaUserRepository';
import { PrismaService } from '../../infrastructure/persistence/repositories/PrismaService';
import { TenantContext } from '../../infrastructure/tenant/TenantContext';
import { SystemClock } from '../../infrastructure/adapters/SystemClock';
import { UuidGenerator } from '../../infrastructure/adapters/UuidGenerator';

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
  ],
  controllers: [AdminController],
  providers: [
    // Use Cases
    AdminLoginUseCase,
    ListDailyBookingsUseCase,
    BlockTimeSlotUseCase,

    // Auth
    JwtStrategy,
    {
      provide: 'IAuthService',
      useClass: JwtAuthService,
    },

    // Repositories
    PrismaService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
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

