import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { BookingModule } from './BookingModule';
import { AdminModule } from './AdminModule';
import { TenantContextMiddleware } from '../../infrastructure/tenant/TenantContextMiddleware';
import { TenantContext } from '../../infrastructure/tenant/TenantContext';
import { PrismaShopRepository } from '../../infrastructure/persistence/repositories/PrismaShopRepository';
import { PrismaService } from '../../infrastructure/persistence/repositories/PrismaService';
import { DomainExceptionFilter } from '../http/filters/DomainExceptionFilter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BookingModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    TenantContext,
    PrismaService,
    PrismaShopRepository,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantContextMiddleware)
      .forRoutes('*');
  }
}

