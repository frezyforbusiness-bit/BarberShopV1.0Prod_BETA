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
import { CreateBookingUseCase } from '../../../application/use-cases/booking/CreateBookingUseCase';
import { ListAvailableSlotsUseCase } from '../../../application/use-cases/booking/ListAvailableSlotsUseCase';
import { CancelBookingUseCase } from '../../../application/use-cases/booking/CancelBookingUseCase';
import { CreateBookingDto } from '../dto/CreateBookingDto';
import { CancelBookingDto } from '../dto/CancelBookingDto';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly listAvailableSlotsUseCase: ListAvailableSlotsUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
  ) {}

  @Post()
  @SetMetadata('isPublic', true)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBookingDto) {
    return this.createBookingUseCase.execute(dto);
  }

  @Get('availability')
  @SetMetadata('isPublic', true)
  async listAvailableSlots(
    @Query('shopId') shopId: string,
    @Query('barberId') barberId: string,
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ) {
    const dateObj = new Date(date);
    return this.listAvailableSlotsUseCase.execute(
      shopId,
      barberId,
      serviceId,
      dateObj,
    );
  }

  @Post(':id/cancel')
  @SetMetadata('isPublic', true)
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(
    @Param('id') bookingId: string,
    @Body() dto: CancelBookingDto,
  ) {
    await this.cancelBookingUseCase.execute(bookingId, dto.cancellationCode);
  }
}



