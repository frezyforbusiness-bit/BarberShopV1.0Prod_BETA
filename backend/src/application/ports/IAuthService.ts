import { User } from '../../domain/entities/User';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  validateCredentials(email: string, password: string): Promise<User | null>;
  generateTokens(user: User): Promise<AuthTokens>;
  validateToken(token: string): Promise<{ userId: string; shopId: string } | null>;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}



