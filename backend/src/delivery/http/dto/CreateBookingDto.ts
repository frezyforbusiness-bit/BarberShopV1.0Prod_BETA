import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEmail, Min, Max } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @IsString()
  @IsNotEmpty()
  barberId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsNotEmpty()
  date: string; // YYYY-MM-DD

  @IsNumber()
  @Min(0)
  @Max(23)
  startHour: number;

  @IsNumber()
  @Min(0)
  @Max(59)
  startMinute: number;
}



