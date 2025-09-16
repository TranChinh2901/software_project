import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Order } from "@/modules/orders/entity/order.entity";
import { PaymentMethod, TransactionStatus } from "@/constants/cart-type";

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, nullable: true })
  transaction_code?: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.COD })
  payment_method?: PaymentMethod;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status?: TransactionStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order!: Order;
}
