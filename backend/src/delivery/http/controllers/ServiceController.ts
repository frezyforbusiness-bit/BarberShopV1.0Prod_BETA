import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  SetMetadata,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ListServicesUseCase } from '../../../application/use-cases/service/ListServicesUseCase';
import { ListBarbersUseCase } from '../../../application/use-cases/service/ListBarbersUseCase';
import { CreateServiceUseCase } from '../../../application/use-cases/service/CreateServiceUseCase';
import { JwtAuthGuard } from '../../guards/JwtAuthGuard';

@Controller('shops')
export class ServiceController {
  constructor(
    private readonly listServicesUseCase: ListServicesUseCase,
    private readonly listBarbersUseCase: ListBarbersUseCase,
    private readonly createServiceUseCase: CreateServiceUseCase,
  ) {}

  @Get(':slug/services')
  @SetMetadata('isPublic', true)
  async listServices(@Param('slug') slug: string) {
    // ShopId will be resolved by tenant middleware from slug
    return this.listServicesUseCase.execute();
  }

  @Get(':slug/barbers')
  @SetMetadata('isPublic', true)
  async listBarbers(@Param('slug') slug: string) {
    // ShopId will be resolved by tenant middleware from slug
    return this.listBarbersUseCase.execute();
  }

  @Post('admin/services')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createService(@Body() dto: any) {
    return this.createServiceUseCase.execute(dto);
  }
}


