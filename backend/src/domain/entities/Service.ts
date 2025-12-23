import { Money } from '../value-objects/Money';

export class Service {
  private constructor(
    public readonly id: string,
    public readonly shopId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly durationMinutes: number,
    public readonly price: Money,
    public readonly isActive: boolean,
  ) {
    if (!id || !id.trim()) {
      throw new Error('Service ID cannot be empty');
    }
    if (!shopId || !shopId.trim()) {
      throw new Error('Shop ID cannot be empty');
    }
    if (!name || !name.trim()) {
      throw new Error('Service name cannot be empty');
    }
    if (durationMinutes <= 0 || durationMinutes > 480) {
      throw new Error('Service duration must be between 1 and 480 minutes');
    }
  }

  static create(
    id: string,
    shopId: string,
    name: string,
    description: string,
    durationMinutes: number,
    price: Money,
    isActive: boolean = true,
  ): Service {
    return new Service(
      id,
      shopId,
      name,
      description,
      durationMinutes,
      price,
      isActive,
    );
  }

  deactivate(): Service {
    return new Service(
      this.id,
      this.shopId,
      this.name,
      this.description,
      this.durationMinutes,
      this.price,
      false,
    );
  }

  activate(): Service {
    return new Service(
      this.id,
      this.shopId,
      this.name,
      this.description,
      this.durationMinutes,
      this.price,
      true,
    );
  }
}

