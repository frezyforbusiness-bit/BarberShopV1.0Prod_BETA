import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class BlockTimeSlotDto {
  @IsString()
  @IsNotEmpty()
  barberId: string;

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

  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}


