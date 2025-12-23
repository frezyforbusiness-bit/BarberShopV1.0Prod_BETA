import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAuthService, AuthTokens } from '../../application/ports/IAuthService';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../application/ports/IUserRepository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtAuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.isActive) {
      return null;
    }

    const isValid = await this.comparePassword(password, user.passwordHash);
    return isValid ? user : null;
  }

  async generateTokens(user: User): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      shopId: user.shopId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
        '7d',
      ),
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(
    token: string,
  ): Promise<{ userId: string; shopId: string } | null> {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = this.jwtService.verify(token, { secret });
      return {
        userId: payload.sub,
        shopId: payload.shopId,
      };
    } catch (error) {
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

