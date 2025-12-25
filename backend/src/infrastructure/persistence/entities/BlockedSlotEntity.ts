import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ShopEntity } from './ShopEntity';
import { BarberEntity } from './BarberEntity';

@Entity('blocked_slot')
export class BlockedSlotEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  shopId: string;

  @Column('uuid')
  @Index(['barberId', 'date'])
  @Index(['shopId', 'date'])
  barberId: string;

  @Column('date')
  date: Date;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column()
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ShopEntity, (shop) => shop.blockedSlots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shopId' })
  shop: ShopEntity;

  @ManyToOne(() => BarberEntity, (barber) => barber.blockedSlots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'barberId' })
  barber: BarberEntity;
}


