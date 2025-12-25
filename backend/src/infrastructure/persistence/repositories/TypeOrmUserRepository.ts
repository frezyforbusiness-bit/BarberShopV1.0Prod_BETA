import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../application/ports/IUserRepository';
import { User, UserRole } from '../../../domain/entities/User';
import { UserEntity } from '../entities/UserEntity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email: email.toLowerCase() },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async save(user: User): Promise<User> {
    const entity = this.repository.create({
      id: user.id,
      shopId: user.shopId,
      email: user.email.toLowerCase(),
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(user: User): Promise<User> {
    const entity = await this.repository.findOne({ where: { id: user.id } });
    if (!entity) {
      throw new Error('User not found');
    }
    entity.isActive = user.isActive;
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: UserEntity): User {
    return User.create(
      entity.id,
      entity.shopId,
      entity.email,
      entity.passwordHash,
      entity.role as UserRole,
      entity.isActive,
    );
  }
}


