import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Order } from "@/modules/orders/entity/order.entity";

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  order_id!: number;

  @Column({ length: 255, nullable: true })
  transaction_code?: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number;

  @Column({ length: 50, nullable: true })
  payment_method?: string;

  @Column({ length: 50, nullable: true })
  status?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  // Relations
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order!: Order;
}
