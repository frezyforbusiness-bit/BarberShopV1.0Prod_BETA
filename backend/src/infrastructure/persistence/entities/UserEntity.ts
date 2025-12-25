import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { ShopEntity } from './ShopEntity';

@Entity('user')
@Unique(['shopId', 'email'])
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  shopId: string;

  @Column()
  @Index()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  role: string; // ADMIN, OWNER

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ShopEntity, (shop) => shop.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shopId' })
  shop: ShopEntity;
}



