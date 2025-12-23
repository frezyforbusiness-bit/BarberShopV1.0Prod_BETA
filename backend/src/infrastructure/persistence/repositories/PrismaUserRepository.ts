import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../application/ports/IUserRepository';
import { User, UserRole } from '../../../domain/entities/User';
import { PrismaService } from './PrismaService';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async save(user: User): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: {
        id: user.id,
        shopId: user.shopId,
        email: user.email.toLowerCase(),
        passwordHash: user.passwordHash,
        role: user.role,
        isActive: user.isActive,
      },
    });

    return this.toDomain(prismaUser);
  }

  async update(user: User): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: user.isActive,
      },
    });

    return this.toDomain(prismaUser);
  }

  private toDomain(prismaUser: any): User {
    return User.create(
      prismaUser.id,
      prismaUser.shopId,
      prismaUser.email,
      prismaUser.passwordHash,
      prismaUser.role as UserRole,
      prismaUser.isActive,
    );
  }
}

