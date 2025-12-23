import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ShopEntity } from './ShopEntity';
import { BarberEntity } from './BarberEntity';
import { ServiceEntity } from './ServiceEntity';

@Entity('booking')
export class BookingEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  shopId: string;

  @Column('uuid')
  @Index()
  barberId: string;

  @Column('uuid')
  serviceId: string;

  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true })
  customerEmail: string | null;

  @Column('date')
  @Index(['shopId', 'date'])
  @Index(['barberId', 'date'])
  date: Date;

  @Column('timestamp')
  @Index(['shopId', 'startTime', 'endTime'])
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column()
  @Index()
  status: string; // PENDING, CONFIRMED, COMPLETED, CANCELLED

  @Column()
  @Index()
  cancellationCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ShopEntity, (shop) => shop.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shopId' })
  shop: ShopEntity;

  @ManyToOne(() => BarberEntity, (barber) => barber.bookings, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'barberId' })
  barber: BarberEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.bookings, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;
}

