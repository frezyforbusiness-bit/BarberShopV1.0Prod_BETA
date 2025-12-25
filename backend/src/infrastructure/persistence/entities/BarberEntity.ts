import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ShopEntity } from './ShopEntity';
import { BookingEntity } from './BookingEntity';
import { BlockedSlotEntity } from './BlockedSlotEntity';

@Entity('barber')
export class BarberEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  shopId: string;

  @Column()
  name: string;

  @Column('jsonb')
  workSchedule: any; // { monday: { start, end, isWorking }, ... }

  @Column({ default: true })
  @Index(['shopId', 'isActive'])
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ShopEntity, (shop) => shop.barbers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shopId' })
  shop: ShopEntity;

  @OneToMany(() => BookingEntity, (booking) => booking.barber)
  bookings: BookingEntity[];

  @OneToMany(() => BlockedSlotEntity, (slot) => slot.barber, { cascade: true })
  blockedSlots: BlockedSlotEntity[];
}



