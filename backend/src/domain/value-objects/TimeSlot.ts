export class TimeSlot {
  private readonly date: Date;
  private readonly startTime: Date;
  private readonly endTime: Date;

  private constructor(date: Date, startTime: Date, endTime: Date) {
    this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.startTime = startTime;
    this.endTime = endTime;
  }

  static create(
    date: Date,
    startHour: number,
    startMinute: number,
    durationMinutes: number,
  ): TimeSlot {
    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    const startTime = new Date(slotDate);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);

    if (startTime >= endTime) {
      throw new Error('Start time must be before end time');
    }

    if (endTime.getDate() !== startTime.getDate()) {
      throw new Error('Time slot cannot span multiple days');
    }

    return new TimeSlot(slotDate, startTime, endTime);
  }

  static fromDates(startTime: Date, endTime: Date): TimeSlot {
    if (startTime >= endTime) {
      throw new Error('Start time must be before end time');
    }

    const date = new Date(startTime);
    date.setHours(0, 0, 0, 0);

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end.getDate() !== start.getDate()) {
      throw new Error('Time slot cannot span multiple days');
    }

    return new TimeSlot(date, start, end);
  }

  getDate(): Date {
    return new Date(this.date);
  }

  getStartTime(): Date {
    return new Date(this.startTime);
  }

  getEndTime(): Date {
    return new Date(this.endTime);
  }

  getDurationMinutes(): number {
    return (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60);
  }

  overlaps(other: TimeSlot): boolean {
    return (
      this.startTime < other.endTime && this.endTime > other.startTime
    );
  }

  isBefore(other: TimeSlot): boolean {
    return this.endTime <= other.startTime;
  }

  isAfter(other: TimeSlot): boolean {
    return this.startTime >= other.endTime;
  }

  equals(other: TimeSlot): boolean {
    return (
      this.startTime.getTime() === other.startTime.getTime() &&
      this.endTime.getTime() === other.endTime.getTime()
    );
  }

  toString(): string {
    const startStr = this.startTime.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endStr = this.endTime.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${startStr} - ${endStr}`;
  }
}

