import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './UserEntity';
import { BarberEntity } from './BarberEntity';
import { ServiceEntity } from './ServiceEntity';
import { BookingEntity } from './BookingEntity';
import { BlockedSlotEntity } from './BlockedSlotEntity';

@Entity('shop')
export class ShopEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column('jsonb')
  settings: any; // { openingTime, closingTime, timezone, slotDurationMinutes, bookingAdvanceDays }

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserEntity, (user) => user.shop, { cascade: true })
  users: UserEntity[];

  @OneToMany(() => BarberEntity, (barber) => barber.shop, { cascade: true })
  barbers: BarberEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.shop, { cascade: true })
  services: ServiceEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.shop, { cascade: true })
  bookings: BookingEntity[];

  @OneToMany(() => BlockedSlotEntity, (slot) => slot.shop, { cascade: true })
  blockedSlots: BlockedSlotEntity[];
}



