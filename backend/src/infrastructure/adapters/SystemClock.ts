import { IClock } from '../../domain/ports/IClock';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}



