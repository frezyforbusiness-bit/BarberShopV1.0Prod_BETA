import { IIdGenerator } from '../../domain/ports/IIdGenerator';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class UuidGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}


