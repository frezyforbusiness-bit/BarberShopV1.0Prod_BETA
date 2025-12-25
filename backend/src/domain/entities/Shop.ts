export interface ShopSettings {
  openingTime: string; // HH:mm format
  closingTime: string; // HH:mm format
  timezone: string;
  slotDurationMinutes: number; // default 30
  bookingAdvanceDays: number; // how many days in advance can book
}

export class Shop {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly settings: ShopSettings,
    public readonly isActive: boolean,
  ) {
    if (!id || !id.trim()) {
      throw new Error('Shop ID cannot be empty');
    }
    if (!name || !name.trim()) {
      throw new Error('Shop name cannot be empty');
    }
    if (!slug || !slug.trim()) {
      throw new Error('Shop slug cannot be empty');
    }
    if (!this.isValidSlug(slug)) {
      throw new Error('Shop slug must be alphanumeric with hyphens only');
    }
    this.validateSettings(settings);
  }

  static create(
    id: string,
    name: string,
    slug: string,
    settings: ShopSettings,
    isActive: boolean = true,
  ): Shop {
    return new Shop(id, name, slug, settings, isActive);
  }

  private isValidSlug(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug);
  }

  private validateSettings(settings: ShopSettings): void {
    if (!settings.openingTime || !settings.closingTime) {
      throw new Error('Opening and closing times are required');
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(settings.openingTime) || !timeRegex.test(settings.closingTime)) {
      throw new Error('Invalid time format. Use HH:mm');
    }

    if (settings.slotDurationMinutes <= 0 || settings.slotDurationMinutes > 480) {
      throw new Error('Slot duration must be between 1 and 480 minutes');
    }

    if (settings.bookingAdvanceDays < 0 || settings.bookingAdvanceDays > 365) {
      throw new Error('Booking advance days must be between 0 and 365');
    }
  }

  isOpenAt(hour: number, minute: number): boolean {
    const [openHour, openMinute] = this.settings.openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = this.settings.closingTime.split(':').map(Number);

    const currentMinutes = hour * 60 + minute;
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }
}



