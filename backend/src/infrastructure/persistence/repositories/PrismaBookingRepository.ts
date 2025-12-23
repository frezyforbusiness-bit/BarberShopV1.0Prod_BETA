import { Injectable } from '@nestjs/common';
import { IBookingRepository } from '../../../application/ports/IBookingRepository';
import { Booking, BookingStatus } from '../../../domain/entities/Booking';
import { TimeSlot } from '../../../domain/value-objects/TimeSlot';
import { Email } from '../../../domain/value-objects/Email';
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber';
import { PrismaService } from './PrismaService';

@Injectable()
export class PrismaBookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(booking: Booking): Promise<Booking> {
    const prismaBooking = await this.prisma.booking.create({
      data: {
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
      },
    });

    return this.toDomain(prismaBooking);
  }

  async findById(id: string): Promise<Booking | null> {
    const prismaBooking = await this.prisma.booking.findUnique({
      where: { id },
    });

    return prismaBooking ? this.toDomain(prismaBooking) : null;
  }

  async findBySlot(
    barberId: string,
    timeSlot: TimeSlot,
  ): Promise<Booking | null> {
    const prismaBooking = await this.prisma.booking.findFirst({
      where: {
        barberId,
        status: { not: 'CANCELLED' },
        startTime: { lte: timeSlot.getEndTime() },
        endTime: { gte: timeSlot.getStartTime() },
      },
    });

    return prismaBooking ? this.toDomain(prismaBooking) : null;
  }

  async findByBarberAndDate(
    barberId: string,
    date: Date,
  ): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const prismaBookings = await this.prisma.booking.findMany({
      where: {
        barberId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return prismaBookings.map((b: any) => this.toDomain(b));
  }

  async findByShopAndDate(shopId: string, date: Date): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const prismaBookings = await this.prisma.booking.findMany({
      where: {
        shopId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return prismaBookings.map((b: any) => this.toDomain(b));
  }

  async findByCancellationCode(code: string): Promise<Booking | null> {
    const prismaBooking = await this.prisma.booking.findFirst({
      where: { cancellationCode: code },
    });

    return prismaBooking ? this.toDomain(prismaBooking) : null;
  }

  async findOverlappingBookings(
    barberId: string,
    timeSlot: TimeSlot,
  ): Promise<Booking[]> {
    const prismaBookings = await this.prisma.booking.findMany({
      where: {
        barberId,
        status: { not: 'CANCELLED' },
        startTime: { lt: timeSlot.getEndTime() },
        endTime: { gt: timeSlot.getStartTime() },
      },
    });

    return prismaBookings.map((b: any) => this.toDomain(b));
  }

  async update(booking: Booking): Promise<Booking> {
    const prismaBooking = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: booking.status,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(prismaBooking);
  }

  private toDomain(prismaBooking: any): Booking {
    const timeSlot = TimeSlot.fromDates(
      new Date(prismaBooking.startTime),
      new Date(prismaBooking.endTime),
    );

    const customerPhone = PhoneNumber.create(prismaBooking.customerPhone);
    const customerEmail = prismaBooking.customerEmail
      ? Email.create(prismaBooking.customerEmail)
      : null;

    return Booking.reconstruct(
      prismaBooking.id,
      prismaBooking.shopId,
      prismaBooking.barberId,
      prismaBooking.serviceId,
      prismaBooking.customerName,
      customerPhone,
      customerEmail,
      timeSlot,
      prismaBooking.status as BookingStatus,
      new Date(prismaBooking.createdAt),
      prismaBooking.cancellationCode,
    );
  }
}

