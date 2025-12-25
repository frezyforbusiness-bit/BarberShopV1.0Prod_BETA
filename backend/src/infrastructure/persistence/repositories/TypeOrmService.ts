import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeOrmService implements OnModuleInit {
  constructor(public readonly dataSource: DataSource) {}

  async onModuleInit() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  getRepository<T>(entity: new () => T) {
    return this.dataSource.getRepository(entity);
  }
}



