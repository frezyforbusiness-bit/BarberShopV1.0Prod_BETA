import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not, Between } from 'typeorm';
import { IBookingRepository } from '../../../application/ports/IBookingRepository';
import { Booking, BookingStatus } from '../../../domain/entities/Booking';
import { TimeSlot } from '../../../domain/value-objects/TimeSlot';
import { Email } from '../../../domain/value-objects/Email';
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber';
import { BookingEntity } from '../entities/BookingEntity';

@Injectable()
export class TypeOrmBookingRepository implements IBookingRepository {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly repository: Repository<BookingEntity>,
  ) {}

  async save(booking: Booking): Promise<Booking> {
    const entity = this.repository.create({
      id: booking.id,
      shopId: booking.shopId,
      barberId: booking.barberId,
      serviceId: booking.serviceId,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone.getValue(),
      customerEmail: booking.customerEmail?.getValue() || null,
      date: booking.timeSlot.getDate(),
      startTime: booking.timeSlot.getStartTime(),
      endTime: booking.timeSlot.getEndTime(),
      status: booking.status,
      cancellationCode: booking.cancellationCode,
      createdAt: booking.createdAt,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Booking | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findBySlot(
    barberId: string,
    timeSlot: TimeSlot,
  ): Promise<Booking | null> {
    const entity = await this.repository.findOne({
      where: {
        barberId,
        status: Not('CANCELLED'),
        startTime: LessThanOrEqual(timeSlot.getEndTime()),
        endTime: MoreThanOrEqual(timeSlot.getStartTime()),
      },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByBarberAndDate(
    barberId: string,
    date: Date,
  ): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const entities = await this.repository.find({
      where: {
        barberId,
        date: Between(startOfDay, endOfDay),
      },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findByShopAndDate(shopId: string, date: Date): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const entities = await this.repository.find({
      where: {
        shopId,
        date: Between(startOfDay, endOfDay),
      },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findByCancellationCode(code: string): Promise<Booking | null> {
    const entity = await this.repository.findOne({
      where: { cancellationCode: code },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findOverlappingBookings(
    barberId: string,
    timeSlot: TimeSlot,
  ): Promise<Booking[]> {
    const entities = await this.repository.find({
      where: {
        barberId,
        status: Not('CANCELLED'),
        startTime: LessThanOrEqual(timeSlot.getEndTime()),
        endTime: MoreThanOrEqual(timeSlot.getStartTime()),
      },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async update(booking: Booking): Promise<Booking> {
    const entity = await this.repository.findOne({
      where: { id: booking.id },
    });
    if (!entity) {
      throw new Error('Booking not found');
    }
    entity.status = booking.status;
    entity.updatedAt = new Date();
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: BookingEntity): Booking {
    const timeSlot = TimeSlot.fromDates(
      new Date(entity.startTime),
      new Date(entity.endTime),
    );
    const customerPhone = PhoneNumber.create(entity.customerPhone);
    const customerEmail = entity.customerEmail
      ? Email.create(entity.customerEmail)
      : null;

    return Booking.reconstruct(
      entity.id,
      entity.shopId,
      entity.barberId,
      entity.serviceId,
      entity.customerName,
      customerPhone,
      customerEmail,
      timeSlot,
      entity.status as BookingStatus,
      new Date(entity.createdAt),
      entity.cancellationCode,
    );
  }
}

