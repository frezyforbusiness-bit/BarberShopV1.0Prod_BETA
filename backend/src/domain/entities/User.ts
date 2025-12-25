export enum UserRole {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export class User {
  private constructor(
    public readonly id: string,
    public readonly shopId: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
  ) {
    if (!id || !id.trim()) {
      throw new Error('User ID cannot be empty');
    }
    if (!shopId || !shopId.trim()) {
      throw new Error('Shop ID cannot be empty');
    }
    if (!email || !email.trim()) {
      throw new Error('Email cannot be empty');
    }
    if (!passwordHash || !passwordHash.trim()) {
      throw new Error('Password hash cannot be empty');
    }
  }

  static create(
    id: string,
    shopId: string,
    email: string,
    passwordHash: string,
    role: UserRole,
    isActive: boolean = true,
  ): User {
    return new User(id, shopId, email, passwordHash, role, isActive);
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.OWNER;
  }

  deactivate(): User {
    return new User(
      this.id,
      this.shopId,
      this.email,
      this.passwordHash,
      this.role,
      false,
    );
  }

  activate(): User {
    return new User(
      this.id,
      this.shopId,
      this.email,
      this.passwordHash,
      this.role,
      true,
    );
  }
}



