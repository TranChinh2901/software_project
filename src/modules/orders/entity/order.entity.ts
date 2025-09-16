import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/users/entity/user.entity";
import { ShippingAddress } from "@/modules/shipping-address/entity/shipping-address.entity";
import { OrderStatus } from "../enums/order.enum";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column({ type: 'int' })
  shipping_address_id!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total_amount!: number;

  @Column('text', { nullable: true })
  note?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'shipping', 'completed', 'canceled'],
    default: 'pending'
  })
  status!: string;

  @Column('text', { nullable: true })
  cancel_reason?: string;

  @Column({
    type: 'enum',
    enum: ['COD', 'Momo', 'VNpay']
  })
  payment_method!: string;

  @Column({
    type: 'enum',
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  })
  payment_status!: string;

  @Column({ type: 'int', nullable: true })
  voucher_id?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => ShippingAddress)
  @JoinColumn({ name: 'shipping_address_id' })
  shipping_address!: ShippingAddress;
}
