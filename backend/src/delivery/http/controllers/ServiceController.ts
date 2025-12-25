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
  HttpException,
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
    try {
      return await this.listServicesUseCase.execute();
    } catch (error: any) {
      if (error.message?.includes('required') || error.message?.includes('not set')) {
        throw new HttpException(
          `Shop with slug '${slug}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  @Get(':slug/barbers')
  @SetMetadata('isPublic', true)
  async listBarbers(@Param('slug') slug: string) {
    // ShopId will be resolved by tenant middleware from slug
    // Se lo shop non viene trovato, il middleware non imposta shopId
    // e requireShopId() lancerà un errore
    try {
      return await this.listBarbersUseCase.execute();
    } catch (error: any) {
      if (error.message?.includes('required') || error.message?.includes('not set')) {
        throw new HttpException(
          `Shop with slug '${slug}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  @Post('admin/services')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createService(@Body() dto: any) {
    return this.createServiceUseCase.execute(dto);
  }
}



