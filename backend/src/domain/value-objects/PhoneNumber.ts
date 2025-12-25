export class PhoneNumber {
  private readonly value: string;

  private constructor(phoneNumber: string) {
    this.value = phoneNumber;
  }

  static create(phoneNumber: string): PhoneNumber {
    if (!phoneNumber || !phoneNumber.trim()) {
      throw new Error('Phone number cannot be empty');
    }

    // Normalize: remove spaces, dashes, parentheses
    const normalized = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Basic validation: should contain only digits and optional + prefix
    const phoneRegex = /^\+?[1-9]\d{8,14}$/;
    if (!phoneRegex.test(normalized)) {
      throw new Error('Invalid phone number format');
    }

    return new PhoneNumber(normalized);
  }

  getValue(): string {
    return this.value;
  }

  getFormatted(): string {
    // Simple formatting: +XX XXX XXX XXXX
    if (this.value.startsWith('+')) {
      return this.value.replace(/(\+?[0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})/, '$1 $2 $3 $4');
    }
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}


