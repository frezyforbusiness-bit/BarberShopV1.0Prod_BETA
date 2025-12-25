import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AdminLoginUseCase } from '../../../application/use-cases/admin/AdminLoginUseCase';
import { ListDailyBookingsUseCase } from '../../../application/use-cases/admin/ListDailyBookingsUseCase';
import { CompleteBookingUseCase } from '../../../application/use-cases/booking/CompleteBookingUseCase';
import { BlockTimeSlotUseCase } from '../../../application/use-cases/admin/BlockTimeSlotUseCase';
import { AdminLoginDto } from '../dto/AdminLoginDto';
import { BlockTimeSlotDto } from '../dto/BlockTimeSlotDto';
import { JwtAuthGuard } from '../../guards/JwtAuthGuard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminLoginUseCase: AdminLoginUseCase,
    private readonly listDailyBookingsUseCase: ListDailyBookingsUseCase,
    private readonly completeBookingUseCase: CompleteBookingUseCase,
    private readonly blockTimeSlotUseCase: BlockTimeSlotUseCase,
  ) {}

  @Post('auth/login')
  @SetMetadata('isPublic', true)
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AdminLoginDto) {
    return this.adminLoginUseCase.execute(dto.email, dto.password);
  }

  @Get('bookings')
  @UseGuards(JwtAuthGuard)
  async listDailyBookings(@Query('date') date: string) {
    const dateObj = date ? new Date(date) : new Date();
    return this.listDailyBookingsUseCase.execute(dateObj);
  }

  @Post('bookings/:id/complete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async completeBooking(@Param('id') bookingId: string) {
    await this.completeBookingUseCase.execute(bookingId);
  }

  @Post('time-slots/block')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async blockTimeSlot(@Body() dto: BlockTimeSlotDto) {
    await this.blockTimeSlotUseCase.execute({
      shopId: '', // Will be set by tenant context
      barberId: dto.barberId,
      date: dto.date,
      startHour: dto.startHour,
      startMinute: dto.startMinute,
      durationMinutes: dto.durationMinutes,
      reason: dto.reason,
    });
  }
}



