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

@Entity('service')
export class ServiceEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  shopId: string;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column('int')
  durationMinutes: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceAmount: string;

  @Column({ default: 'EUR' })
  priceCurrency: string;

  @Column({ default: true })
  @Index(['shopId', 'isActive'])
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ShopEntity, (shop) => shop.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shopId' })
  shop: ShopEntity;

  @OneToMany(() => BookingEntity, (booking) => booking.service)
  bookings: BookingEntity[];
}



