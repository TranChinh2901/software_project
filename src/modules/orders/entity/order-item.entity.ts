import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "@/modules/orders/entity/order.entity";
import { ProductVariant } from "@/modules/product-variants/entity/product-variant";

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  order_id!: number;

  @Column({ type: 'int' })
  product_variant_id!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  // Relations
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'product_variant_id' })
  product_variant!: ProductVariant;
}
