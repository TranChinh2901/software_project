import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "@/modules/users/entity/user.entity";
import { ShippingAddress } from "@/modules/shipping-address/entity/shipping-address.entity";
import { Voucher } from "@/modules/vouchers/entity/voucher.entity";
import { OrderType, PaymentMethod, PaymentStatus } from "../enum/order.enum";
import { OrderDetail } from "./order-detail.entity";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total_amount!: number;

  @Column('text', { nullable: true })
  note?: string;


  @Column({type: 'enum', enum: OrderType, default: OrderType.PENDING})
  status!: OrderType;

  @Column('text', { nullable: true })
  cancel_reason?: string;

  @Column({type: 'enum', enum: PaymentMethod, default: PaymentMethod.COD})
  payment_method!: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID
  })
  payment_status!: PaymentStatus;

  @Column({ type: 'int', nullable: true })
  voucher_id?: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column({ type: 'int' })
  shipping_address_id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => ShippingAddress)
  @JoinColumn({ name: 'shipping_address_id' })
  shipping_address!: ShippingAddress;

  @ManyToOne(() => Voucher, { nullable: true })
  @JoinColumn({ name: 'voucher_id' })
  voucher?: Voucher;

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
  order_items?: OrderDetail[];
}
