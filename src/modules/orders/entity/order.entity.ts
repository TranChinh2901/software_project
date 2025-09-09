import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/users/entity/user.entity";
import { OrderStatus } from "../enums/order.enum";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shipping_fee!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount_amount!: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status!: OrderStatus;

  @Column('json')
  shipping_address!: {
    fullname: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };

  @Column({ nullable: true })
  payment_method?: string;

  @Column({ nullable: true })
  payment_status?: string;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
