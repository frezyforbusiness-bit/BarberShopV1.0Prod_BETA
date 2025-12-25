import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../ports/IUserRepository';
import { IAuthService } from '../../ports/IAuthService';
import { ITenantContext } from '../../ports/ITenantContext';
import { AuthResponse } from '../../dto/AuthResponse';

@Injectable()
export class AdminLoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
    @Inject('ITenantContext')
    private readonly tenantContext: ITenantContext,
  ) {}

  async execute(email: string, password: string): Promise<AuthResponse> {
    // Validate credentials
    const user = await this.authService.validateCredentials(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('User account is not active');
    }

    // Validate tenant context matches user shop
    const contextShopId = this.tenantContext.getShopId();
    if (contextShopId && user.shopId !== contextShopId) {
      throw new Error('Shop ID mismatch');
    }

    // Set tenant context if not set
    if (!contextShopId) {
      this.tenantContext.setShopId(user.shopId);
    }

    // Generate tokens
    const tokens = await this.authService.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        shopId: user.shopId,
      },
    };
  }
}


