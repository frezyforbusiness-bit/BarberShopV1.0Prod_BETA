export interface WorkSchedule {
  monday: { start: string; end: string; isWorking: boolean };
  tuesday: { start: string; end: string; isWorking: boolean };
  wednesday: { start: string; end: string; isWorking: boolean };
  thursday: { start: string; end: string; isWorking: boolean };
  friday: { start: string; end: string; isWorking: boolean };
  saturday: { start: string; end: string; isWorking: boolean };
  sunday: { start: string; end: string; isWorking: boolean };
}

export class Barber {
  private constructor(
    public readonly id: string,
    public readonly shopId: string,
    public readonly name: string,
    public readonly workSchedule: WorkSchedule,
    public readonly isActive: boolean,
  ) {
    if (!id || !id.trim()) {
      throw new Error('Barber ID cannot be empty');
    }
    if (!shopId || !shopId.trim()) {
      throw new Error('Shop ID cannot be empty');
    }
    if (!name || !name.trim()) {
      throw new Error('Barber name cannot be empty');
    }
    this.validateWorkSchedule(workSchedule);
  }

  static create(
    id: string,
    shopId: string,
    name: string,
    workSchedule: WorkSchedule,
    isActive: boolean = true,
  ): Barber {
    return new Barber(id, shopId, name, workSchedule, isActive);
  }

  private validateWorkSchedule(schedule: WorkSchedule): void {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    for (const day of days) {
      const daySchedule = schedule[day as keyof WorkSchedule];
      if (daySchedule.isWorking) {
        if (!timeRegex.test(daySchedule.start) || !timeRegex.test(daySchedule.end)) {
          throw new Error(`Invalid time format for ${day}. Use HH:mm`);
        }
      }
    }
  }

  isWorkingAt(dayOfWeek: number, hour: number, minute: number): boolean {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[dayOfWeek] as keyof WorkSchedule;
    const daySchedule = this.workSchedule[dayName];

    if (!daySchedule.isWorking) {
      return false;
    }

    const [startHour, startMinute] = daySchedule.start.split(':').map(Number);
    const [endHour, endMinute] = daySchedule.end.split(':').map(Number);

    const currentMinutes = hour * 60 + minute;
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  deactivate(): Barber {
    return new Barber(this.id, this.shopId, this.name, this.workSchedule, false);
  }

  activate(): Barber {
    return new Barber(this.id, this.shopId, this.name, this.workSchedule, true);
  }
}

