import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Order } from "@/modules/orders/entity/order.entity";
import { Product } from "@/modules/products/entity/product.entity";

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  order_id!: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column()
  product_id!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column()
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price!: number;

  @CreateDateColumn()
  created_at!: Date;
}
