import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Order } from "@/modules/orders/entity/order.entity";
import { OrderDetail } from "@/modules/orders/entity/order-item.entity";
import { User } from "@/modules/users/entity/user.entity";

@Entity('cancel_order')
export class CancelOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  order_id!: number;

  @Column({ type: 'int', nullable: true })
  order_detail_id?: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column('text', { nullable: true })
  reason?: string;

  @Column({ type: 'int', nullable: true })
  quantity?: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  refund_amount?: number;

  @Column({
    type: 'enum',
    enum: ['requested', 'approved', 'rejected', 'refunded']
  })
  status!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  processed_at?: Date;

  // Relations
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => OrderDetail)
  @JoinColumn({ name: 'order_detail_id' })
  order_detail?: OrderDetail;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
